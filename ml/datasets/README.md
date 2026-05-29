# ML Datasets

## City Explanations

Production-style supervised dataset for explanation heads:

```txt
profile + candidate city -> reason_ids + risk_ids + blocker_id
```

Generated files:

```txt
city_explanations_train.jsonl
city_explanations_validation.jsonl
city_explanations_test.jsonl
city_explanations_manifest.json
```

Regenerate deterministically:

```bash
python3 ml/datasets/build_city_explanation_seed.py
```

Default generation:

```txt
720 user profiles
18 candidate cities per profile
profile-grouped train/validation/test split
all reason/risk/blocker IDs covered
```

Each JSONL row includes:

```json
{
  "schema_version": "city_explanations_v1",
  "sample_id": "explain_000001",
  "profile_id": "profile_00001",
  "split": "train",
  "candidate_rank": 1,
  "teacher_city_score": 0.82,
  "profile": {},
  "profile_feature_values": [],
  "city": {
    "city_model_id": 0,
    "city_name": "Valencia",
    "feature_values": []
  },
  "labels": {
    "reason_ids": ["warm_climate_fit"],
    "reason_vector": [],
    "risk_ids": ["housing_pressure"],
    "risk_vector": [],
    "blocker_id": "housing_too_competitive",
    "blocker_index": 2
  },
  "label_source": "rule_teacher_v2"
}
```

Feature names and label coverage live in:

```txt
city_explanations_manifest.json
```

The stable explanation ID contract lives in:

```txt
relocation_dataset/explanations.py
src/lib/explanations/explanation-taxonomy.ts
```
