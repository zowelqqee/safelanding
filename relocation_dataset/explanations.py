"""Structured explanation taxonomy shared by training and inference code.

The order of these lists is the model contract: explanation heads can output
indices, and the API can map those indices back to stable IDs.
"""

from __future__ import annotations


MODEL_REASON_IDS = [
    "warm_climate_fit",
    "coastal_lifestyle_fit",
    "remote_work_fit",
    "lower_cost_fit",
    "english_friendly_fit",
    "family_friendly_fit",
    "career_upside_fit",
    "student_life_fit",
    "calm_lifestyle_fit",
    "public_transport_fit",
    "expat_community_fit",
    "legal_clarity_fit",
    "first_landing_ease",
    "regional_preference_fit",
    "safety_fit",
    "budget_buffer_fit",
]

MODEL_RISK_IDS = [
    "housing_pressure",
    "high_cost_pressure",
    "weak_local_job_market",
    "language_barrier",
    "bureaucracy_friction",
    "legal_path_uncertainty",
    "isolation_risk",
    "safety_tradeoff",
    "climate_mismatch",
    "career_ceiling",
    "transport_friction",
    "family_support_gap",
    "student_budget_pressure",
    "income_verification_risk",
    "tourism_pressure",
    "first_90_days_complexity",
]

MODEL_BLOCKER_IDS = [
    "budget_too_low",
    "unclear_legal_route",
    "housing_too_competitive",
    "income_source_weak",
    "career_market_mismatch",
    "language_gap",
    "family_constraints",
    "study_route_unclear",
    "safety_concern",
    "region_mismatch",
    "timeline_too_aggressive",
    "no_major_blocker",
]

DEFAULT_BLOCKER_ID = "no_major_blocker"

REASON_ID_TO_INDEX = {
    explanation_id: index for index, explanation_id in enumerate(MODEL_REASON_IDS)
}
RISK_ID_TO_INDEX = {
    explanation_id: index for index, explanation_id in enumerate(MODEL_RISK_IDS)
}
BLOCKER_ID_TO_INDEX = {
    explanation_id: index for index, explanation_id in enumerate(MODEL_BLOCKER_IDS)
}


def reason_id_from_index(index: int) -> str | None:
    if 0 <= index < len(MODEL_REASON_IDS):
        return MODEL_REASON_IDS[index]
    return None


def risk_id_from_index(index: int) -> str | None:
    if 0 <= index < len(MODEL_RISK_IDS):
        return MODEL_RISK_IDS[index]
    return None


def blocker_id_from_index(index: int) -> str:
    if 0 <= index < len(MODEL_BLOCKER_IDS):
        return MODEL_BLOCKER_IDS[index]
    return DEFAULT_BLOCKER_ID
