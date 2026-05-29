"""Training and inference helpers for city explanation heads.

The explanation dataset is shaped as:

    profile + candidate city -> reason_ids + risk_ids + blocker_id

For model training and inference, `X` is the concatenated profile and city
feature vector. The model has three heads:

* reasons: multi-label, 16 logits, decoded with sigmoid + top-k
* risks: multi-label, 16 logits, decoded with sigmoid + top-k
* blockers: multiclass, 12 logits, decoded with argmax
"""

from __future__ import annotations

import argparse
import json
import sys
from collections.abc import Iterable, Sequence
from pathlib import Path
from typing import Any, Literal, TypedDict

import torch
import torch.nn as nn
import torch.optim as optim

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from relocation_dataset.cities import city_profiles
from relocation_dataset.explanations import (
    DEFAULT_BLOCKER_ID,
    MODEL_BLOCKER_IDS,
    MODEL_REASON_IDS,
    MODEL_RISK_IDS,
    blocker_id_from_index,
    reason_id_from_index,
    risk_id_from_index,
)
from relocation_dataset.schemas import CityProfile


ExplanationHead = Literal["reasons", "risks", "blockers"]

DEFAULT_EXPLANATION_MODEL_PATH = PROJECT_ROOT / "city_explanations.pt"
DEFAULT_TRAIN_PATH = PROJECT_ROOT / "ml/datasets/city_explanations_train.jsonl"
DEFAULT_VALIDATION_PATH = PROJECT_ROOT / "ml/datasets/city_explanations_validation.jsonl"

CITY_FEATURE_NAMES = [
    "cost_level",
    "warm_climate",
    "sea_nearby",
    "big_city",
    "english_friendly",
    "expat_community",
    "family_friendly",
    "career_opportunities",
    "calm_lifestyle",
    "student_life",
    "good_transport",
    "bureaucracy_difficulty",
    "housing_difficulty",
    "legal_path_clarity",
    "long_term_stability",
    "earning_upside",
]


class ExplanationPrediction(TypedDict):
    reason_ids: list[str]
    risk_ids: list[str]
    blocker_id: str


