import type {
  IncomeRange,
  IncomeType,
  LifePreference,
  MainFear,
  CostTolerance,
  MoveGoal,
  MoveOptimization,
  RegionPreference,
  SafetyImportance,
  SavingsRange,
  StudyPriority,
} from "@/types";
import {
  buildCityModelProfile,
  mergeCountryModelResults,
  type CityModelInput,
  type CityModelPrediction,
} from "@/lib/scoring/city-model-adapter";
import { matchCountries } from "@/lib/scoring/country-matcher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_MODEL_URL = "http://127.0.0.1:8000";
const DEFAULT_TIMEOUT_MS = 3500;
const MODEL_TOP_K = 5;

const LIFE_PREFERENCES: LifePreference[] = [
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
  "public_transport",
];

const MOVE_GOALS: MoveGoal[] = [
  "remote_work",
  "study",
  "explore_first",
  "find_job",
  "family",
  "not_sure",
];

const INCOME_RANGES: IncomeRange[] = [
  "under_1000",
  "1000_2000",
  "2000_3000",
  "3000_5000",
  "5000_plus",
];

const SAVINGS_RANGES: SavingsRange[] = [
  "under_3000",
  "3000_7000",
  "7000_15000",
  "15000_30000",
  "30000_plus",
];

const INCOME_TYPES: IncomeType[] = [
  "remote_employment",
  "freelance",
  "business_owner",
  "savings_only",
  "student_family",
  "no_stable_income",
];

const MAIN_FEARS: MainFear[] = [
  "documents",
  "money",
  "housing",
  "language",
  "finding_work",
  "being_alone",
  "choosing_wrong_place",
  "legal_status",
];

const REGION_PREFERENCES: RegionPreference[] = [
  "europe",
  "north_america",
  "asia",
  "middle_east",
  "latin_america",
  "not_sure",
];

const MOVE_OPTIMIZATIONS: MoveOptimization[] = [
  "fastest_legal_path",
  "best_career",
  "lowest_cost",
  "comfortable_life",
  "best_study",
  "safest_longterm",
];

const SAFETY_IMPORTANCE: SafetyImportance[] = ["low", "medium", "high"];
const COST_TOLERANCE: CostTolerance[] = ["strict", "flexible", "grant_dependent"];
const STUDY_PRIORITIES: StudyPriority[] = [
  "top_university",
  "scholarship_chance",
  "post_study_work",
  "affordable_degree",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function choice<T extends string>(value: unknown, options: readonly T[]): T | "" {
  return typeof value === "string" && options.includes(value as T) ? (value as T) : "";
}

function choices<T extends string>(value: unknown, options: readonly T[]): T[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is T => typeof item === "string" && options.includes(item as T));
}

function parseInput(body: unknown): CityModelInput | null {
  if (!isRecord(body)) return null;

  return {
    countryId: "",
    citizenship: stringValue(body.citizenship),
    currentCountry: stringValue(body.currentCountry),
    residenceCountry: stringValue(body.residenceCountry),
    language: body.language === "ru" ? "ru" : "en",
    moveGoal: choice(body.moveGoal, MOVE_GOALS),
    monthlyIncome: choice(body.monthlyIncome, INCOME_RANGES),
    savingsRange: choice(body.savingsRange, SAVINGS_RANGES),
    incomeType: choice(body.incomeType, INCOME_TYPES),
    lifePreferences: choices(body.lifePreferences, LIFE_PREFERENCES).slice(0, 5),
    mainFear: choice(body.mainFear, MAIN_FEARS),
    regionPreferences: choices(body.regionPreferences, REGION_PREFERENCES),
    moveOptimization: choice(body.moveOptimization, MOVE_OPTIMIZATIONS),
    safetyImportance: choice(body.safetyImportance, SAFETY_IMPORTANCE) || "medium",
    costTolerance: choice(body.costTolerance, COST_TOLERANCE) || "flexible",
    studyPriority: choice(body.studyPriority, STUDY_PRIORITIES) || "top_university",
  };
}

function getHeuristicResults(input: CityModelInput) {
  return matchCountries({
    language: input.language,
    citizenship: input.citizenship,
    currentCountry: input.currentCountry,
    residenceCountry: input.residenceCountry,
    lifePreferences: input.lifePreferences,
    moveGoal: input.moveGoal,
    monthlyIncome: input.monthlyIncome,
    savingsRange: input.savingsRange,
    incomeType: input.incomeType,
    mainFear: input.mainFear,
    regionPreferences: input.regionPreferences,
    moveOptimization: input.moveOptimization,
    safetyImportance: input.safetyImportance,
    costTolerance: input.costTolerance,
    studyPriority: input.studyPriority,
  });
}

function getModelUrl() {
  return (process.env.CITY_MODEL_URL || DEFAULT_MODEL_URL).replace(/\/+$/, "");
}

function getTimeoutMs() {
  const parsed = Number(process.env.CITY_MODEL_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
}

function getModelHeaders() {
  const headers: Record<string, string> = { "content-type": "application/json" };
  const apiKey = process.env.CITY_MODEL_API_KEY;

  if (apiKey) {
    headers.authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

function parsePredictions(value: unknown): CityModelPrediction[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const cityModelId = item.city_model_id;
    const cityName = item.city_name;
    const rawProbability = item.raw_probability;
    const rank = item.rank;
    const score = item.score;

    if (
      typeof cityModelId !== "number" ||
      typeof cityName !== "string" ||
      typeof rawProbability !== "number" ||
      typeof rank !== "number" ||
      typeof score !== "number"
    ) {
      return [];
    }

    return [{
      city_model_id: cityModelId,
      city_name: cityName,
      raw_probability: rawProbability,
      rank,
      score,
    }];
  });
}

async function fetchModelPredictions(input: CityModelInput) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getTimeoutMs());

  try {
    const response = await fetch(`${getModelUrl()}/predict`, {
      method: "POST",
      headers: getModelHeaders(),
      body: JSON.stringify({
        profile: buildCityModelProfile(input),
        top_k: MODEL_TOP_K,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`City model responded with ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isRecord(payload)) {
      throw new Error("City model returned an invalid payload");
    }

    return {
      modelVersion: stringValue(payload.model_version),
      predictions: parsePredictions(payload.predictions),
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  const input = parseInput(await request.json().catch(() => null));
  if (!input) {
    return Response.json({ error: "Invalid country prediction request" }, { status: 400 });
  }

  const heuristicResults = getHeuristicResults(input);
  if (process.env.CITY_MODEL_ENABLED === "false") {
    return Response.json({
      source: "heuristic",
      results: heuristicResults,
    });
  }

  try {
    const model = await fetchModelPredictions(input);
    const results = mergeCountryModelResults(model.predictions, heuristicResults);

    return Response.json({
      source: model.predictions.length > 0 ? "model" : "heuristic",
      modelVersion: model.modelVersion,
      results,
    });
  } catch (error) {
    console.warn("City model unavailable; using heuristic country matcher.", error);
    return Response.json({
      source: "heuristic",
      fallbackReason: "city_model_unavailable",
      results: heuristicResults,
    });
  }
}
