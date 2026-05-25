"""Random profile and dataset generation."""

from __future__ import annotations

import random
import math
from typing import Any

from .cities import city_count
from .encoders import encode_profile
from .schemas import (
    CITIZENSHIPS,
    COST_TOLERANCE,
    CURRENT_COUNTRIES,
    GOALS,
    INCOME_TYPES,
    LIFESTYLE_PRIORITIES,
    MONTHLY_INCOME_BUCKETS,
    OPTIMIZING_FOR,
    PREFERRED_LANGUAGES,
    REGIONS_OPEN_TO,
    SAFETY_IMPORTANCE,
    SAVINGS_BUCKETS,
    STUDY_PRIORITIES,
    WORRIES,
    UserProfile,
)
from .scoring import choose_best_city


def generate_random_user_profile(rng: random.Random | None = None) -> UserProfile:
    rng = rng or random.Random()

    if rng.random() < 0.22:
        return _generate_high_upside_user_profile(rng)

    citizenship = _weighted_choice(
        rng,
        CITIZENSHIPS,
        [0.34, 0.16, 0.06, 0.05, 0.06, 0.07, 0.12, 0.14],
    )
    current_country = _weighted_choice(
        rng,
        CURRENT_COUNTRIES,
        [0.30, 0.11, 0.08, 0.10, 0.08, 0.09, 0.12, 0.12],
    )
    preferred_language = _weighted_choice(rng, PREFERRED_LANGUAGES, [0.62, 0.38])
    goal = _weighted_choice(rng, GOALS, [0.28, 0.12, 0.17, 0.12, 0.19, 0.12])
    monthly_income = _weighted_choice(rng, MONTHLY_INCOME_BUCKETS, [0.18, 0.25, 0.23, 0.22, 0.12])
    savings = _weighted_choice(rng, SAVINGS_BUCKETS, [0.19, 0.25, 0.25, 0.19, 0.12])
    income_type = _weighted_choice(rng, INCOME_TYPES, [0.34, 0.24, 0.10, 0.08, 0.12, 0.12])

    lifestyle_priorities = _weighted_sample(
        rng,
        LIFESTYLE_PRIORITIES,
        [0.13, 0.14, 0.08, 0.09, 0.11, 0.10, 0.08, 0.10, 0.08, 0.04, 0.05],
        k=rng.randint(2, 5),
    )
    worries = _weighted_sample(
        rng,
        WORRIES,
        [0.18, 0.18, 0.15, 0.13, 0.15, 0.10, 0.11],
        k=rng.randint(1, 4),
    )
    regions_open_to = _random_regions(rng)
    optimizing_for = _weighted_choice(
        rng,
        OPTIMIZING_FOR,
        [0.20, 0.18, 0.19, 0.18, 0.11, 0.14],
    )
    safety_importance = _weighted_choice(rng, SAFETY_IMPORTANCE, [0.16, 0.54, 0.30])
    cost_tolerance = _weighted_choice(rng, COST_TOLERANCE, [0.40, 0.42, 0.18])
    study_priority = _weighted_choice(
        rng,
        STUDY_PRIORITIES,
        [0.34, 0.22, 0.26, 0.18],
    )

    return UserProfile(
        citizenship=citizenship,
        current_country=current_country,
        preferred_language=preferred_language,
        goal=goal,
        monthly_income=monthly_income,
        savings=savings,
        income_type=income_type,
        lifestyle_priorities=lifestyle_priorities,
        worries=worries,
        regions_open_to=regions_open_to,
        optimizing_for=optimizing_for,
        safety_importance=safety_importance,
        cost_tolerance=cost_tolerance,
        study_priority=study_priority,
    )


