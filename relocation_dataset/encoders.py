"""Encode onboarding profiles into stable numeric feature vectors."""

from __future__ import annotations

from typing import Any, Mapping

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
    clamp,
    coerce_user_profile,
)


INCOME_MIDPOINTS = {
    "lt_1000": 750,
    "1000_2000": 1500,
    "2000_3000": 2500,
    "3000_5000": 4000,
    "5000_plus": 6000,
}

SAVINGS_MIDPOINTS = {
    "lt_3000": 1500,
    "3000_7000": 5000,
    "7000_15000": 11000,
    "15000_30000": 22000,
    "30000_plus": 35000,
}

INCOME_STABILITY = {
    "remote_employment": 0.9,
    "freelance_clients": 0.65,
    "business_owner": 0.7,
    "savings_only": 0.25,
    "student_family_support": 0.45,
    "no_stable_income_yet": 0.05,
}

CITIZENSHIP_LEGAL_MOBILITY = {
    "Russia": 0.35,
    "Ukraine": 0.62,
    "Germany": 0.96,
    "Spain": 0.96,
    "USA": 0.82,
    "Turkey": 0.48,
    "Kazakhstan": 0.45,
    "Other": 0.45,
}

CURRENT_COUNTRY_LEGAL_BONUS = {
    "Russia": 0.00,
    "Spain": 0.16,
    "Germany": 0.16,
    "Turkey": 0.04,
    "UAE": 0.10,
    "Serbia": 0.06,
    "Georgia": 0.05,
    "Other": 0.00,
}

EU_RESIDENCE_COUNTRIES = {"Spain", "Germany"}


def income_norm(profile: UserProfile | Mapping[str, Any]) -> float:
    user_profile = coerce_user_profile(profile)
    return clamp(INCOME_MIDPOINTS[user_profile.monthly_income] / 6000)


def savings_norm(profile: UserProfile | Mapping[str, Any]) -> float:
    user_profile = coerce_user_profile(profile)
    return clamp(SAVINGS_MIDPOINTS[user_profile.savings] / 35000)


def income_stability(profile: UserProfile | Mapping[str, Any]) -> float:
    user_profile = coerce_user_profile(profile)
    return INCOME_STABILITY[user_profile.income_type]


def legal_mobility_score(profile: UserProfile | Mapping[str, Any]) -> float:
    user_profile = coerce_user_profile(profile)
    base = CITIZENSHIP_LEGAL_MOBILITY[user_profile.citizenship]
    bonus = CURRENT_COUNTRY_LEGAL_BONUS[user_profile.current_country]
    return clamp(base + bonus)


def has_eu_residence(profile: UserProfile | Mapping[str, Any]) -> int:
    user_profile = coerce_user_profile(profile)
    return int(user_profile.current_country in EU_RESIDENCE_COUNTRIES)


def get_feature_names() -> list[str]:
    names: list[str] = []

    names.extend(f"citizenship__{option}" for option in CITIZENSHIPS)
    names.extend(f"current_country__{option}" for option in CURRENT_COUNTRIES)
    names.extend(f"preferred_language__{option}" for option in PREFERRED_LANGUAGES)
    names.extend(["legal_mobility_score", "has_eu_residence"])

    names.extend(f"goal__{option}" for option in GOALS)

    names.extend(["income_norm", "savings_norm"])
    names.extend(f"income_type__{option}" for option in INCOME_TYPES)
    names.append("income_stability")

    names.extend(f"lifestyle__{option}" for option in LIFESTYLE_PRIORITIES)
    names.extend(f"worry__{option}" for option in WORRIES)
    names.extend(f"region_open_to__{option}" for option in REGIONS_OPEN_TO)
    names.extend(f"optimizing_for__{option}" for option in OPTIMIZING_FOR)
    names.extend(f"safety_importance__{option}" for option in SAFETY_IMPORTANCE)
    names.extend(f"cost_tolerance__{option}" for option in COST_TOLERANCE)
    names.extend(f"study_priority__{option}" for option in STUDY_PRIORITIES)

    return names


def encode_profile(profile: UserProfile | Mapping[str, Any]) -> tuple[list[float], list[str]]:
    """Return (x, feature_names), with both lists in the same stable order."""

    user_profile = coerce_user_profile(profile)
    values: list[float] = []

    values.extend(_one_hot(user_profile.citizenship, CITIZENSHIPS))
    values.extend(_one_hot(user_profile.current_country, CURRENT_COUNTRIES))
    values.extend(_one_hot(user_profile.preferred_language, PREFERRED_LANGUAGES))
    values.extend(
        [
            legal_mobility_score(user_profile),
            float(has_eu_residence(user_profile)),
        ]
    )

    values.extend(_one_hot(user_profile.goal, GOALS))

    values.extend(
        [
            income_norm(user_profile),
            savings_norm(user_profile),
        ]
    )
    values.extend(_one_hot(user_profile.income_type, INCOME_TYPES))
    values.append(income_stability(user_profile))

    values.extend(_multi_hot(user_profile.lifestyle_priorities, LIFESTYLE_PRIORITIES))
    values.extend(_multi_hot(user_profile.worries, WORRIES))
    values.extend(_multi_hot(user_profile.regions_open_to, REGIONS_OPEN_TO))
    values.extend(_one_hot(user_profile.optimizing_for, OPTIMIZING_FOR))
    values.extend(_one_hot(user_profile.safety_importance, SAFETY_IMPORTANCE))
    values.extend(_one_hot(user_profile.cost_tolerance, COST_TOLERANCE))
    values.extend(_one_hot(user_profile.study_priority, STUDY_PRIORITIES))

    feature_names = get_feature_names()
    if len(values) != len(feature_names):
        raise RuntimeError("Feature values and feature names are out of sync")

    return values, feature_names


def _one_hot(value: str, options: list[str]) -> list[float]:
    return [1.0 if value == option else 0.0 for option in options]


def _multi_hot(values: list[str], options: list[str]) -> list[float]:
    selected = set(values)
    return [1.0 if option in selected else 0.0 for option in options]
