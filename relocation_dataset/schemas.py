"""Shared schemas and option lists for the relocation dataset."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any, Mapping, Sequence


CITIZENSHIPS = [
    "Russia",
    "Ukraine",
    "Germany",
    "Spain",
    "USA",
    "Turkey",
    "Kazakhstan",
    "Other",
]

CURRENT_COUNTRIES = [
    "Russia",
    "Spain",
    "Germany",
    "Turkey",
    "UAE",
    "Serbia",
    "Georgia",
    "Other",
]

PREFERRED_LANGUAGES = ["English", "Russian"]

GOALS = [
    "move_remote_work",
    "move_study",
    "explore_first",
    "not_sure",
    "find_job_abroad",
    "move_family_partner",
]

MONTHLY_INCOME_BUCKETS = [
    "lt_1000",
    "1000_2000",
    "2000_3000",
    "3000_5000",
    "5000_plus",
]

SAVINGS_BUCKETS = [
    "lt_3000",
    "3000_7000",
    "7000_15000",
    "15000_30000",
    "30000_plus",
]

INCOME_TYPES = [
    "remote_employment",
    "freelance_clients",
    "business_owner",
    "savings_only",
    "student_family_support",
    "no_stable_income_yet",
]

LIFESTYLE_PRIORITIES = [
    "warm_climate",
    "lower_cost",
    "big_city",
    "sea_nearby",
    "expat_community",
    "english_friendly",
    "family_friendly",
    "career_opportunities",
    "calm_lifestyle",
    "student_life",
    "good_transport",
]

WORRIES = [
    "documents",
    "money",
    "housing",
    "language",
    "finding_work",
    "being_alone",
    "choosing_wrong_place",
]

REGIONS_OPEN_TO = [
    "europe",
    "north_america",
    "asia",
    "middle_east",
    "latin_america",
    "oceania",
    "open_anything",
]

CITY_REGIONS = [
    "europe",
    "north_america",
    "asia",
    "middle_east",
    "latin_america",
    "oceania",
]

OPTIMIZING_FOR = [
    "fastest_legal_path",
    "best_career_upside",
    "lowest_cost",
    "most_comfortable_daily_life",
    "best_study_route",
    "safest_long_term_option",
]

SAFETY_IMPORTANCE = ["low", "medium", "high"]

COST_TOLERANCE = ["strict", "flexible", "grant_dependent"]

STUDY_PRIORITIES = [
    "top_university",
    "scholarship_chance",
    "post_study_work",
    "affordable_degree",
]


@dataclass(frozen=True)
class UserProfile:
    citizenship: str
    current_country: str
    preferred_language: str
    goal: str
    monthly_income: str
    savings: str
    income_type: str
    lifestyle_priorities: list[str]
    worries: list[str]
    regions_open_to: list[str]
    optimizing_for: str
    safety_importance: str = "medium"
    cost_tolerance: str = "flexible"
    study_priority: str = "top_university"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class CityProfile:
    city_id: int
    name: str
    cost_level: float
    warm_climate: float
    sea_nearby: float
    big_city: float
    english_friendly: float
    expat_community: float
    family_friendly: float
    career_opportunities: float
    calm_lifestyle: float
    student_life: float
    good_transport: float
    bureaucracy_difficulty: float
    housing_difficulty: float
    legal_path_clarity: float
    long_term_stability: float
    region: str
    earning_upside: float = 0.55

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def clamp(value: float, lower: float = 0.0, upper: float = 1.0) -> float:
    return max(lower, min(upper, value))


def coerce_user_profile(profile: UserProfile | Mapping[str, Any]) -> UserProfile:
    """Accept either a UserProfile or a raw onboarding dictionary."""

    if isinstance(profile, UserProfile):
        user_profile = profile
    elif isinstance(profile, Mapping):
        optional_fields = {"safety_importance", "cost_tolerance", "study_priority"}
        missing = [
            field for field in UserProfile.__dataclass_fields__
            if field not in profile and field not in optional_fields
        ]
        if missing:
            raise ValueError(f"Missing user profile fields: {', '.join(missing)}")

        user_profile = UserProfile(
            citizenship=str(profile["citizenship"]),
            current_country=str(profile["current_country"]),
            preferred_language=str(profile["preferred_language"]),
            goal=str(profile["goal"]),
            monthly_income=str(profile["monthly_income"]),
            savings=str(profile["savings"]),
            income_type=str(profile["income_type"]),
            lifestyle_priorities=list(profile["lifestyle_priorities"]),
            worries=list(profile["worries"]),
            regions_open_to=list(profile["regions_open_to"]),
            optimizing_for=str(profile["optimizing_for"]),
            safety_importance=str(profile.get("safety_importance", "medium")),
            cost_tolerance=str(profile.get("cost_tolerance", "flexible")),
            study_priority=str(profile.get("study_priority", "top_university")),
        )
    else:
        raise TypeError("profile must be a UserProfile or mapping")

    _require_choice("citizenship", user_profile.citizenship, CITIZENSHIPS)
    _require_choice("current_country", user_profile.current_country, CURRENT_COUNTRIES)
    _require_choice("preferred_language", user_profile.preferred_language, PREFERRED_LANGUAGES)
    _require_choice("goal", user_profile.goal, GOALS)
    _require_choice("monthly_income", user_profile.monthly_income, MONTHLY_INCOME_BUCKETS)
    _require_choice("savings", user_profile.savings, SAVINGS_BUCKETS)
    _require_choice("income_type", user_profile.income_type, INCOME_TYPES)
    _require_choice("optimizing_for", user_profile.optimizing_for, OPTIMIZING_FOR)
    _require_choice("safety_importance", user_profile.safety_importance, SAFETY_IMPORTANCE)
    _require_choice("cost_tolerance", user_profile.cost_tolerance, COST_TOLERANCE)
    _require_choice("study_priority", user_profile.study_priority, STUDY_PRIORITIES)
    _require_multi_choice("lifestyle_priorities", user_profile.lifestyle_priorities, LIFESTYLE_PRIORITIES)
    _require_multi_choice("worries", user_profile.worries, WORRIES)
    _require_multi_choice("regions_open_to", user_profile.regions_open_to, REGIONS_OPEN_TO)

    if len(user_profile.lifestyle_priorities) > 5:
        raise ValueError("lifestyle_priorities supports up to 5 selections")

    if "open_anything" in user_profile.regions_open_to and len(user_profile.regions_open_to) > 1:
        raise ValueError("open_anything should be selected by itself")

    return user_profile


def _require_choice(field_name: str, value: str, options: Sequence[str]) -> None:
    if value not in options:
        expected = ", ".join(options)
        raise ValueError(f"Invalid {field_name}: {value!r}. Expected one of: {expected}")


def _require_multi_choice(field_name: str, values: Sequence[str], options: Sequence[str]) -> None:
    invalid = [value for value in values if value not in options]
    if invalid:
        expected = ", ".join(options)
        raise ValueError(f"Invalid {field_name}: {invalid!r}. Expected values from: {expected}")
