"""Rule-based teacher for selecting a best-fit city label."""

from __future__ import annotations

from typing import Any, Mapping

from .cities import city_profiles
from .encoders import (
    has_eu_residence,
    income_norm,
    income_stability,
    legal_mobility_score,
    savings_norm,
)
from .schemas import CityProfile, UserProfile, clamp, coerce_user_profile


COUNTRY_BY_CITY = {
    "Valencia": "Spain",
    "Barcelona": "Spain",
    "Madrid": "Spain",
    "Alicante": "Spain",
    "Lisbon": "Portugal",
    "Porto": "Portugal",
    "Madeira": "Portugal",
    "Algarve": "Portugal",
    "Warsaw": "Poland",
    "Krakow": "Poland",
    "Wroclaw": "Poland",
    "Berlin": "Germany",
    "Munich": "Germany",
    "Hamburg": "Germany",
    "Frankfurt": "Germany",
    "Prague": "Czech Republic",
    "Brno": "Czech Republic",
    "Dubai": "UAE",
    "Abu Dhabi": "UAE",
    "Bangkok": "Thailand",
    "Chiang Mai": "Thailand",
    "Phuket": "Thailand",
    "Toronto": "Canada",
    "Vancouver": "Canada",
    "Calgary": "Canada",
    "Montreal": "Canada",
    "Amsterdam": "Netherlands",
    "Rotterdam": "Netherlands",
    "Utrecht": "Netherlands",
    "Eindhoven": "Netherlands",
    "London": "United Kingdom",
    "Manchester": "United Kingdom",
    "Edinburgh": "United Kingdom",
    "Birmingham": "United Kingdom",
    "New York": "United States",
    "San Francisco": "United States",
    "Miami": "United States",
    "Austin": "United States",
    "Los Angeles": "United States",
    "Seattle": "United States",
    "Boston": "United States",
    "Chicago": "United States",
    "Washington DC": "United States",
    "Denver": "United States",
    "Atlanta": "United States",
    "Dallas": "United States",
    "Houston": "United States",
    "Philadelphia": "United States",
    "San Diego": "United States",
    "Portland": "United States",
    "Phoenix": "United States",
    "Nashville": "United States",
    "Mexico City": "Mexico",
    "Playa del Carmen": "Mexico",
    "Guadalajara": "Mexico",
    "Moscow": "Russia",
    "Saint Petersburg": "Russia",
    "Rome": "Italy",
    "Milan": "Italy",
    "Florence": "Italy",
    "Naples": "Italy",
    "Yerevan": "Armenia",
    "Seoul": "South Korea",
    "Busan": "South Korea",
    "Beijing": "China",
    "Shanghai": "China",
    "Shenzhen": "China",
    "Bali": "Indonesia",
    "Jakarta": "Indonesia",
    "Sydney": "Australia",
    "Melbourne": "Australia",
    "Brisbane": "Australia",
    "Perth": "Australia",
    "Auckland": "New Zealand",
    "Wellington": "New Zealand",
    "Queenstown": "New Zealand",
    "Buenos Aires": "Argentina",
    "Mendoza": "Argentina",
}

