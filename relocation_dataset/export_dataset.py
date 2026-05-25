"""Export generated relocation samples to JSON and CSV."""

from __future__ import annotations

import argparse
import csv
import json
from collections import Counter
from pathlib import Path
from pprint import pprint
from typing import Any

if __package__ in {None, ""}:
    import sys

    sys.path.append(str(Path(__file__).resolve().parents[1]))

from relocation_dataset.cities import city_id_to_name, city_count
from relocation_dataset.encoders import get_feature_names
from relocation_dataset.generator import generate_dataset


def export_dataset(
    n: int = 1000,
    seed: int = 42,
    output_dir: str | Path = ".",
) -> list[dict[str, Any]]:
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    dataset = generate_dataset(n=n, seed=seed)
    feature_names = get_feature_names()

    json_payload = {
        "feature_names": feature_names,
        "city_id_to_name": city_id_to_name,
        "samples": dataset,
    }

    with (output_path / "dataset.json").open("w", encoding="utf-8") as file:
        json.dump(json_payload, file, ensure_ascii=False, indent=2)

    with (output_path / "dataset.csv").open("w", encoding="utf-8", newline="") as file:
        fieldnames = [*feature_names, "y_index", "best_city"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()

        for sample in dataset:
            row = {name: value for name, value in zip(feature_names, sample["x"])}
            row["y_index"] = sample["y_index"]
            row["best_city"] = sample["best_city"]
            writer.writerow(row)

    return dataset


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Soft Landing relocation dataset files.")
    parser.add_argument("--n", type=int, default=1000, help="Number of samples to generate.")
    parser.add_argument("--seed", type=int, default=42, help="Random seed.")
    parser.add_argument("--output-dir", default=".", help="Directory for dataset.json and dataset.csv.")
    args = parser.parse_args()

    dataset = export_dataset(n=args.n, seed=args.seed, output_dir=args.output_dir)
    feature_names = get_feature_names()
    distribution = Counter((sample["y_index"], sample["best_city"]) for sample in dataset)

    print(f"input_size: {len(feature_names)}")
    print(f"number_of_cities: {city_count()}")
    print("first_sample:")
    pprint(dataset[0])
    print("distribution:")
    for (city_id, city_name), count in sorted(distribution.items()):
        print(f"{city_id}: {city_name} -> {count}")


if __name__ == "__main__":
    main()
