import math
def sigmoid(x):
    k = 20
    a = -0.1
    return 1 / (1 + math.exp(-k * (x + a)))

import torch 
import torch.nn as nn 

from relocation_dataset import encode_profile, get_feature_names, city_profiles, city_id_to_name

input_size = len(get_feature_names())
output_size = len(city_profiles)


#import model
model = nn.Sequential(
    nn.Linear(input_size, 64),
    nn.ReLU(), 
    nn.Linear(64,64),
    nn.ReLU(),
    nn.Linear(64, output_size)
)

model.load_state_dict(torch.load('city_model.pt'))
model.eval()


#test profiles
profile = {
    "citizenship": "Russia",
    "current_country": "Russia",
    "preferred_language": "English",

    "goal": "move_study",

    "monthly_income": "5000_plus",
    "savings": "7000_15000",
    "income_type": "business_owner",

    "lifestyle_priorities": [
        "sea_nearby",
        "english_friendly",
        "career_opportunities",
        "expat_community",
        "calm_lifestyle"
    ],

    "worries": [
        "choosing_wrong_place", "language"
    ],

    "regions_open_to": [
        "europe",
        "north_america",
    ],

    "optimizing_for": "best_career_upside",
}

profile_2 = {
    "citizenship": "Russia",
    "current_country": "Georgia",
    "preferred_language": "English",

    "goal": "move_remote_work",

    "monthly_income": "3000_5000",
    "savings": "15000_30000",
    "income_type": "remote_employment",

    "lifestyle_priorities": [
        "warm_climate",
        "lower_cost",
        "sea_nearby",
        "expat_community",
        "english_friendly",
    ],

    "worries": [
        "documents",
        "housing",
        "language",
    ],

    "regions_open_to": [
        "europe",
        "asia",
        "middle_east",
    ],

    "optimizing_for": "most_comfortable_daily_life",
}

profile_3 = {
    "citizenship": "Ukraine",
    "current_country": "Serbia",
    "preferred_language": "English",
    "goal": "find_job_abroad",
    "monthly_income": "2000_3000",
    "savings": "7000_15000",
    "income_type": "freelance_clients",
    "lifestyle_priorities": [
        "career_opportunities",
        "english_friendly",
        "big_city",
        "good_transport",
    ],
    "worries": [
        "finding_work",
        "documents",
    ],
    "regions_open_to": [
        "europe",
    ],
    "optimizing_for": "best_career_upside",
}

profile_4 = {
    "citizenship": "Kazakhstan",
    "current_country": "Turkey",
    "preferred_language": "Russian",
    "goal": "explore_first",
    "monthly_income": "1000_2000",
    "savings": "3000_7000",
    "income_type": "savings_only",
    "lifestyle_priorities": [
        "lower_cost",
        "warm_climate",
        "calm_lifestyle",
        "expat_community",
    ],
    "worries": [
        "money",
        "being_alone",
        "choosing_wrong_place",
    ],
    "regions_open_to": [
        "asia",
        "middle_east",
    ],
    "optimizing_for": "lowest_cost",
}

profile_5 = {
    "citizenship": "Germany",
    "current_country": "Germany",
    "preferred_language": "English",
    "goal": "move_family_partner",
    "monthly_income": "5000_plus",
    "savings": "30000_plus",
    "income_type": "remote_employment",
    "lifestyle_priorities": [
        "family_friendly",
        "good_transport",
        "english_friendly",
        "calm_lifestyle",
    ],
    "worries": [
        "housing",
        "choosing_wrong_place",
    ],
    "regions_open_to": [
        "europe",
        "north_america",
    ],
    "optimizing_for": "safest_long_term_option",
}