COUNTRY_STUDY_FACTORS = {
    "United States": {
        "prestige": 0.96,
        "scholarship": 0.76,
        "tuition_burden": 0.95,
        "post_study_work": 0.72,
        "visa_clarity": 0.52,
    },
    "United Kingdom": {
        "prestige": 0.90,
        "scholarship": 0.64,
        "tuition_burden": 0.82,
        "post_study_work": 0.80,
        "visa_clarity": 0.74,
    },
    "Canada": {
        "prestige": 0.78,
        "scholarship": 0.56,
        "tuition_burden": 0.66,
        "post_study_work": 0.92,
        "visa_clarity": 0.82,
    },
    "Netherlands": {
        "prestige": 0.76,
        "scholarship": 0.44,
        "tuition_burden": 0.56,
        "post_study_work": 0.76,
        "visa_clarity": 0.78,
    },
    "Germany": {
        "prestige": 0.78,
        "scholarship": 0.54,
        "tuition_burden": 0.24,
        "post_study_work": 0.86,
        "visa_clarity": 0.82,
    },
    "Spain": {
        "prestige": 0.56,
        "scholarship": 0.34,
        "tuition_burden": 0.44,
        "post_study_work": 0.56,
        "visa_clarity": 0.66,
    },
    "Portugal": {
        "prestige": 0.50,
        "scholarship": 0.30,
        "tuition_burden": 0.40,
        "post_study_work": 0.52,
        "visa_clarity": 0.68,
    },
    "Poland": {
        "prestige": 0.46,
        "scholarship": 0.38,
        "tuition_burden": 0.32,
        "post_study_work": 0.58,
        "visa_clarity": 0.62,
    },
    "Czech Republic": {
        "prestige": 0.48,
        "scholarship": 0.36,
        "tuition_burden": 0.34,
        "post_study_work": 0.56,
        "visa_clarity": 0.60,
    },
    "Italy": {
        "prestige": 0.68,
        "scholarship": 0.38,
        "tuition_burden": 0.45,
        "post_study_work": 0.52,
        "visa_clarity": 0.55,
    },
    "South Korea": {
        "prestige": 0.68,
        "scholarship": 0.42,
        "tuition_burden": 0.52,
        "post_study_work": 0.68,
        "visa_clarity": 0.65,
    },
    "China": {
        "prestige": 0.62,
        "scholarship": 0.55,
        "tuition_burden": 0.38,
        "post_study_work": 0.45,
        "visa_clarity": 0.48,
    },
    "Australia": {
        "prestige": 0.80,
        "scholarship": 0.52,
        "tuition_burden": 0.72,
        "post_study_work": 0.88,
        "visa_clarity": 0.78,
    },
    "New Zealand": {
        "prestige": 0.65,
        "scholarship": 0.44,
        "tuition_burden": 0.62,
        "post_study_work": 0.82,
        "visa_clarity": 0.80,
    },
    "Argentina": {
        "prestige": 0.52,
        "scholarship": 0.38,
        "tuition_burden": 0.25,
        "post_study_work": 0.38,
        "visa_clarity": 0.48,
    },
}

CITY_STUDY_PRESTIGE_BONUS = {
    "Boston": 0.10,
    "New York": 0.07,
    "San Francisco": 0.07,
    "Los Angeles": 0.06,
    "Seattle": 0.05,
    "Chicago": 0.04,
    "Philadelphia": -0.08,
    "Houston": -0.22,
    "Atlanta": -0.18,
    "Dallas": -0.20,
    "Phoenix": -0.25,
    "Nashville": -0.24,
    "Portland": -0.16,
    "Denver": -0.12,
    "San Diego": -0.12,
    "Miami": -0.18,
    "Austin": -0.12,
    "London": 0.10,
    "Edinburgh": 0.05,
    "Toronto": 0.03,
    "Vancouver": 0.02,
    "Amsterdam": 0.02,
    "Munich": 0.02,
    "Berlin": 0.02,
    "Barcelona": 0.02,
    "Madrid": 0.02,
}

COUNTRY_SAFETY_BASE = {
    "UAE": 0.92,
    "Canada": 0.84,
    "Netherlands": 0.82,
    "Germany": 0.82,
    "Portugal": 0.80,
    "Spain": 0.74,
    "Poland": 0.76,
    "Czech Republic": 0.78,
    "United Kingdom": 0.70,
    "United States": 0.60,
    "Thailand": 0.64,
    "Mexico": 0.45,
    "Russia": 0.42,
    "Italy": 0.74,
    "Armenia": 0.62,
    "South Korea": 0.88,
    "China": 0.72,
    "Indonesia": 0.58,
    "Australia": 0.86,
    "New Zealand": 0.92,
    "Argentina": 0.52,
}

