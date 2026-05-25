# Soft Landing Relocation Dataset

This package builds a small dataset layer for a micrograd-style city recommendation experiment. It converts onboarding answers into numeric feature vectors and uses a rule-based teacher to assign each profile a target city index.

It does not include a neural network, API, database, or frontend.

## What It Produces

Each generated sample has:

```python
{
    "profile": {...},          # raw onboarding answers
    "x": [...],                # numeric input vector
    "y_index": 0,              # target city id
    "y_onehot": [...],         # one-hot label with one slot per city
    "y_scores": [...],         # soft teacher distribution over all cities
    "best_city": "Valencia",
    "teacher_scores": [...]
}
```

The `city_id_to_name` dictionary maps model outputs back to city names:

```python
from relocation_dataset import city_id_to_name

city_name = city_id_to_name[y_index]
```

## How Answers Become Vectors

The encoder in `encoders.py` turns onboarding fields into one stable vector:

- single-choice categories become one-hot features
- multi-choice categories become multi-hot features
- money buckets become normalized numeric values
- legal context adds `legal_mobility_score` and `has_eu_residence`
- income type adds both a one-hot feature and `income_stability`

Use `encode_profile(profile)` to get both the vector and feature names:

```python
from relocation_dataset import encode_profile

x, feature_names = encode_profile(profile)
```

`feature_names` is always returned in the exact same order as `x`, which makes the CSV columns and model inputs stable.

## Why Mostly Binary Features

Most onboarding answers are choices, not continuous measurements. One-hot and multi-hot encoding keeps the representation simple and readable:

- a citizenship is exactly one selected option
- lifestyle priorities can contain several selected options
- worries can contain several selected options
- regions open to can contain several selected options

This is a good fit for a tiny MLP because every input has a predictable scale, usually `0.0` or `1.0`, and the few continuous fields are normalized to `0.0` to `1.0`.

## City Profiles

`cities.py` contains:

- `city_id_to_name`
- `city_profiles`

The original 15 city IDs are preserved:

0. Valencia
1. Barcelona
2. Madrid
3. Lisbon
4. Porto
5. Warsaw
6. Berlin
7. Prague
8. Dubai
9. Bangkok
10. Chiang Mai
11. Istanbul
12. Tbilisi
13. Belgrade
14. Toronto

The dataset also includes every city from the app catalog in `src/lib/data/cities.ts`, appended after ID 14 without duplicating cities already present:

- Alicante
- Madeira
- Algarve
- Munich
- Hamburg
- Frankfurt
- Amsterdam
- Rotterdam
- Utrecht
- Eindhoven
- London
- Manchester
- Edinburgh
- Birmingham
- Vancouver
- Calgary
- Montreal
- New York
- San Francisco
- Los Angeles
- Seattle
- Boston
- Chicago
- Washington DC
- Denver
- Atlanta
- Dallas
- Houston
- Philadelphia
- San Diego
- Portland
- Phoenix
- Nashville
- Miami
- Austin
- Abu Dhabi
- Phuket
- Mexico City
- Playa del Carmen
- Guadalajara
- Krakow
- Wroclaw
- Brno

Each city profile has normalized features such as cost level, warm climate, English friendliness, legal clarity, housing difficulty, earning upside, and region. `earning_upside` separates salary/career ceiling from general job availability, so cities like San Francisco, Seattle, New York, Boston, London, Amsterdam, and Berlin can win when the user explicitly optimizes for career upside.

## Rule-Based Teacher

`scoring.py` scores eligible cities for each profile and chooses the best one. It combines:

- legal score
- budget score
- lifestyle score
- worry penalty
- goal score
- optimization score

Region choices are treated as hard filters unless `open_anything` is selected. Very low income combined with very high city cost receives a strong penalty.

When `optimizing_for` is `best_career_upside`, the teacher weights earning upside and career opportunities more heavily and reduces the influence of pure affordability. Cost and housing still matter, especially when the user worries about money or housing.

## Exporting

Run this from the repo root:

```bash
python3 relocation_dataset/export_dataset.py
```

It creates:

- `dataset.json`
- `dataset.csv`

The CSV includes one column per feature, plus `y_index` and `best_city`.

## Later Micrograd MLP Shape

The later neural net can treat this as either hard-label or soft-label training:

```text
user_vector -> scores for each city -> argmax -> city_id_to_name
```

For example:

```python
input_size = len(feature_names)
output_size = len(city_id_to_name)
```

The model should output one score per city. The predicted city id is the index of the largest output score.

For PyTorch, `y_scores` is usually better than `y_onehot` because it teaches close alternatives from the rule-based teacher. Use `KLDivLoss` with `log_softmax(model(x))` to mimic the full teacher ranking, not only the single top city.