profile_6 = {
    "citizenship": "Russia",
    "current_country": "UAE",
    "preferred_language": "English",
    "goal": "move_remote_work",
    "monthly_income": "5000_plus",
    "savings": "15000_30000",
    "income_type": "business_owner",
    "lifestyle_priorities": [
        "warm_climate",
        "english_friendly",
        "big_city",
        "expat_community",
        "sea_nearby",
    ],
    "worries": [
        "documents",
        "language",
    ],
    "regions_open_to": [
        "middle_east",
        "asia",
    ],
    "optimizing_for": "fastest_legal_path",
}

profile_7 = {
    "citizenship": "USA",
    "current_country": "Spain",
    "preferred_language": "English",
    "goal": "not_sure",
    "monthly_income": "3000_5000",
    "savings": "30000_plus",
    "income_type": "remote_employment",
    "lifestyle_priorities": [
        "sea_nearby",
        "warm_climate",
        "family_friendly",
        "calm_lifestyle",
        "english_friendly",
    ],
    "worries": [
        "housing",
    ],
    "regions_open_to": [
        "europe",
    ],
    "optimizing_for": "most_comfortable_daily_life",
}

profile_8 = {
    "citizenship": "Turkey",
    "current_country": "Turkey",
    "preferred_language": "English",
    "goal": "move_study",
    "monthly_income": "lt_1000",
    "savings": "lt_3000",
    "income_type": "student_family_support",
    "lifestyle_priorities": [
        "student_life",
        "lower_cost",
        "good_transport",
        "english_friendly",
    ],
    "worries": [
        "money",
        "documents",
        "language",
    ],
    "regions_open_to": [
        "europe",
    ],
    "optimizing_for": "best_study_route",
}

profile_9 = {
    "citizenship": "Spain",
    "current_country": "Spain",
    "preferred_language": "English",
    "goal": "find_job_abroad",
    "monthly_income": "5000_plus",
    "savings": "30000_plus",
    "income_type": "business_owner",
    "lifestyle_priorities": [
        "career_opportunities",
        "big_city",
        "english_friendly",
        "expat_community",
    ],
    "worries": [
        "finding_work",
    ],
    "regions_open_to": [
        "north_america",
    ],
    "optimizing_for": "best_career_upside",
}

profile_10 = {
    "citizenship": "Other",
    "current_country": "Other",
    "preferred_language": "English",
    "goal": "move_remote_work",
    "monthly_income": "2000_3000",
    "savings": "7000_15000",
    "income_type": "freelance_clients",
    "lifestyle_priorities": [
        "lower_cost",
        "warm_climate",
        "sea_nearby",
        "calm_lifestyle",
        "expat_community",
    ],
    "worries": [
        "money",
        "housing",
        "being_alone",
    ],
    "regions_open_to": [
        "open_anything",
    ],
    "optimizing_for": "lowest_cost",
}


def print_prediction(name, user_profile):
    x, feature_names = encode_profile(user_profile)
    x_tensor = torch.tensor([x], dtype=torch.float32)

    with torch.no_grad():
        logits = model(x_tensor)

        temperature = 1.0
        probs = torch.softmax(logits / temperature, dim=1)[0]

        top10 = probs.topk(10)

    city_ids = top10.indices.tolist()
    raw_probs = top10.values.tolist()
    num_cities = len(city_id_to_name)

    print(name)
    i = 0
    for city_id, raw_prob in zip(city_ids, raw_probs):
        match = sigmoid(raw_prob)
        match = min(match, 0.98 + (sigmoid(-(i/30 - 0.01))-0.13)/2)
        i += 1
        print(
            city_id,
            city_id_to_name[city_id],
            f'{raw_prob * 100:.2f}% raw',
            f'{match * 100:.2f}% match'
        )
    print()


print_prediction("profile 1", profile)
print_prediction("profile 2", profile_2)
print_prediction("profile 3", profile_3)
print_prediction("profile 4", profile_4)
print_prediction("profile 5", profile_5)
print_prediction("profile 6", profile_6)
print_prediction("profile 7", profile_7)
print_prediction("profile 8", profile_8)
print_prediction("profile 9", profile_9)
print_prediction("profile 10", profile_10)