CITY_SAFETY_ADJUSTMENTS = {
    "Barcelona": -0.10,
    "Madrid": -0.03,
    "Alicante": 0.08,
    "Algarve": 0.08,
    "Porto": 0.04,
    "Berlin": -0.03,
    "Munich": 0.08,
    "Amsterdam": -0.04,
    "Utrecht": 0.04,
    "London": -0.08,
    "Edinburgh": 0.06,
    "Birmingham": -0.08,
    "New York": -0.08,
    "San Francisco": -0.10,
    "Los Angeles": -0.10,
    "Chicago": -0.09,
    "Philadelphia": -0.10,
    "Boston": 0.04,
    "San Diego": 0.05,
    "Mexico City": -0.06,
    "Playa del Carmen": -0.02,
    "Guadalajara": -0.04,
}


def is_city_eligible_for_profile(
    profile: UserProfile | Mapping[str, Any],
    city: CityProfile,
) -> bool:
    user_profile = coerce_user_profile(profile)
    selected_regions = set(user_profile.regions_open_to)

    if not selected_regions or "open_anything" in selected_regions:
        return True

    return city.region in selected_regions


def score_city(profile: UserProfile | Mapping[str, Any], city: CityProfile) -> float:
    """Return a 0.0 to 1.0 fit score for a user-city pair."""

    user_profile = coerce_user_profile(profile)
    components = score_city_components(profile, city)
    weights = _component_weights(user_profile)
    score = (
        weights["legal"] * components["legal_score"]
        + weights["budget"] * components["budget_score"]
        + weights["lifestyle"] * components["lifestyle_score"]
        + weights["goal"] * components["goal_score"]
        + weights["optimization"] * components["optimization_score"]
        - components["worry_penalty"]
    )

    grant_dependent_study = (
        user_profile.goal == "move_study"
        and user_profile.cost_tolerance == "grant_dependent"
    )

    if components["income_norm"] <= 0.25 and city.cost_level >= 0.80 and not grant_dependent_study:
        score *= 0.45
    if (
        components["income_norm"] <= 0.25
        and components["savings_norm"] <= 0.15
        and city.cost_level >= 0.70
        and not grant_dependent_study
    ):
        score *= 0.60

    if _is_high_upside_intent(user_profile) and components["budget_capacity"] >= 0.52:
        score += 0.06 * city.earning_upside
    if _is_high_upside_intent(user_profile) and "money" not in user_profile.worries and city.earning_upside >= 0.90:
        score += 0.04

    return clamp(score)


def score_city_components(
    profile: UserProfile | Mapping[str, Any],
    city: CityProfile,
) -> dict[str, float]:
    user_profile = coerce_user_profile(profile)
    inc_norm = income_norm(user_profile)
    sav_norm = savings_norm(user_profile)
    stability = income_stability(user_profile)
    mobility = legal_mobility_score(user_profile)
    budget_capacity = clamp(0.58 * inc_norm + 0.27 * sav_norm + 0.15 * stability)

    legal_score = _legal_score(user_profile, city, mobility)
    budget_score = _budget_score(user_profile, city, budget_capacity)
    lifestyle_score = _lifestyle_score(user_profile, city)
    safety_score = _safety_score(city)
    study_system_score = _study_system_score(user_profile, city)
    worry_penalty = _worry_penalty(user_profile, city, budget_capacity)
    goal_score = _goal_score(user_profile, city)
    optimization_score = _optimization_score(user_profile, city)

    return {
        "legal_score": legal_score,
        "budget_score": budget_score,
        "lifestyle_score": lifestyle_score,
        "safety_score": safety_score,
        "study_system_score": study_system_score,
        "worry_penalty": worry_penalty,
        "goal_score": goal_score,
        "optimization_score": optimization_score,
        "income_norm": inc_norm,
        "savings_norm": sav_norm,
        "income_stability": stability,
        "budget_capacity": budget_capacity,
        "legal_mobility_score": mobility,
    }


def rank_cities_for_profile(
    profile: UserProfile | Mapping[str, Any],
    profiles: Mapping[int, CityProfile] | None = None,
) -> list[dict[str, float | int | str]]:
    user_profile = coerce_user_profile(profile)
    profiles = profiles or city_profiles
    rows: list[dict[str, float | int | str]] = []

    for city_id, city in profiles.items():
        if not is_city_eligible_for_profile(user_profile, city):
            continue

        rows.append(
            {
                "city_id": city_id,
                "city_name": city.name,
                "score": round(score_city(user_profile, city), 6),
            }
        )

    rows.sort(key=lambda row: (-float(row["score"]), int(row["city_id"])))
    return rows


