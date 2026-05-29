"""Build a supervised dataset for structured city explanation heads.

This dataset is intentionally deterministic. It uses the existing relocation
teacher scorer for candidate selection, then applies an explanation teacher to
produce reason/risk/blocker labels.
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from collections import Counter, defaultdict
from dataclasses import asdict
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from relocation_dataset.cities import city_id_to_name, city_profiles
from relocation_dataset.encoders import encode_profile
from relocation_dataset.explanations import (
    BLOCKER_ID_TO_INDEX,
    MODEL_BLOCKER_IDS,
    MODEL_REASON_IDS,
    MODEL_RISK_IDS,
    REASON_ID_TO_INDEX,
    RISK_ID_TO_INDEX,
)
from relocation_dataset.generator import generate_random_user_profile
from relocation_dataset.schemas import CityProfile, coerce_user_profile
from relocation_dataset.scoring import rank_cities_for_profile, score_city


DATASET_VERSION = "city_explanations_v1"
LABEL_SOURCE = "rule_teacher_v2"
DEFAULT_PROFILE_COUNT = 720
DEFAULT_CANDIDATES_PER_PROFILE = 18
DEFAULT_SEED = 20260529

OUTPUT_DIR = Path(__file__).resolve().parent
TRAIN_PATH = OUTPUT_DIR / "city_explanations_train.jsonl"
VALIDATION_PATH = OUTPUT_DIR / "city_explanations_validation.jsonl"
TEST_PATH = OUTPUT_DIR / "city_explanations_test.jsonl"
MANIFEST_PATH = OUTPUT_DIR / "city_explanations_manifest.json"

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


def _city_feature_vector(city: CityProfile) -> list[float]:
    return [float(getattr(city, field_name)) for field_name in CITY_FEATURE_NAMES]


def _multi_hot(ids: list[str], index: dict[str, int], size: int) -> list[int]:
    vector = [0 for _ in range(size)]
    for explanation_id in ids:
        vector[index[explanation_id]] = 1
    return vector


def _dedupe(ids: list[str], allowed: list[str], limit: int) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    allowed_set = set(allowed)

    for explanation_id in ids:
        if explanation_id not in allowed_set or explanation_id in seen:
            continue
        result.append(explanation_id)
        seen.add(explanation_id)
        if len(result) >= limit:
            return result

    return result


def _fallback_reason(profile: dict[str, Any]) -> str:
    if profile["optimizing_for"] == "best_career_upside":
        return "career_upside_fit"
    if profile["optimizing_for"] == "lowest_cost":
        return "lower_cost_fit"
    if profile["goal"] == "move_study":
        return "student_life_fit"
    if profile["goal"] == "move_family_partner":
        return "family_friendly_fit"
    return "first_landing_ease"


def _label_reasons(profile: dict[str, Any], city: CityProfile) -> list[str]:
    priorities = set(profile["lifestyle_priorities"])
    reasons: list[str] = []

    if "warm_climate" in priorities and city.warm_climate >= 0.65:
        reasons.append("warm_climate_fit")
    if "sea_nearby" in priorities and city.sea_nearby >= 0.75:
        reasons.append("coastal_lifestyle_fit")
    if profile["goal"] == "move_remote_work":
        reasons.append("remote_work_fit")
    if "lower_cost" in priorities and city.cost_level <= 0.55:
        reasons.append("lower_cost_fit")
    if "english_friendly" in priorities and city.english_friendly >= 0.62:
        reasons.append("english_friendly_fit")
    if "family_friendly" in priorities and city.family_friendly >= 0.62:
        reasons.append("family_friendly_fit")
    if "career_opportunities" in priorities and city.career_opportunities >= 0.65:
        reasons.append("career_upside_fit")
    if profile["goal"] == "move_study" and city.student_life >= 0.60:
        reasons.append("student_life_fit")
    if "calm_lifestyle" in priorities and city.calm_lifestyle >= 0.62:
        reasons.append("calm_lifestyle_fit")
    if "good_transport" in priorities and city.good_transport >= 0.65:
        reasons.append("public_transport_fit")
    if "expat_community" in priorities and city.expat_community >= 0.65:
        reasons.append("expat_community_fit")
    if city.legal_path_clarity >= 0.65:
        reasons.append("legal_clarity_fit")
    if city.bureaucracy_difficulty <= 0.50 and city.housing_difficulty <= 0.55:
        reasons.append("first_landing_ease")
    if city.region in profile["regions_open_to"] or "open_anything" in profile["regions_open_to"]:
        reasons.append("regional_preference_fit")
    if profile["safety_importance"] == "high" and city.long_term_stability >= 0.75:
        reasons.append("safety_fit")
    if profile["cost_tolerance"] == "strict" and city.cost_level <= 0.45:
        reasons.append("budget_buffer_fit")

    reasons.append(_fallback_reason(profile))
    return _dedupe(reasons, MODEL_REASON_IDS, limit=3)


def _label_risks(profile: dict[str, Any], city: CityProfile) -> list[str]:
    worries = set(profile["worries"])
    priorities = set(profile["lifestyle_priorities"])
    risks: list[str] = []

    if city.housing_difficulty >= 0.65:
        risks.append("housing_pressure")
    if city.cost_level >= 0.70 or (
        profile["monthly_income"] in {"lt_1000", "1000_2000"} and city.cost_level >= 0.55
    ):
        risks.append("high_cost_pressure")
    if profile["goal"] == "find_job_abroad" and city.career_opportunities <= 0.55:
        risks.append("weak_local_job_market")
    if (
        "language" in worries or profile["preferred_language"] == "English"
    ) and city.english_friendly <= 0.50:
        risks.append("language_barrier")
    if city.bureaucracy_difficulty >= 0.60:
        risks.append("bureaucracy_friction")
    if city.legal_path_clarity <= 0.50 or "documents" in worries:
        risks.append("legal_path_uncertainty")
    if "being_alone" in worries and city.expat_community <= 0.50:
        risks.append("isolation_risk")
    if profile["safety_importance"] == "high" and city.long_term_stability <= 0.60:
        risks.append("safety_tradeoff")
    if "warm_climate" in priorities and city.warm_climate <= 0.45:
        risks.append("climate_mismatch")
    if profile["optimizing_for"] == "best_career_upside" and city.earning_upside <= 0.55:
        risks.append("career_ceiling")
    if city.good_transport <= 0.45:
        risks.append("transport_friction")
    if profile["goal"] == "move_family_partner" and city.family_friendly <= 0.55:
        risks.append("family_support_gap")
    if profile["goal"] == "move_study" and (
        profile["monthly_income"] == "lt_1000" or city.cost_level >= 0.65
    ):
        risks.append("student_budget_pressure")
    if profile["income_type"] in {"freelance_clients", "business_owner", "savings_only"}:
        risks.append("income_verification_risk")
    if city.name in {"Barcelona", "Lisbon", "Algarve", "Phuket", "Bali", "Playa del Carmen", "Madeira"}:
        risks.append("tourism_pressure")
    if city.housing_difficulty >= 0.70 or city.bureaucracy_difficulty >= 0.65:
        risks.append("first_90_days_complexity")

    if not risks:
        risks.append("first_90_days_complexity")

    return _dedupe(risks, MODEL_RISK_IDS, limit=3)


def _label_blocker(profile: dict[str, Any], city: CityProfile, risks: list[str]) -> str:
    if city.region not in profile["regions_open_to"] and "open_anything" not in profile["regions_open_to"]:
        return "region_mismatch"
    if "high_cost_pressure" in risks and profile["monthly_income"] in {"lt_1000", "1000_2000"}:
        return "budget_too_low"
    if "legal_path_uncertainty" in risks:
        return "unclear_legal_route"
    if "housing_pressure" in risks and "housing" in profile["worries"]:
        return "housing_too_competitive"
    if "income_verification_risk" in risks and profile["income_type"] in {
        "freelance_clients",
        "business_owner",
        "savings_only",
    }:
        return "income_source_weak"
    if "weak_local_job_market" in risks or "career_ceiling" in risks:
        return "career_market_mismatch"
    if "language_barrier" in risks:
        return "language_gap"
    if "family_support_gap" in risks:
        return "family_constraints"
    if "student_budget_pressure" in risks and profile["goal"] == "move_study":
        return "study_route_unclear"
    if "safety_tradeoff" in risks:
        return "safety_concern"
    if city.bureaucracy_difficulty >= 0.70 and city.housing_difficulty >= 0.70:
        return "timeline_too_aggressive"
    return "no_major_blocker"


def _candidate_city_rows(
    profile: dict[str, Any],
    candidates_per_profile: int,
    rng: random.Random,
) -> list[dict[str, Any]]:
    ranked = rank_cities_for_profile(profile)
    if not ranked:
        return []

    top = ranked[: max(1, candidates_per_profile // 2)]
    middle_start = max(0, len(ranked) // 2 - candidates_per_profile // 6)
    middle = ranked[middle_start: middle_start + max(1, candidates_per_profile // 4)]
    bottom = ranked[-max(1, candidates_per_profile // 4):]

    selected: dict[int, dict[str, Any]] = {}
    for row in [*top, *middle, *bottom]:
        selected[int(row["city_id"])] = row

    if len(selected) < candidates_per_profile:
        remaining = [row for row in ranked if int(row["city_id"]) not in selected]
        rng.shuffle(remaining)
        for row in remaining[: candidates_per_profile - len(selected)]:
            selected[int(row["city_id"])] = row

    selected_rows = list(selected.values())
    if "open_anything" not in profile["regions_open_to"]:
        out_of_region_city_ids = [
            city_id
            for city_id, city in city_profiles.items()
            if city.region not in profile["regions_open_to"] and city_id not in selected
        ]
        rng.shuffle(out_of_region_city_ids)
        if out_of_region_city_ids:
            selected_rows = selected_rows[: max(0, candidates_per_profile - 2)]
        for city_id in out_of_region_city_ids[:2]:
            city = city_profiles[city_id]
            selected_rows.append(
                {
                    "city_id": city_id,
                    "city_name": city.name,
                    "score": round(score_city(profile, city), 6),
                }
            )

    selected_rows.sort(key=lambda row: int(row["city_id"]))
    return selected_rows[:candidates_per_profile]


def _split_for_profile(profile_index: int, profile_count: int) -> str:
    train_cutoff = int(profile_count * 0.80)
    validation_cutoff = int(profile_count * 0.90)
    if profile_index < train_cutoff:
        return "train"
    if profile_index < validation_cutoff:
        return "validation"
    return "test"


def build_rows(
    *,
    profile_count: int,
    candidates_per_profile: int,
    seed: int,
) -> list[dict[str, Any]]:
    rng = random.Random(seed)
    rows: list[dict[str, Any]] = []

    for profile_index in range(profile_count):
        profile = generate_random_user_profile(rng).to_dict()
        profile = asdict(coerce_user_profile(profile))
        profile_id = f"profile_{profile_index + 1:05d}"
        split = _split_for_profile(profile_index, profile_count)
        profile_vector, profile_feature_names = encode_profile(profile)

        candidate_rows = _candidate_city_rows(profile, candidates_per_profile, rng)
        for candidate_rank, candidate in enumerate(candidate_rows, 1):
            city_id = int(candidate["city_id"])
            city = city_profiles[city_id]
            reason_ids = _label_reasons(profile, city)
            risk_ids = _label_risks(profile, city)
            blocker_id = _label_blocker(profile, city, risk_ids)
            blocker_index = BLOCKER_ID_TO_INDEX[blocker_id]

            rows.append(
                {
                    "schema_version": DATASET_VERSION,
                    "sample_id": f"explain_{len(rows) + 1:06d}",
                    "profile_id": profile_id,
                    "split": split,
                    "candidate_rank": candidate_rank,
                    "teacher_city_score": float(candidate["score"]),
                    "profile": profile,
                    "profile_feature_values": profile_vector,
                    "city": {
                        "city_model_id": city_id,
                        "city_name": city_id_to_name[city_id],
                        "feature_values": _city_feature_vector(city),
                    },
                    "labels": {
                        "reason_ids": reason_ids,
                        "reason_vector": _multi_hot(
                            reason_ids,
                            REASON_ID_TO_INDEX,
                            len(MODEL_REASON_IDS),
                        ),
                        "risk_ids": risk_ids,
                        "risk_vector": _multi_hot(
                            risk_ids,
                            RISK_ID_TO_INDEX,
                            len(MODEL_RISK_IDS),
                        ),
                        "blocker_id": blocker_id,
                        "blocker_index": blocker_index,
                    },
                    "label_source": LABEL_SOURCE,
                }
            )

    return rows


def validate_rows(rows: list[dict[str, Any]]) -> None:
    errors: list[str] = []
    profile_to_split: dict[str, str] = {}

    for row in rows:
        profile_id = row["profile_id"]
        split = row["split"]
        previous_split = profile_to_split.setdefault(profile_id, split)
        if previous_split != split:
            errors.append(f"profile {profile_id} appears in multiple splits")

        city_id = int(row["city"]["city_model_id"])
        if city_id_to_name.get(city_id) != row["city"]["city_name"]:
            errors.append(f"{row['sample_id']} has mismatched city name")

        labels = row["labels"]
        if len(labels["reason_vector"]) != len(MODEL_REASON_IDS):
            errors.append(f"{row['sample_id']} has invalid reason vector length")
        if len(labels["risk_vector"]) != len(MODEL_RISK_IDS):
            errors.append(f"{row['sample_id']} has invalid risk vector length")
        if labels["blocker_index"] != BLOCKER_ID_TO_INDEX[labels["blocker_id"]]:
            errors.append(f"{row['sample_id']} has invalid blocker index")

    if errors:
        raise ValueError("\n".join(errors[:20]))


def _write_jsonl(path: Path, rows: list[dict[str, Any]]) -> None:
    path.write_text(
        "\n".join(json.dumps(row, ensure_ascii=False, sort_keys=True) for row in rows) + "\n"
    )


def _manifest(rows: list[dict[str, Any]], *, profile_count: int, candidates_per_profile: int, seed: int) -> dict[str, Any]:
    split_counts = Counter(row["split"] for row in rows)
    blocker_counts = Counter(row["labels"]["blocker_id"] for row in rows)
    reason_counts: Counter[str] = Counter()
    risk_counts: Counter[str] = Counter()
    city_counts: Counter[str] = Counter()

    for row in rows:
        reason_counts.update(row["labels"]["reason_ids"])
        risk_counts.update(row["labels"]["risk_ids"])
        city_counts.update([row["city"]["city_name"]])

    return {
        "dataset_version": DATASET_VERSION,
        "label_source": LABEL_SOURCE,
        "generated_at": datetime.now(UTC).isoformat(),
        "seed": seed,
        "profile_count": profile_count,
        "candidates_per_profile": candidates_per_profile,
        "row_count": len(rows),
        "split_counts": dict(sorted(split_counts.items())),
        "unique_profile_count": len({row["profile_id"] for row in rows}),
        "unique_city_count": len({row["city"]["city_model_id"] for row in rows}),
        "reason_id_count": len(MODEL_REASON_IDS),
        "risk_id_count": len(MODEL_RISK_IDS),
        "blocker_id_count": len(MODEL_BLOCKER_IDS),
        "profile_feature_names": encode_profile(rows[0]["profile"])[1] if rows else [],
        "city_feature_names": CITY_FEATURE_NAMES,
        "reason_coverage": dict(sorted(reason_counts.items())),
        "risk_coverage": dict(sorted(risk_counts.items())),
        "blocker_coverage": dict(sorted(blocker_counts.items())),
        "top_city_coverage": dict(city_counts.most_common(20)),
        "files": {
            "train": str(TRAIN_PATH.relative_to(PROJECT_ROOT)),
            "validation": str(VALIDATION_PATH.relative_to(PROJECT_ROOT)),
            "test": str(TEST_PATH.relative_to(PROJECT_ROOT)),
        },
    }


def write_dataset(rows: list[dict[str, Any]], manifest: dict[str, Any]) -> None:
    by_split: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        by_split[row["split"]].append(row)

    _write_jsonl(TRAIN_PATH, by_split["train"])
    _write_jsonl(VALIDATION_PATH, by_split["validation"])
    _write_jsonl(TEST_PATH, by_split["test"])
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build city explanation training dataset")
    parser.add_argument("--profiles", type=int, default=DEFAULT_PROFILE_COUNT)
    parser.add_argument("--candidates-per-profile", type=int, default=DEFAULT_CANDIDATES_PER_PROFILE)
    parser.add_argument("--seed", type=int, default=DEFAULT_SEED)
    args = parser.parse_args()

    rows = build_rows(
        profile_count=args.profiles,
        candidates_per_profile=args.candidates_per_profile,
        seed=args.seed,
    )
    validate_rows(rows)
    manifest = _manifest(
        rows,
        profile_count=args.profiles,
        candidates_per_profile=args.candidates_per_profile,
        seed=args.seed,
    )
    write_dataset(rows, manifest)

    print(
        f"Wrote {len(rows)} rows from {args.profiles} profiles "
        f"to {OUTPUT_DIR.relative_to(PROJECT_ROOT)}"
    )
    print(f"Splits: {manifest['split_counts']}")


if __name__ == "__main__":
    main()