def _generate_high_upside_user_profile(rng: random.Random) -> UserProfile:
    """Profiles where the user can rationally trade cost for career/salary ceiling."""

    if rng.random() < 0.45:
        regions_open_to = ["north_america"]
    elif rng.random() < 0.75:
        regions_open_to = ["europe", "north_america"]
    else:
        regions_open_to = ["open_anything"]

    base_priorities = ["career_opportunities", "english_friendly", "big_city", "expat_community"]
    optional_priorities = ["good_transport", "student_life", "sea_nearby", "family_friendly", "calm_lifestyle"]
    lifestyle_priorities = base_priorities + _weighted_sample(
        rng,
        optional_priorities,
        [0.25, 0.23, 0.17, 0.15, 0.20],
        k=rng.choice([0, 1]),
    )

    worries = _weighted_sample(
        rng,
        ["language", "finding_work", "choosing_wrong_place", "documents", "being_alone"],
        [0.28, 0.26, 0.20, 0.16, 0.10],
        k=rng.choice([1, 2, 2, 3]),
    )

    return UserProfile(
        citizenship=_weighted_choice(
            rng,
            CITIZENSHIPS,
            [0.32, 0.14, 0.06, 0.04, 0.08, 0.08, 0.14, 0.14],
        ),
        current_country=_weighted_choice(
            rng,
            CURRENT_COUNTRIES,
            [0.32, 0.09, 0.07, 0.09, 0.11, 0.09, 0.13, 0.10],
        ),
        preferred_language="English",
        goal=_weighted_choice(rng, ["find_job_abroad", "move_study", "not_sure"], [0.52, 0.32, 0.16]),
        monthly_income=_weighted_choice(rng, ["3000_5000", "5000_plus", "2000_3000"], [0.44, 0.38, 0.18]),
        savings=_weighted_choice(rng, ["7000_15000", "15000_30000", "30000_plus"], [0.34, 0.38, 0.28]),
        income_type=_weighted_choice(
            rng,
            ["remote_employment", "business_owner", "freelance_clients"],
            [0.44, 0.34, 0.22],
        ),
        lifestyle_priorities=lifestyle_priorities[:5],
        worries=worries,
        regions_open_to=regions_open_to,
        optimizing_for=_weighted_choice(
            rng,
            ["best_career_upside", "best_study_route", "most_comfortable_daily_life"],
            [0.72, 0.18, 0.10],
        ),
        safety_importance=_weighted_choice(rng, SAFETY_IMPORTANCE, [0.22, 0.48, 0.30]),
        cost_tolerance=_weighted_choice(rng, COST_TOLERANCE, [0.12, 0.56, 0.32]),
        study_priority=_weighted_choice(
            rng,
            STUDY_PRIORITIES,
            [0.46, 0.20, 0.28, 0.06],
        ),
    )


def generate_dataset(n: int = 1000, seed: int = 42) -> list[dict[str, Any]]:
    rng = random.Random(seed)
    dataset: list[dict[str, Any]] = []
    total_cities = city_count()

    for _ in range(n):
        profile = generate_random_user_profile(rng)
        x, _feature_names = encode_profile(profile)
        y_index, best_city, teacher_scores = choose_best_city(profile)
        y_onehot = [1 if city_id == y_index else 0 for city_id in range(total_cities)]
        y_scores = _teacher_score_distribution(teacher_scores, total_cities)

        dataset.append(
            {
                "profile": profile.to_dict(),
                "x": x,
                "y_index": y_index,
                "y_onehot": y_onehot,
                "y_scores": y_scores,
                "best_city": best_city,
                "teacher_scores": teacher_scores,
            }
        )

    return dataset


def _teacher_score_distribution(
    teacher_scores: list[dict[str, float | int | str]],
    total_cities: int,
    temperature: float = 0.08,
) -> list[float]:
    """Convert teacher fit scores into a soft target distribution over all cities."""

    y_scores = [0.0 for _ in range(total_cities)]
    if not teacher_scores:
        return y_scores

    max_score = max(float(row["score"]) for row in teacher_scores)
    weights: list[tuple[int, float]] = []

    for row in teacher_scores:
        city_id = int(row["city_id"])
        score = float(row["score"])
        weight = math.exp((score - max_score) / temperature)
        weights.append((city_id, weight))

    total_weight = sum(weight for _city_id, weight in weights)
    for city_id, weight in weights:
        y_scores[city_id] = weight / total_weight

    return y_scores


def _weighted_choice(rng: random.Random, values: list[str], weights: list[float]) -> str:
    return rng.choices(values, weights=weights, k=1)[0]


def _weighted_sample(
    rng: random.Random,
    values: list[str],
    weights: list[float],
    k: int,
) -> list[str]:
    available = list(values)
    available_weights = list(weights)
    selected: list[str] = []

    for _ in range(min(k, len(available))):
        choice = rng.choices(available, weights=available_weights, k=1)[0]
        index = available.index(choice)
        selected.append(choice)
        available.pop(index)
        available_weights.pop(index)

    return selected


def _random_regions(rng: random.Random) -> list[str]:
    if rng.random() < 0.28:
        return ["open_anything"]

    supported_regions = ["europe", "north_america", "asia", "middle_east", "latin_america", "oceania"]
    selected = _weighted_sample(
        rng,
        supported_regions,
        [0.44, 0.14, 0.16, 0.10, 0.09, 0.07],
        k=rng.choice([1, 1, 2, 2, 3]),
    )

    if rng.random() < 0.04 and "latin_america" not in selected and len(selected) < 3:
        selected.append("latin_america")

    return selected
