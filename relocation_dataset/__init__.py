"""Dataset layer for Soft Landing city recommendation experiments."""

from .cities import city_id_to_name, city_profiles
from .encoders import encode_profile, get_feature_names
from .generator import generate_dataset, generate_random_user_profile
from .scoring import choose_best_city, rank_cities_for_profile, score_city

__all__ = [
    "choose_best_city",
    "city_id_to_name",
    "city_profiles",
    "encode_profile",
    "generate_dataset",
    "generate_random_user_profile",
    "get_feature_names",
    "rank_cities_for_profile",
    "score_city",
]
