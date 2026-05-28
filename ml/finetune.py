"""Fine-tune the city model from Supabase profile and behavior data."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Callable, Mapping


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None

if load_dotenv is not None:
    load_dotenv(PROJECT_ROOT / ".env.local")
    load_dotenv(PROJECT_ROOT / ".env")

import torch
import torch.nn as nn
import torch.optim as optim
from supabase import create_client

from relocation_dataset.cities import city_id_to_name
from relocation_dataset.encoders import encode_profile
from relocation_dataset.schemas import (
    CITIZENSHIPS,
    CURRENT_COUNTRIES,
    GOALS,
    INCOME_TYPES,
    LIFESTYLE_PRIORITIES,
    MONTHLY_INCOME_BUCKETS,
    OPTIMIZING_FOR,
    REGIONS_OPEN_TO,
    SAVINGS_BUCKETS,
    WORRIES,
)

try:
    from .city_inference import _build_model, _resolve_model_path
except ImportError:
    from city_inference import _build_model, _resolve_model_path


LR = float(os.environ.get("CITY_MODEL_FINETUNE_LR", "0.0001"))
EPOCHS = int(os.environ.get("CITY_MODEL_FINETUNE_EPOCHS", "30"))
MIN_SAMPLES = int(os.environ.get("CITY_MODEL_MIN_FINETUNE_SAMPLES", "1"))
PAGE_SIZE = int(os.environ.get("CITY_MODEL_FINETUNE_PAGE_SIZE", "1000"))

PROFILE_SELECTED_WEIGHT = 1.0
EVENT_SELECTED_WEIGHT = 1.0
SHORTLIST_WEIGHT = 0.35
BEHAVIOR_WEIGHT_CAP = 0.30

TRAINING_EVENT_NAMES = (
    "city_card_view",
    "city_selected",
    "legal_path_selected",
    "onboarding_completed",
    "roadmap_opened",
)

PROFILE_COLUMNS = (
    "id, user_id, citizenship, current_country, residence_country, "
    "preferred_language, move_goal, monthly_income_range, savings_range, "
    "income_type, life_preferences, worries, open_regions, optimization_goal, "
    "saved_city_ids, selected_city_id, updated_at"
)

EVENT_COLUMNS = (
    "id, user_id, move_profile_id, event_name, event_payload, created_at"
)


@dataclass
class TrainingStats:
    profile_rows: int = 0
    event_rows: int = 0
    samples: int = 0
    explicit_samples: int = 0
    behavioral_samples: int = 0
    shortlist_samples: int = 0
    skipped_profiles: int = 0
    invalid_profiles: int = 0
    unlinked_events: int = 0
    unmapped_city_ids: dict[str, int] = field(default_factory=dict)


def _normalize_app_city_id(value: str) -> str:
    return "-".join(value.strip().casefold().replace("_", "-").split())


APP_CITY_ID_TO_MODEL_ID = {
    _normalize_app_city_id(city_name): city_model_id
    for city_model_id, city_name in city_id_to_name.items()
}

COUNTRY_ALIASES: dict[str, tuple[str, ...]] = {
    "Russia": ("russia", "russian", "россия", "рф", "российская федерация"),
    "Ukraine": ("ukraine", "ukrainian", "украина"),
    "Germany": ("germany", "german", "deutschland", "германия"),
    "Spain": ("spain", "spanish", "espana", "испания"),
    "USA": (
        "usa",
        "us",
        "u s",
        "united states",
        "america",
        "сша",
        "соединенные штаты",
        "соединенные штаты америки",
    ),
    "Turkey": ("turkey", "turkiye", "турция"),
    "Kazakhstan": ("kazakhstan", "казахстан"),
    "UAE": ("uae", "united arab emirates", "оаэ", "дубай"),
    "Serbia": ("serbia", "сербия"),
    "Georgia": ("georgia", "грузия", "sakartvelo"),
}

LANGUAGE_TO_MODEL = {
    "en": "English",
    "english": "English",
    "ru": "Russian",
    "russian": "Russian",
    "русский": "Russian",
}

GOAL_TO_MODEL = {
    "remote_work": "move_remote_work",
    "study": "move_study",
    "explore": "explore_first",
    "explore_first": "explore_first",
    "find_job": "find_job_abroad",
    "family": "move_family_partner",
    "not_sure": "not_sure",
}

INCOME_TO_MODEL = {
    "under_1000": "lt_1000",
    "lt1000": "lt_1000",
    "lt_1000": "lt_1000",
    "1000_2000": "1000_2000",
    "2000_3000": "2000_3000",
    "3000_5000": "3000_5000",
    "5000plus": "5000_plus",
    "5000_plus": "5000_plus",
}

SAVINGS_TO_MODEL = {
    "under_3000": "lt_3000",
    "lt3000": "lt_3000",
    "lt_3000": "lt_3000",
    "3000_7000": "3000_7000",
    "7000_15000": "7000_15000",
    "15000_30000": "15000_30000",
    "30000plus": "30000_plus",
    "30000_plus": "30000_plus",
}

INCOME_TYPE_TO_MODEL = {
    "remote_employment": "remote_employment",
    "freelance": "freelance_clients",
    "freelance_clients": "freelance_clients",
    "business_owner": "business_owner",
    "savings_only": "savings_only",
    "student_family": "student_family_support",
    "student_family_support": "student_family_support",
    "no_stable_income": "no_stable_income_yet",
    "no_stable_income_yet": "no_stable_income_yet",
}

LIFE_PREFERENCE_TO_MODEL = {
    "warm_climate": "warm_climate",
    "lower_cost": "lower_cost",
    "big_city": "big_city",
    "sea_nearby": "sea_nearby",
    "expat_community": "expat_community",
    "english_friendly": "english_friendly",
    "family_friendly": "family_friendly",
    "career_opportunities": "career_opportunities",
    "calm_lifestyle": "calm_lifestyle",
    "student_life": "student_life",
    "public_transport": "good_transport",
    "good_transport": "good_transport",
}

WORRY_TO_MODEL = {
    "documents": "documents",
    "money": "money",
    "housing": "housing",
    "language": "language",
    "finding_work": "finding_work",
    "being_alone": "being_alone",
    "choosing_wrong_place": "choosing_wrong_place",
    "legal_status": "documents",
}

REGION_TO_MODEL = {
    "europe": "europe",
    "north_america": "north_america",
    "asia": "asia",
    "middle_east": "middle_east",
    "latin_america": "latin_america",
    "oceania": "oceania",
    "not_sure": "open_anything",
    "open_anything": "open_anything",
}

OPTIMIZATION_TO_MODEL = {
    "fastest_legal_path": "fastest_legal_path",
    "best_career": "best_career_upside",
    "best_career_upside": "best_career_upside",
    "lowest_cost": "lowest_cost",
    "comfortable_life": "most_comfortable_daily_life",
    "most_comfortable_daily_life": "most_comfortable_daily_life",
    "best_study": "best_study_route",
    "best_study_route": "best_study_route",
    "safest_longterm": "safest_long_term_option",
    "safest_long_term_option": "safest_long_term_option",
}


def _normalize_text(value: Any) -> str:
    return (
        str(value or "")
        .strip()
        .casefold()
        .replace("ё", "е")
        .replace(".", " ")
        .replace("_", " ")
        .replace("-", " ")
    )


def _normalize_country(value: Any, allowed: list[str], fallback: str) -> str:
    normalized = " ".join(_normalize_text(value).split())
    if not normalized:
        return fallback

    for country in allowed:
        if " ".join(_normalize_text(country).split()) == normalized:
            return country

        aliases = COUNTRY_ALIASES.get(country, ())
        if any(" ".join(_normalize_text(alias).split()) == normalized for alias in aliases):
            return country

    return fallback


def _map_choice(
    value: Any,
    mapping: Mapping[str, str],
    allowed: list[str],
    fallback: str,
) -> str:
    raw = str(value or "").strip()
    if raw in allowed:
        return raw

    mapped = mapping.get(raw)
    if mapped in allowed:
        return mapped

    normalized = _normalize_app_city_id(raw)
    mapped = mapping.get(normalized)
    if mapped in allowed:
        return mapped

    return fallback


def _as_list(value: Any) -> list[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, tuple):
        return list(value)
    if isinstance(value, str):
        stripped = value.strip()
        if not stripped:
            return []
        if stripped.startswith("["):
            try:
                parsed = json.loads(stripped)
            except json.JSONDecodeError:
                return [stripped]
            return parsed if isinstance(parsed, list) else [parsed]
        return [stripped]
    return [value]


def _map_list(
    values: Any,
    mapping: Mapping[str, str],
    allowed: list[str],
    max_items: int | None = None,
) -> list[str]:
    result: list[str] = []
    for value in _as_list(values):
        mapped = _map_choice(value, mapping, allowed, "")
        if mapped and mapped not in result:
            result.append(mapped)

    if max_items is not None:
        return result[:max_items]
    return result


def _map_regions(values: Any) -> list[str]:
    regions = _map_list(values, REGION_TO_MODEL, REGIONS_OPEN_TO)
    if not regions or "open_anything" in regions:
        return ["open_anything"]
    return regions


def _profile_to_model_profile(row: Mapping[str, Any]) -> dict[str, Any]:
    current_country = row.get("current_country") or row.get("residence_country")
    language_key = str(row.get("preferred_language") or "en").strip().casefold()

    return {
        "citizenship": _normalize_country(row.get("citizenship"), CITIZENSHIPS, "Other"),
        "current_country": _normalize_country(current_country, CURRENT_COUNTRIES, "Other"),
        "preferred_language": LANGUAGE_TO_MODEL.get(language_key, "English"),
        "goal": _map_choice(row.get("move_goal"), GOAL_TO_MODEL, GOALS, "not_sure"),
        "monthly_income": _map_choice(
            row.get("monthly_income_range"),
            INCOME_TO_MODEL,
            MONTHLY_INCOME_BUCKETS,
            "2000_3000",
        ),
        "savings": _map_choice(
            row.get("savings_range"),
            SAVINGS_TO_MODEL,
            SAVINGS_BUCKETS,
            "7000_15000",
        ),
        "income_type": _map_choice(
            row.get("income_type"),
            INCOME_TYPE_TO_MODEL,
            INCOME_TYPES,
            "no_stable_income_yet",
        ),
        "lifestyle_priorities": _map_list(
            row.get("life_preferences"),
            LIFE_PREFERENCE_TO_MODEL,
            LIFESTYLE_PRIORITIES,
            max_items=5,
        ),
        "worries": _map_list(row.get("worries"), WORRY_TO_MODEL, WORRIES),
        "regions_open_to": _map_regions(row.get("open_regions")),
        "optimizing_for": _map_choice(
            row.get("optimization_goal"),
            OPTIMIZATION_TO_MODEL,
            OPTIMIZING_FOR,
            "most_comfortable_daily_life",
        ),
        "safety_importance": "medium",
        "cost_tolerance": "flexible",
        "study_priority": "top_university",
    }


def _get_supabase_client():
    url = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    service_key = (
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        or os.environ.get("SUPABASE_SERVICE_KEY")
    )

    if not url:
        raise RuntimeError("Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL before fine-tuning")
    if not service_key:
        raise RuntimeError(
            "Set SUPABASE_SERVICE_ROLE_KEY before fine-tuning so app_events can be read"
        )

    return create_client(url, service_key)


def _rows(response: Any) -> list[dict[str, Any]]:
    data = getattr(response, "data", None)
    if callable(data):
        data = data()
    return list(data or [])


def _fetch_all(build_query: Callable[[], Any], page_size: int = PAGE_SIZE) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    offset = 0

    while True:
        response = build_query().range(offset, offset + page_size - 1).execute()
        page = _rows(response)
        rows.extend(page)

        if len(page) < page_size:
            return rows
        offset += page_size


def _parse_payload(raw_payload: Any) -> dict[str, Any]:
    if isinstance(raw_payload, dict):
        return raw_payload
    if isinstance(raw_payload, str):
        try:
            parsed = json.loads(raw_payload)
        except json.JSONDecodeError:
            return {}
        return parsed if isinstance(parsed, dict) else {}
    return {}


def _first_present(payload: Mapping[str, Any], keys: tuple[str, ...]) -> Any:
    for key in keys:
        if key in payload and payload[key] is not None and payload[key] != "":
            return payload[key]
    return None


def app_city_id_to_model_id(app_city_id: Any) -> int | None:
    if app_city_id is None or app_city_id == "":
        return None

    if isinstance(app_city_id, int):
        return app_city_id if app_city_id in city_id_to_name else None

    normalized_city_id = _normalize_app_city_id(str(app_city_id))
    if normalized_city_id.isdigit():
        city_model_id = int(normalized_city_id)
        return city_model_id if city_model_id in city_id_to_name else None

    return APP_CITY_ID_TO_MODEL_ID.get(normalized_city_id)


def _record_unmapped_city(stats: TrainingStats, raw_city_id: Any) -> None:
    if raw_city_id is None or raw_city_id == "":
        return
    key = str(raw_city_id)
    stats.unmapped_city_ids[key] = stats.unmapped_city_ids.get(key, 0) + 1


def _resolve_city_id(raw_city_id: Any, stats: TrainingStats) -> int | None:
    city_model_id = app_city_id_to_model_id(raw_city_id)
    if city_model_id is None:
        _record_unmapped_city(stats, raw_city_id)
    return city_model_id


def _add_target(
    targets: dict[int, float],
    city_model_id: int,
    weight: float,
    *,
    additive: bool = False,
    cap: float | None = None,
) -> None:
    if weight <= 0:
        return

    current = targets.get(city_model_id, 0.0)
    next_weight = current + weight if additive else max(current, weight)
    if cap is not None:
        next_weight = min(next_weight, cap)
    targets[city_model_id] = next_weight


def _behavior_weight(payload: Mapping[str, Any]) -> float:
    raw_duration = payload.get("duration_ms", payload.get("durationMs", 0))
    try:
        duration_ms = max(0.0, float(raw_duration or 0))
    except (TypeError, ValueError):
        duration_ms = 0.0

    scrolled = bool(payload.get("scrolled_to_details", payload.get("scrolledToDetails", False)))
    if duration_ms < 1000 and not scrolled:
        return 0.0

    dwell_signal = min(duration_ms, 15000.0) / 15000.0
    weight = 0.08 + dwell_signal * 0.16
    if duration_ms >= 5000:
        weight += 0.04
    if scrolled:
        weight += 0.08
    return min(BEHAVIOR_WEIGHT_CAP, weight)


def _event_city_id(event_name: str, payload: Mapping[str, Any]) -> Any:
    if event_name == "city_card_view":
        return _first_present(payload, ("app_city_id", "cityId", "city_id"))
    return _first_present(payload, ("cityId", "app_city_id", "city_id"))


def _build_training_samples_from_rows(
    profiles: list[dict[str, Any]],
    events: list[dict[str, Any]],
) -> tuple[list[dict[str, Any]], TrainingStats]:
    stats = TrainingStats(profile_rows=len(profiles), event_rows=len(events))

    profiles_by_id = {
        str(profile["id"]): profile
        for profile in profiles
        if profile.get("id") is not None
    }
    profile_id_by_user = {
        str(profile["user_id"]): str(profile["id"])
        for profile in profiles
        if profile.get("id") is not None and profile.get("user_id") is not None
    }

    targets_by_profile_id: dict[str, dict[int, float]] = {
        profile_id: {} for profile_id in profiles_by_id
    }
    sources_by_profile_id: dict[str, set[str]] = {
        profile_id: set() for profile_id in profiles_by_id
    }
    selected_by_profile_id: dict[str, int] = {}

    for profile_id, profile in profiles_by_id.items():
        selected_city_id = _resolve_city_id(profile.get("selected_city_id"), stats)
        if selected_city_id is not None:
            _add_target(
                targets_by_profile_id[profile_id],
                selected_city_id,
                PROFILE_SELECTED_WEIGHT,
            )
            selected_by_profile_id[profile_id] = selected_city_id
            sources_by_profile_id[profile_id].add("explicit")

        for raw_saved_city_id in _as_list(profile.get("saved_city_ids")):
            saved_city_id = _resolve_city_id(raw_saved_city_id, stats)
            if saved_city_id is None:
                continue
            _add_target(targets_by_profile_id[profile_id], saved_city_id, SHORTLIST_WEIGHT)
            sources_by_profile_id[profile_id].add("shortlist")

    for event in events:
        profile_id = event.get("move_profile_id")
        if profile_id is None and event.get("user_id") is not None:
            profile_id = profile_id_by_user.get(str(event["user_id"]))
        if profile_id is None:
            stats.unlinked_events += 1
            continue

        profile_id = str(profile_id)
        if profile_id not in targets_by_profile_id:
            stats.unlinked_events += 1
            continue

        event_name = str(event.get("event_name") or "")
        payload = _parse_payload(event.get("event_payload"))
        city_model_id = _resolve_city_id(_event_city_id(event_name, payload), stats)
        if city_model_id is None:
            continue

        if event_name == "city_card_view":
            weight = _behavior_weight(payload)
            if weight <= 0:
                continue
            _add_target(
                targets_by_profile_id[profile_id],
                city_model_id,
                weight,
                additive=True,
                cap=BEHAVIOR_WEIGHT_CAP,
            )
            sources_by_profile_id[profile_id].add("behavior")
            continue

        selected_city_id = selected_by_profile_id.get(profile_id)
        if selected_city_id is not None and city_model_id != selected_city_id:
            continue

        _add_target(
            targets_by_profile_id[profile_id],
            city_model_id,
            EVENT_SELECTED_WEIGHT,
        )
        sources_by_profile_id[profile_id].add("explicit")

    samples: list[dict[str, Any]] = []
    city_count = len(city_id_to_name)

    for profile_id, profile in profiles_by_id.items():
        targets = targets_by_profile_id[profile_id]
        if not targets:
            stats.skipped_profiles += 1
            continue

        try:
            x, _feature_names = encode_profile(_profile_to_model_profile(profile))
        except (TypeError, ValueError) as error:
            stats.invalid_profiles += 1
            print(f"Skipping invalid profile {profile_id}: {error}")
            continue

        y = torch.zeros(city_count, dtype=torch.float32)
        for city_model_id, weight in targets.items():
            y[city_model_id] = max(float(y[city_model_id]), float(weight))

        total = float(y.sum().item())
        if total <= 0:
            stats.skipped_profiles += 1
            continue

        y = y / total
        sources = sources_by_profile_id[profile_id]
        samples.append(
            {
                "profile_id": profile_id,
                "user_id": profile.get("user_id"),
                "x": x,
                "y": y.tolist(),
                "sources": sorted(sources),
            }
        )

        if "explicit" in sources:
            stats.explicit_samples += 1
        if "behavior" in sources:
            stats.behavioral_samples += 1
        if "shortlist" in sources:
            stats.shortlist_samples += 1

    stats.samples = len(samples)
    return samples, stats


def fetch_training_dataset() -> tuple[list[dict[str, Any]], TrainingStats]:
    sb = _get_supabase_client()

    profiles = _fetch_all(
        lambda: sb.table("move_profiles")
        .select(PROFILE_COLUMNS)
        .order("updated_at", desc=False)
    )
    events = _fetch_all(
        lambda: sb.table("app_events")
        .select(EVENT_COLUMNS)
        .in_("event_name", list(TRAINING_EVENT_NAMES))
        .order("created_at", desc=False)
    )

    return _build_training_samples_from_rows(profiles, events)


def fetch_training_samples() -> list[dict[str, Any]]:
    samples, _stats = fetch_training_dataset()
    return samples


def _print_stats(stats: TrainingStats) -> None:
    print(
        "Training data: "
        f"{stats.samples} samples from {stats.profile_rows} profiles and {stats.event_rows} events"
    )
    print(
        "Signals: "
        f"{stats.explicit_samples} explicit, "
        f"{stats.behavioral_samples} behavioral, "
        f"{stats.shortlist_samples} shortlist"
    )

    if stats.skipped_profiles or stats.invalid_profiles or stats.unlinked_events:
        print(
            "Skipped: "
            f"{stats.skipped_profiles} profiles without targets, "
            f"{stats.invalid_profiles} invalid profiles, "
            f"{stats.unlinked_events} unlinked events"
        )

    if stats.unmapped_city_ids:
        top_unmapped = sorted(
            stats.unmapped_city_ids.items(),
            key=lambda item: (-item[1], item[0]),
        )[:10]
        formatted = ", ".join(f"{city_id} ({count})" for city_id, count in top_unmapped)
        print(f"Unmapped city ids: {formatted}")


def _load_state_dict(model_path: Path) -> dict[str, torch.Tensor]:
    try:
        return torch.load(model_path, map_location="cpu", weights_only=True)
    except TypeError:
        return torch.load(model_path, map_location="cpu")


def finetune(
    *,
    dry_run: bool = False,
    epochs: int = EPOCHS,
    lr: float = LR,
    min_samples: int = MIN_SAMPLES,
) -> None:
    samples, stats = fetch_training_dataset()
    _print_stats(stats)

    if dry_run:
        print("Dry run complete; model was not updated")
        return

    if len(samples) < min_samples:
        print(f"Not enough data: {len(samples)} samples, need at least {min_samples}")
        return

    x_tensor = torch.tensor([sample["x"] for sample in samples], dtype=torch.float32)
    y_tensor = torch.tensor([sample["y"] for sample in samples], dtype=torch.float32)

    model_path = _resolve_model_path()
    model = _build_model()
    model.load_state_dict(_load_state_dict(model_path))

    if len(samples) < 2:
        x_train, y_train = x_tensor, y_tensor
        x_val = y_val = None
    else:
        split = max(1, min(len(samples) - 1, int(len(samples) * 0.8)))
        x_train, x_val = x_tensor[:split], x_tensor[split:]
        y_train, y_val = y_tensor[:split], y_tensor[split:]

    loss_fn = nn.KLDivLoss(reduction="batchmean")
    optimizer = optim.Adam(model.parameters(), lr=lr)

    best_metric = float("inf")
    best_state: dict[str, torch.Tensor] | None = None

    for epoch in range(1, epochs + 1):
        model.train()
        log_probs = torch.log_softmax(model(x_train), dim=1)
        loss = loss_fn(log_probs, y_train)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if epoch == 1 or epoch % 5 == 0 or epoch == epochs:
            model.eval()
            if x_val is None or y_val is None:
                metric = float(loss.item())
                print(f"epoch {epoch} train_loss {loss.item():.4f} val_loss skipped")
            else:
                with torch.no_grad():
                    val_loss = loss_fn(torch.log_softmax(model(x_val), dim=1), y_val).item()
                metric = float(val_loss)
                print(
                    f"epoch {epoch} train_loss {loss.item():.4f} "
                    f"val_loss {val_loss:.4f}"
                )

            if metric < best_metric:
                best_metric = metric
                best_state = {key: value.detach().clone() for key, value in model.state_dict().items()}

    if best_state is None:
        print("No model update was produced")
        return

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = model_path.parent / f"{model_path.stem}_{timestamp}{model_path.suffix}"
    shutil.copy(model_path, backup_path)
    print(f"Backed up current model to {backup_path}")

    torch.save(best_state, model_path)
    print(f"Saved fine-tuned model to {model_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Fine-tune the city model from Supabase data")
    parser.add_argument("--dry-run", action="store_true", help="Fetch and validate data only")
    parser.add_argument("--epochs", type=int, default=EPOCHS)
    parser.add_argument("--lr", type=float, default=LR)
    parser.add_argument("--min-samples", type=int, default=MIN_SAMPLES)
    args = parser.parse_args()

    finetune(
        dry_run=args.dry_run,
        epochs=args.epochs,
        lr=args.lr,
        min_samples=args.min_samples,
    )


if __name__ == "__main__":
    main()