def choose_best_city(
    profile: UserProfile | Mapping[str, Any],
    profiles: Mapping[int, CityProfile] | None = None,
) -> tuple[int, str, list[dict[str, float | int | str]]]:
    scores = rank_cities_for_profile(profile, profiles)
    if not scores:
        raise ValueError("No eligible cities for the selected regions")

    best = scores[0]
    return int(best["city_id"]), str(best["city_name"]), scores


def _legal_score(user_profile: UserProfile, city: CityProfile, mobility: float) -> float:
    score = (
        0.42 * city.legal_path_clarity
        + 0.28 * (1.0 - city.bureaucracy_difficulty)
        + 0.30 * mobility
    )

    if has_eu_residence(user_profile) and city.region == "europe":
        score += 0.06
    if user_profile.citizenship in {"Germany", "Spain"} and city.region == "europe":
        score += 0.08

    return clamp(score)


def _budget_score(user_profile: UserProfile, city: CityProfile, budget_capacity: float) -> float:
    cost_gap = max(0.0, city.cost_level - budget_capacity)
    base = clamp(1.0 - 0.62 * city.cost_level + 0.35 * budget_capacity - 0.90 * cost_gap)

    if user_profile.goal == "move_study" and user_profile.cost_tolerance == "grant_dependent":
        factors = _study_factors(city)
        return clamp(
            0.35 * base
            + 0.38 * factors["scholarship"]
            + 0.17 * factors["prestige"]
            + 0.10 * factors["visa_clarity"]
        )
    if user_profile.cost_tolerance == "flexible" and user_profile.study_priority == "top_university":
        factors = _study_factors(city)
        return clamp(0.55 * base + 0.45 * factors["prestige"])

    return base


def _lifestyle_score(user_profile: UserProfile, city: CityProfile) -> float:
    if not user_profile.lifestyle_priorities:
        return 0.60

    values = [_city_value_for_lifestyle(city, priority) for priority in user_profile.lifestyle_priorities]
    return clamp(sum(values) / len(values))


def _worry_penalty(user_profile: UserProfile, city: CityProfile, budget_capacity: float) -> float:
    penalties = {
        "documents": 0.16 * city.bureaucracy_difficulty + 0.12 * (1.0 - city.legal_path_clarity),
        "money": 0.24 * city.cost_level * (1.0 - budget_capacity),
        "housing": 0.18 * city.housing_difficulty,
        "language": 0.15 * (1.0 - city.english_friendly),
        "finding_work": 0.12 * (1.0 - city.career_opportunities) + 0.06 * (1.0 - city.earning_upside),
        "being_alone": 0.14 * (1.0 - city.expat_community),
        "choosing_wrong_place": 0.12 * (1.0 - city.long_term_stability)
        + 0.06 * city.housing_difficulty,
    }

    if user_profile.goal == "move_study" and user_profile.study_priority == "top_university":
        penalties["housing"] *= 0.65
        if user_profile.cost_tolerance in {"flexible", "grant_dependent"}:
            penalties["money"] *= 0.45

    total = sum(penalties[worry] for worry in user_profile.worries)
    if user_profile.safety_importance == "high":
        total += 0.18 * (1.0 - _safety_score(city))
    elif user_profile.safety_importance == "low":
        total -= 0.05 * (1.0 - _safety_score(city))

    if user_profile.cost_tolerance == "strict":
        total += 0.10 * city.cost_level * (1.0 - budget_capacity)
    elif user_profile.cost_tolerance == "grant_dependent" and user_profile.goal == "move_study":
        factors = _study_factors(city)
        total += 0.08 * factors["tuition_burden"] * (1.0 - factors["scholarship"])
    elif user_profile.cost_tolerance == "flexible" and "money" not in user_profile.worries:
        total -= 0.04 * city.earning_upside

    return clamp(total, upper=0.42)


