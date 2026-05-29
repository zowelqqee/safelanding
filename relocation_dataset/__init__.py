"""Dataset layer for Soft Landing city recommendation experiments."""

from .cities import city_id_to_name, city_profiles
from .encoders import encode_profile, get_feature_names
from .explanations import (
    BLOCKER_ID_TO_INDEX,
    DEFAULT_BLOCKER_ID,
    MODEL_BLOCKER_IDS,
    MODEL_REASON_IDS,
    MODEL_RISK_IDS,
    REASON_ID_TO_INDEX,
    RISK_ID_TO_INDEX,
    blocker_id_from_index,
    reason_id_from_index,
    risk_id_from_index,
)
from .generator import generate_dataset, generate_random_user_profile
from .scoring import choose_best_city, rank_cities_for_profile, score_city

__all__ = [
    "BLOCKER_ID_TO_INDEX",
    "choose_best_city",
    "city_id_to_name",
    "city_profiles",
    "DEFAULT_BLOCKER_ID",
    "encode_profile",
    "generate_dataset",
    "generate_random_user_profile",
    "get_feature_names",
    "MODEL_BLOCKER_IDS",
    "MODEL_REASON_IDS",
    "MODEL_RISK_IDS",
    "rank_cities_for_profile",
    "REASON_ID_TO_INDEX",
    "RISK_ID_TO_INDEX",
    "blocker_id_from_index",
    "reason_id_from_index",
    "risk_id_from_index",
    "score_city",
]
