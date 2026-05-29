"""PyTorch city model inference.

This module is intentionally framework-agnostic so the same predictor can be
used by the local stdlib HTTP server now and a production API wrapper later.
"""

from __future__ import annotations

import math
import os
from pathlib import Path
from threading import RLock
from typing import Any, Mapping

import torch
import torch.nn as nn

from relocation_dataset.cities import city_id_to_name
from relocation_dataset.encoders import encode_profile, get_feature_names

from .city_comment import (
    CityExplanationModel,
    explanation_x_for_city,
    load_explanation_model,
    predict_explanations,
)


ROOT_DIR = Path(__file__).resolve().parents[1]
DEFAULT_MODEL_PATH = ROOT_DIR / "city_model.pt"
DEFAULT_EXPLANATION_MODEL_PATH = ROOT_DIR / "city_explanations.pt"
_MODEL_CACHE: tuple[Path, float, nn.Sequential] | None = None
_EXPLANATION_MODEL_CACHE: tuple[Path, float, CityExplanationModel] | None = None
_MODEL_CACHE_LOCK = RLock()


def _resolve_model_path() -> Path:
    model_path = os.environ.get("CITY_MODEL_PATH")
    if not model_path:
        return DEFAULT_MODEL_PATH
    return Path(model_path).expanduser().resolve()


def _resolve_explanation_model_path() -> Path:
    model_path = os.environ.get("CITY_EXPLANATION_MODEL_PATH")
    if not model_path:
        return DEFAULT_EXPLANATION_MODEL_PATH
    return Path(model_path).expanduser().resolve()


def _build_model() -> nn.Sequential:
    input_size = len(get_feature_names())
    output_size = len(city_id_to_name)

    return nn.Sequential(
        nn.Linear(input_size, 64),
        nn.ReLU(),
        nn.Linear(64, 64),
        nn.ReLU(),
        nn.Linear(64, output_size),
    )


def _load_model() -> nn.Sequential:
    global _MODEL_CACHE

    model_path = _resolve_model_path()
    if not model_path.exists():
        raise FileNotFoundError(f"City model file was not found: {model_path}")

    model_mtime = model_path.stat().st_mtime
    with _MODEL_CACHE_LOCK:
        if _MODEL_CACHE is not None:
            cached_path, cached_mtime, cached_model = _MODEL_CACHE
            if cached_path == model_path and cached_mtime == model_mtime:
                return cached_model

        model = _build_model()
        try:
            state_dict = torch.load(model_path, map_location="cpu", weights_only=True)
        except TypeError:
            state_dict = torch.load(model_path, map_location="cpu")

        model.load_state_dict(state_dict)
        model.eval()
        _MODEL_CACHE = (model_path, model_mtime, model)
        return model


def _load_explanation_model() -> CityExplanationModel | None:
    global _EXPLANATION_MODEL_CACHE

    model_path = _resolve_explanation_model_path()
    if not model_path.exists():
        return None

    model_mtime = model_path.stat().st_mtime
    with _MODEL_CACHE_LOCK:
        if _EXPLANATION_MODEL_CACHE is not None:
            cached_path, cached_mtime, cached_model = _EXPLANATION_MODEL_CACHE
            if cached_path == model_path and cached_mtime == model_mtime:
                return cached_model

        model = load_explanation_model(model_path)
        _EXPLANATION_MODEL_CACHE = (model_path, model_mtime, model)
        return model


def get_model_metadata() -> dict[str, Any]:
    """Return lightweight metadata for health checks and deploy verification."""

    model_path = _resolve_model_path()
    return {
        "model_version": model_path.name,
        "feature_count": len(get_feature_names()),
        "city_count": len(city_id_to_name),
        "loaded": _MODEL_CACHE is not None and _MODEL_CACHE[0] == model_path,
        "explanation_model_version": _resolve_explanation_model_path().name,
        "explanation_model_exists": _resolve_explanation_model_path().exists(),
        "explanation_model_loaded": (
            _EXPLANATION_MODEL_CACHE is not None
            and _EXPLANATION_MODEL_CACHE[0] == _resolve_explanation_model_path()
        ),
    }


def warm_model() -> dict[str, Any]:
    """Load the model once and return metadata if the artifact is usable."""

    _load_model()
    _load_explanation_model()
    return get_model_metadata()


def _sigmoid(value: float) -> float:
    k = 20
    a = -0.1
    return 1 / (1 + math.exp(-k * (value + a)))


def _display_match_score(raw_probability: float, rank_index: int) -> float:
    base_score = _sigmoid(raw_probability)
    rank_ceiling = 0.98 + (_sigmoid(-(rank_index / 30 - 0.01)) - 0.13) / 2
    return min(base_score, rank_ceiling)


def predict_cities(profile: Mapping[str, Any], top_k: int = 58) -> dict[str, Any]:
    """Return ranked city predictions for an encoded onboarding profile."""

    model = _load_model()
    x, _feature_names = encode_profile(profile)
    x_tensor = torch.tensor([x], dtype=torch.float32)
    city_count = len(city_id_to_name)
    safe_top_k = max(1, min(int(top_k), city_count))

    with torch.no_grad():
        logits = model(x_tensor)
        probabilities = torch.softmax(logits, dim=1)[0]
        top = probabilities.topk(safe_top_k)

    top_city_ids = [int(city_id) for city_id in top.indices.tolist()]
    explanation_model = _load_explanation_model()
    explanations = []
    if explanation_model is not None:
        explanation_x = [explanation_x_for_city(x, city_id) for city_id in top_city_ids]
        explanations = predict_explanations(explanation_model, explanation_x)

    predictions = []
    for rank_index, (city_id, probability) in enumerate(zip(top_city_ids, top.values.tolist())):
        match_score = _display_match_score(float(probability), rank_index)
        prediction = {
            "rank": rank_index + 1,
            "city_model_id": city_id,
            "city_name": city_id_to_name[city_id],
            "raw_probability": float(probability),
            "score": int(round(match_score * 100)),
        }
        if rank_index < len(explanations):
            prediction.update(explanations[rank_index])

        predictions.append(prediction)

    return {
        "model_version": _resolve_model_path().name,
        "explanation_model_version": (
            _resolve_explanation_model_path().name if explanation_model is not None else ""
        ),
        "predictions": predictions,
    }