def _goal_score(user_profile: UserProfile, city: CityProfile) -> float:
    affordability = 1.0 - city.cost_level

    if user_profile.goal == "move_study":
        study_score = _study_system_score(user_profile, city)
        return clamp(
            0.46 * study_score
            + 0.20 * city.student_life
            + 0.14 * city.english_friendly
            + 0.10 * city.career_opportunities
            + 0.10 * _safety_fit(user_profile, city)
        )
    if user_profile.goal == "find_job_abroad":
        return clamp(
            0.38 * city.career_opportunities
            + 0.28 * city.earning_upside
            + 0.18 * city.english_friendly
            + 0.16 * city.big_city
        )
    if user_profile.goal == "move_remote_work":
        return clamp(
            0.25 * affordability
            + 0.22 * city.expat_community
            + 0.18 * city.legal_path_clarity
            + 0.18 * city.calm_lifestyle
            + 0.17 * city.english_friendly
        )
    if user_profile.goal == "move_family_partner":
        return clamp(
            0.36 * city.family_friendly
            + 0.25 * city.long_term_stability
            + 0.20 * city.legal_path_clarity
            + 0.19 * (1.0 - city.housing_difficulty)
        )
    if user_profile.goal == "explore_first":
        return clamp(
            0.28 * affordability
            + 0.24 * city.expat_community
            + 0.22 * city.english_friendly
            + 0.16 * city.calm_lifestyle
            + 0.10 * city.legal_path_clarity
        )

    return clamp(
        0.22 * city.long_term_stability
        + 0.18 * city.expat_community
        + 0.17 * city.family_friendly
        + 0.17 * affordability
        + 0.14 * city.legal_path_clarity
        + 0.12 * city.english_friendly
    )


def _optimization_score(user_profile: UserProfile, city: CityProfile) -> float:
    affordability = 1.0 - city.cost_level

    if user_profile.optimizing_for == "lowest_cost":
        return clamp(0.78 * affordability + 0.22 * (1.0 - city.housing_difficulty))
    if user_profile.optimizing_for == "best_career_upside":
        return clamp(
            0.44 * city.earning_upside
            + 0.34 * city.career_opportunities
            + 0.12 * city.english_friendly
            + 0.10 * city.big_city
        )
    if user_profile.optimizing_for == "fastest_legal_path":
        return clamp(0.66 * city.legal_path_clarity + 0.34 * (1.0 - city.bureaucracy_difficulty))
    if user_profile.optimizing_for == "most_comfortable_daily_life":
        return clamp(
            0.22 * _safety_fit(user_profile, city)
            + 0.20 * city.good_transport
            + 0.18 * city.family_friendly
            + 0.16 * city.english_friendly
            + 0.14 * city.calm_lifestyle
            + 0.10 * (1.0 - city.housing_difficulty)
        )
    if user_profile.optimizing_for == "best_study_route":
        return clamp(
            0.62 * _study_system_score(user_profile, city)
            + 0.16 * city.student_life
            + 0.12 * _safety_fit(user_profile, city)
            + 0.10 * city.english_friendly
        )

    return clamp(0.56 * city.long_term_stability + 0.22 * city.legal_path_clarity + 0.22 * city.family_friendly)


def _city_value_for_lifestyle(city: CityProfile, priority: str) -> float:
    if priority == "lower_cost":
        return 1.0 - city.cost_level
    if priority == "career_opportunities":
        return 0.65 * city.career_opportunities + 0.35 * city.earning_upside

    return float(getattr(city, priority))


def _city_country(city: CityProfile) -> str:
    return COUNTRY_BY_CITY.get(city.name, "")


def _study_factors(city: CityProfile) -> dict[str, float]:
    country = _city_country(city)
    base = COUNTRY_STUDY_FACTORS.get(
        country,
        {
            "prestige": 0.45,
            "scholarship": 0.35,
            "tuition_burden": 0.45,
            "post_study_work": 0.45,
            "visa_clarity": 0.50,
        },
    )
    factors = dict(base)
    factors["prestige"] = clamp(
        factors["prestige"] + CITY_STUDY_PRESTIGE_BONUS.get(city.name, 0.0)
    )
    return factors


