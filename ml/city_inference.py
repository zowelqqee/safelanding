"""PyTorch city model inference.

This module is intentionally framework-agnostic so the same predictor can be
used by the local stdlib HTTP server now and a production API wrapper later.
"""

from __future__ import annotations

import math
import os
from functools import lru_cache
from pathlib import Path
from typing import Any, Mapping

import torch
import torch.nn as nn

from relocation_dataset.cities import city_id_to_name
from relocation_dataset.encoders import encode_profile, get_feature_names


ROOT_DIR = Path(__file__).resolve().parents[1]
DEFAULT_MODEL_PATH = ROOT_DIR / "city_model.pt"


def _resolve_model_path() -> Path:
    model_path = os.environ.get("CITY_MODEL_PATH")
    if not model_path:
        return DEFAULT_MODEL_PATH
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


@lru_cache(maxsize=1)
def _load_model() -> nn.Sequential:
    model_path = _resolve_model_path()
    if not model_path.exists():
        raise FileNotFoundError(f"City model file was not found: {model_path}")

    model = _build_model()
    try:
        state_dict = torch.load(model_path, map_location="cpu", weights_only=True)
    except TypeError:
        state_dict = torch.load(model_path, map_location="cpu")

    model.load_state_dict(state_dict)
    model.eval()
    return model


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

    predictions = []
    for rank_index, (city_id, probability) in enumerate(
        zip(top.indices.tolist(), top.values.tolist())
    ):
        match_score = _display_match_score(float(probability), rank_index)
        predictions.append(
            {
                "rank": rank_index + 1,
                "city_model_id": int(city_id),
                "city_name": city_id_to_name[int(city_id)],
                "raw_probability": float(probability),
                "score": int(round(match_score * 100)),
            }
        )

    return {
        "model_version": _resolve_model_path().name,
        "predictions": predictions,
    }