class CityExplanationModel(nn.Module):
    def __init__(
        self,
        input_size: int,
        hidden_size: int = 92,
        reason_count: int = len(MODEL_REASON_IDS),
        risk_count: int = len(MODEL_RISK_IDS),
        blocker_count: int = len(MODEL_BLOCKER_IDS),
    ) -> None:
        super().__init__()
        self.reason_model = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, reason_count),
        )
        self.risk_model = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, risk_count),
        )
        self.blocker_model = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, blocker_count),
        )

    def forward(self, x: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        return (
            self.reason_model(x),
            self.risk_model(x),
            self.blocker_model(x),
        )


def city_feature_vector(city: CityProfile) -> list[float]:
    return [float(getattr(city, field_name)) for field_name in CITY_FEATURE_NAMES]


def explanation_x_from_parts(
    profile_feature_values: Sequence[float],
    city_feature_values: Sequence[float],
) -> list[float]:
    return [*profile_feature_values, *city_feature_values]


def explanation_x_for_city(profile_feature_values: Sequence[float], city_id: int) -> list[float]:
    return explanation_x_from_parts(profile_feature_values, city_feature_vector(city_profiles[city_id]))


def _ids_from_indices(
    indices: Iterable[int],
    lookup: Any,
    limit: int | None = None,
) -> list[str]:
    ids: list[str] = []
    seen: set[str] = set()

    for index in indices:
        explanation_id = lookup(int(index))
        if explanation_id is None or explanation_id in seen:
            continue

        ids.append(explanation_id)
        seen.add(explanation_id)

        if limit is not None and len(ids) >= limit:
            break

    return ids


def reason_ids_from_indices(indices: Iterable[int], limit: int | None = None) -> list[str]:
    return _ids_from_indices(indices, reason_id_from_index, limit)


def risk_ids_from_indices(indices: Iterable[int], limit: int | None = None) -> list[str]:
    return _ids_from_indices(indices, risk_id_from_index, limit)


def explanation_ids_from_output(
    *,
    reason_indices: Iterable[int] = (),
    risk_indices: Iterable[int] = (),
    blocker_index: int | None = None,
    reason_limit: int = 3,
    risk_limit: int = 3,
) -> ExplanationPrediction:
    blocker_id = (
        blocker_id_from_index(int(blocker_index))
        if blocker_index is not None
        else DEFAULT_BLOCKER_ID
    )

    return {
        "reason_ids": reason_ids_from_indices(reason_indices, limit=reason_limit),
        "risk_ids": risk_ids_from_indices(risk_indices, limit=risk_limit),
        "blocker_id": blocker_id,
    }


def load_city_explanation_rows(path: str | Path) -> list[dict[str, Any]]:
    dataset_path = Path(path).expanduser()
    if not dataset_path.exists() and not dataset_path.is_absolute():
        dataset_path = PROJECT_ROOT / dataset_path

    with dataset_path.open(encoding="utf-8") as file:
        return [json.loads(line) for line in file if line.strip()]


def x_from_row(row: dict[str, Any]) -> list[float]:
    return explanation_x_from_parts(
        row["profile_feature_values"],
        row["city"]["feature_values"],
    )


def y_from_row(row: dict[str, Any], head: ExplanationHead) -> list[int] | int:
    labels = row["labels"]

    if head == "reasons":
        return labels["reason_vector"]
    if head == "risks":
        return labels["risk_vector"]
    if head == "blockers":
        return int(labels["blocker_index"])

    raise ValueError(f"Unknown explanation head: {head}")


def xy_from_rows(
    rows: Sequence[dict[str, Any]],
    head: ExplanationHead,
) -> tuple[torch.Tensor, torch.Tensor]:
    x = torch.tensor([x_from_row(row) for row in rows], dtype=torch.float32)

    if head == "blockers":
        y = torch.tensor([y_from_row(row, head) for row in rows], dtype=torch.long)
    else:
        y = torch.tensor([y_from_row(row, head) for row in rows], dtype=torch.float32)

    return x, y


def load_explanation_xy(
    path: str | Path,
    head: ExplanationHead,
) -> tuple[torch.Tensor, torch.Tensor]:
    return xy_from_rows(load_city_explanation_rows(path), head)


def build_explanation_model(input_size: int = 92) -> CityExplanationModel:
    return CityExplanationModel(input_size=input_size)


def _overlap_at_k(logits: torch.Tensor, y: torch.Tensor, k: int = 3) -> float:
    probs = torch.sigmoid(logits)
    pred_idx = torch.topk(probs, k=k, dim=1).indices
    true_idx = [torch.where(row == 1)[0] for row in y]

    overlaps: list[float] = []
    for pred, true in zip(pred_idx, true_idx):
        overlap = len(set(pred.tolist()) & set(true.tolist()))
        overlaps.append(overlap / max(1, len(true)))

    return sum(overlaps) / len(overlaps)


def _accuracy(logits: torch.Tensor, y: torch.Tensor) -> float:
    pred = logits.argmax(dim=1)
    return (pred == y).float().mean().item()


def train_explanation_model(
    *,
    train_path: str | Path = DEFAULT_TRAIN_PATH,
    validation_path: str | Path = DEFAULT_VALIDATION_PATH,
    output_path: str | Path = DEFAULT_EXPLANATION_MODEL_PATH,
    epochs: int = 100,
    batch_size: int = 32,
    learning_rate: float = 0.01,
    seed: int = 1,
) -> dict[str, float]:
    torch.manual_seed(seed)

    x_train, y_reason_train = load_explanation_xy(train_path, "reasons")
    _, y_risk_train = load_explanation_xy(train_path, "risks")
    _, y_blocker_train = load_explanation_xy(train_path, "blockers")

    x_val, y_reason_val = load_explanation_xy(validation_path, "reasons")
    _, y_risk_val = load_explanation_xy(validation_path, "risks")
    _, y_blocker_val = load_explanation_xy(validation_path, "blockers")

    model = build_explanation_model(input_size=x_train.shape[1])
    reason_loss = nn.BCEWithLogitsLoss()
    risk_loss = nn.BCEWithLogitsLoss()
    blocker_loss = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    for _epoch in range(epochs):
        permutation = torch.randperm(len(x_train))

        for start in range(0, len(x_train), batch_size):
            idx = permutation[start : start + batch_size]
            xb = x_train[idx]

            reason_logits, risk_logits, blocker_logits = model(xb)
            loss = (
                reason_loss(reason_logits, y_reason_train[idx])
                + risk_loss(risk_logits, y_risk_train[idx])
                + blocker_loss(blocker_logits, y_blocker_train[idx])
            )

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

    model.eval()
    with torch.no_grad():
        reason_logits, risk_logits, blocker_logits = model(x_val)
        metrics = {
            "reason_overlap_at_3": _overlap_at_k(reason_logits, y_reason_val, k=3),
            "risk_overlap_at_3": _overlap_at_k(risk_logits, y_risk_val, k=3),
            "blocker_accuracy": _accuracy(blocker_logits, y_blocker_val),
        }

    output_model_path = Path(output_path).expanduser()
    torch.save(
        {
            "state_dict": model.state_dict(),
            "input_size": x_train.shape[1],
            "metrics": metrics,
            "reason_ids": MODEL_REASON_IDS,
            "risk_ids": MODEL_RISK_IDS,
            "blocker_ids": MODEL_BLOCKER_IDS,
        },
        output_model_path,
    )
    return metrics


def load_explanation_model(path: str | Path = DEFAULT_EXPLANATION_MODEL_PATH) -> CityExplanationModel:
    model_path = Path(path).expanduser()
    try:
        artifact = torch.load(model_path, map_location="cpu", weights_only=True)
    except TypeError:
        artifact = torch.load(model_path, map_location="cpu")

    input_size = int(artifact.get("input_size", 92))
    model = build_explanation_model(input_size=input_size)
    model.load_state_dict(artifact["state_dict"])
    model.eval()
    return model


def predict_explanations(
    model: CityExplanationModel,
    x: Sequence[Sequence[float]] | torch.Tensor,
    *,
    reason_limit: int = 3,
    risk_limit: int = 3,
) -> list[ExplanationPrediction]:
    x_tensor = x if isinstance(x, torch.Tensor) else torch.tensor(x, dtype=torch.float32)
    if x_tensor.dim() == 1:
        x_tensor = x_tensor.unsqueeze(0)

    with torch.no_grad():
        reason_logits, risk_logits, blocker_logits = model(x_tensor.float())
        reason_probs = torch.sigmoid(reason_logits)
        risk_probs = torch.sigmoid(risk_logits)
        reason_indices = torch.topk(reason_probs, k=reason_limit, dim=1).indices.tolist()
        risk_indices = torch.topk(risk_probs, k=risk_limit, dim=1).indices.tolist()
        blocker_indices = blocker_logits.argmax(dim=1).tolist()

    return [
        explanation_ids_from_output(
            reason_indices=reasons,
            risk_indices=risks,
            blocker_index=blocker,
            reason_limit=reason_limit,
            risk_limit=risk_limit,
        )
        for reasons, risks, blocker in zip(reason_indices, risk_indices, blocker_indices)
    ]


def main() -> None:
    parser = argparse.ArgumentParser(description="Train city explanation heads")
    parser.add_argument("--train", default=str(DEFAULT_TRAIN_PATH))
    parser.add_argument("--validation", default=str(DEFAULT_VALIDATION_PATH))
    parser.add_argument("--output", default=str(DEFAULT_EXPLANATION_MODEL_PATH))
    parser.add_argument("--epochs", type=int, default=100)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--learning-rate", type=float, default=0.01)
    parser.add_argument("--seed", type=int, default=1)
    args = parser.parse_args()

    metrics = train_explanation_model(
        train_path=args.train,
        validation_path=args.validation,
        output_path=args.output,
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.learning_rate,
        seed=args.seed,
    )
    print(json.dumps(metrics, indent=2, sort_keys=True))


__all__ = [
    "CITY_FEATURE_NAMES",
    "DEFAULT_BLOCKER_ID",
    "DEFAULT_EXPLANATION_MODEL_PATH",
    "MODEL_BLOCKER_IDS",
    "MODEL_REASON_IDS",
    "MODEL_RISK_IDS",
    "CityExplanationModel",
    "ExplanationHead",
    "ExplanationPrediction",
    "blocker_id_from_index",
    "build_explanation_model",
    "city_feature_vector",
    "explanation_ids_from_output",
    "explanation_x_for_city",
    "explanation_x_from_parts",
    "load_city_explanation_rows",
    "load_explanation_model",
    "load_explanation_xy",
    "predict_explanations",
    "reason_ids_from_indices",
    "risk_ids_from_indices",
    "train_explanation_model",
    "x_from_row",
    "xy_from_rows",
    "y_from_row",
]


if __name__ == "__main__":
    main()