def _study_system_score(user_profile: UserProfile, city: CityProfile) -> float:
    factors = _study_factors(city)
    affordability = 1.0 - factors["tuition_burden"]

    if user_profile.cost_tolerance == "grant_dependent":
        affordability = 0.45 * affordability + 0.55 * factors["scholarship"]
    elif user_profile.cost_tolerance == "flexible":
        affordability = 0.40 * affordability + 0.60 * factors["prestige"]

    if user_profile.study_priority == "top_university":
        return clamp(
            0.48 * factors["prestige"]
            + 0.18 * factors["scholarship"]
            + 0.16 * factors["post_study_work"]
            + 0.10 * factors["visa_clarity"]
            + 0.08 * affordability
        )
    if user_profile.study_priority == "scholarship_chance":
        return clamp(
            0.42 * factors["scholarship"]
            + 0.20 * affordability
            + 0.18 * factors["prestige"]
            + 0.12 * factors["visa_clarity"]
            + 0.08 * factors["post_study_work"]
        )
    if user_profile.study_priority == "post_study_work":
        return clamp(
            0.42 * factors["post_study_work"]
            + 0.22 * factors["prestige"]
            + 0.16 * factors["visa_clarity"]
            + 0.12 * factors["scholarship"]
            + 0.08 * affordability
        )

    return clamp(
        0.48 * affordability
        + 0.20 * factors["visa_clarity"]
        + 0.14 * factors["scholarship"]
        + 0.10 * factors["post_study_work"]
        + 0.08 * factors["prestige"]
    )


def _safety_score(city: CityProfile) -> float:
    country = _city_country(city)
    base = COUNTRY_SAFETY_BASE.get(country, 0.62)
    return clamp(base + CITY_SAFETY_ADJUSTMENTS.get(city.name, 0.0))


def _safety_fit(user_profile: UserProfile, city: CityProfile) -> float:
    safety = _safety_score(city)
    if user_profile.safety_importance == "high":
        return safety
    if user_profile.safety_importance == "low":
        return clamp(0.70 + 0.30 * safety)
    return clamp(0.45 + 0.55 * safety)


def _component_weights(user_profile: UserProfile) -> dict[str, float]:
    if user_profile.optimizing_for == "best_career_upside":
        return {
            "legal": 0.15,
            "budget": 0.10,
            "lifestyle": 0.14,
            "goal": 0.24,
            "optimization": 0.37,
        }
    if user_profile.optimizing_for == "lowest_cost":
        return {
            "legal": 0.18,
            "budget": 0.30,
            "lifestyle": 0.18,
            "goal": 0.14,
            "optimization": 0.20,
        }
    if user_profile.optimizing_for == "fastest_legal_path":
        return {
            "legal": 0.32,
            "budget": 0.14,
            "lifestyle": 0.16,
            "goal": 0.14,
            "optimization": 0.24,
        }
    if user_profile.optimizing_for == "best_study_route":
        if user_profile.study_priority == "top_university":
            return {
                "legal": 0.14,
                "budget": 0.06,
                "lifestyle": 0.10,
                "goal": 0.32,
                "optimization": 0.38,
            }
        return {
            "legal": 0.16,
            "budget": 0.12,
            "lifestyle": 0.12,
            "goal": 0.28,
            "optimization": 0.32,
        }
    if user_profile.optimizing_for == "most_comfortable_daily_life":
        return {
            "legal": 0.18,
            "budget": 0.16,
            "lifestyle": 0.20,
            "goal": 0.16,
            "optimization": 0.30,
        }

    return {
        "legal": 0.22,
        "budget": 0.18,
        "lifestyle": 0.22,
        "goal": 0.18,
        "optimization": 0.20,
    }


def _is_high_upside_intent(user_profile: UserProfile) -> bool:
    return (
        user_profile.optimizing_for == "best_career_upside"
        or user_profile.goal == "find_job_abroad"
        or "career_opportunities" in user_profile.lifestyle_priorities
    )
