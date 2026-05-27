import type {
  CityMatchResult,
  CountryMatchResult,
  CostTolerance,
  IncomeRange,
  IncomeType,
  LifePreference,
  MainFear,
  MoveGoal,
  MoveOptimization,
  RegionPreference,
  SafetyImportance,
  SavingsRange,
  StudyPriority,
} from "@/types";
import { getCityById } from "@/lib/data/cities";

export type CityModelInput = {
  countryId: string;
  citizenship: string;
  currentCountry: string;
  residenceCountry: string;
  language: "ru" | "en";
  moveGoal: MoveGoal | "";
  monthlyIncome: IncomeRange | "";
  savingsRange: SavingsRange | "";
  incomeType: IncomeType | "";
  lifePreferences: LifePreference[];
  mainFear: MainFear | "";
  regionPreferences: RegionPreference[];
  moveOptimization: MoveOptimization | "";
  safetyImportance?: SafetyImportance;
  costTolerance?: CostTolerance;
  studyPriority?: StudyPriority;
};

export type CityModelProfile = {
  citizenship: string;
  current_country: string;
  preferred_language: string;
  goal: string;
  monthly_income: string;
  savings: string;
  income_type: string;
  lifestyle_priorities: string[];
  worries: string[];
  regions_open_to: string[];
  optimizing_for: string;
  safety_importance: string;
  cost_tolerance: string;
  study_priority: string;
};

export type CityModelPrediction = {
  city_model_id: number;
  city_name: string;
  raw_probability: number;
  rank: number;
  score: number;
};

const MODEL_CITY_ID_TO_APP_CITY_ID: Record<number, string> = {
  0: "valencia",
  1: "barcelona",
  2: "madrid",
  3: "lisbon",
  4: "porto",
  5: "warsaw",
  6: "berlin",
  7: "prague",
  8: "dubai",
  9: "bangkok",
  10: "chiang-mai",
  11: "istanbul",
  12: "tbilisi",
  13: "belgrade",
  14: "toronto",
  15: "alicante",
  16: "madeira",
  17: "algarve",
  18: "munich",
  19: "hamburg",
  20: "frankfurt",
  21: "amsterdam",
  22: "rotterdam",
  23: "utrecht",
  24: "eindhoven",
  25: "london",
  26: "manchester",
  27: "edinburgh",
  28: "birmingham",
  29: "vancouver",
  30: "calgary",
  31: "montreal",
  32: "new-york",
  33: "san-francisco",
  34: "miami",
  35: "austin",
  36: "abu-dhabi",
  37: "phuket",
  38: "mexico-city",
  39: "playa-del-carmen",
  40: "guadalajara",
  41: "krakow",
  42: "wroclaw",
  43: "brno",
  44: "los-angeles",
  45: "seattle",
  46: "boston",
  47: "chicago",
  48: "washington-dc",
  49: "denver",
  50: "atlanta",
  51: "dallas",
  52: "houston",
  53: "philadelphia",
  54: "san-diego",
  55: "portland",
  56: "phoenix",
  57: "nashville",
};

const COUNTRY_ALIASES: Record<string, string[]> = {
  Russia: ["russia", "russian", "россия", "рф", "российская федерация"],
  Ukraine: ["ukraine", "ukrainian", "украина"],
  Germany: ["germany", "german", "deutschland", "германия"],
  Spain: ["spain", "spanish", "espana", "испания"],
  USA: [
    "usa",
    "us",
    "u s",
    "united states",
    "america",
    "сша",
    "соединенные штаты",
    "соединенные штаты америки",
  ],
  Turkey: ["turkey", "turkiye", "турция"],
  Kazakhstan: ["kazakhstan", "казахстан"],
  UAE: ["uae", "united arab emirates", "оаэ", "дубай"],
  Serbia: ["serbia", "сербия"],
  Georgia: ["georgia", "грузия", "sakartvelo"],
};

const GOAL_TO_MODEL: Record<MoveGoal, string> = {
  remote_work: "move_remote_work",
  study: "move_study",
  explore_first: "explore_first",
  find_job: "find_job_abroad",
  family: "move_family_partner",
  not_sure: "not_sure",
};

const INCOME_TO_MODEL: Record<IncomeRange, string> = {
  under_1000: "lt_1000",
  "1000_2000": "1000_2000",
  "2000_3000": "2000_3000",
  "3000_5000": "3000_5000",
  "5000_plus": "5000_plus",
};

const SAVINGS_TO_MODEL: Record<SavingsRange, string> = {
  under_3000: "lt_3000",
  "3000_7000": "3000_7000",
  "7000_15000": "7000_15000",
  "15000_30000": "15000_30000",
  "30000_plus": "30000_plus",
};

const INCOME_TYPE_TO_MODEL: Record<IncomeType, string> = {
  remote_employment: "remote_employment",
  freelance: "freelance_clients",
  business_owner: "business_owner",
  savings_only: "savings_only",
  student_family: "student_family_support",
  no_stable_income: "no_stable_income_yet",
};

const LIFE_PREFERENCE_TO_MODEL: Record<LifePreference, string> = {
  warm_climate: "warm_climate",
  lower_cost: "lower_cost",
  big_city: "big_city",
  sea_nearby: "sea_nearby",
  expat_community: "expat_community",
  english_friendly: "english_friendly",
  family_friendly: "family_friendly",
  career_opportunities: "career_opportunities",
  calm_lifestyle: "calm_lifestyle",
  student_life: "student_life",
  public_transport: "good_transport",
};

const WORRY_TO_MODEL: Record<MainFear, string> = {
  documents: "documents",
  money: "money",
  housing: "housing",
  language: "language",
  finding_work: "finding_work",
  being_alone: "being_alone",
  choosing_wrong_place: "choosing_wrong_place",
  legal_status: "documents",
};

const OPTIMIZATION_TO_MODEL: Record<MoveOptimization, string> = {
  fastest_legal_path: "fastest_legal_path",
  best_career: "best_career_upside",
  lowest_cost: "lowest_cost",
  comfortable_life: "most_comfortable_daily_life",
  best_study: "best_study_route",
  safest_longterm: "safest_long_term_option",
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ё/g, "е")
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCountry(value: string, allowed: string[], fallback: string) {
  const normalizedValue = normalizeText(value);
  if (!normalizedValue) return fallback;

  for (const country of allowed) {
    if (normalizeText(country) === normalizedValue) return country;

    const aliases = COUNTRY_ALIASES[country] ?? [];
    if (aliases.some((alias) => normalizeText(alias) === normalizedValue)) {
      return country;
    }
  }

  return fallback;
}

function mapRegions(regions: RegionPreference[]) {
  if (!regions.length || regions.includes("not_sure")) {
    return ["open_anything"];
  }

  return regions;
}

function clampScore(score: number) {
  return Math.min(99, Math.max(5, Math.round(score)));
}

function cityListModelScore(modelScore: number, heuristicScore: number) {
  return clampScore(modelScore * 0.75 + heuristicScore * 0.25);
}

function looksRussian(text?: string) {
  return Boolean(text && /[А-Яа-яЁё]/.test(text));
}

export function getAppCityIdForModelCityId(cityModelId: number) {
  return MODEL_CITY_ID_TO_APP_CITY_ID[cityModelId];
}

export function getModelCityIdForAppCityId(appCityId: string) {
  const entry = Object.entries(MODEL_CITY_ID_TO_APP_CITY_ID).find(
    ([, cityId]) => cityId === appCityId
  );

  return entry ? Number(entry[0]) : null;
}

export function buildCityModelProfile(input: CityModelInput): CityModelProfile {
  const currentCountry = input.currentCountry || input.residenceCountry;

  return {
    citizenship: normalizeCountry(
      input.citizenship,
      ["Russia", "Ukraine", "Germany", "Spain", "USA", "Turkey", "Kazakhstan"],
      "Other"
    ),
    current_country: normalizeCountry(
      currentCountry,
      ["Russia", "Spain", "Germany", "Turkey", "UAE", "Serbia", "Georgia"],
      "Other"
    ),
    preferred_language: input.language === "ru" ? "Russian" : "English",
    goal: input.moveGoal ? GOAL_TO_MODEL[input.moveGoal] : "not_sure",
    monthly_income: input.monthlyIncome ? INCOME_TO_MODEL[input.monthlyIncome] : "2000_3000",
    savings: input.savingsRange ? SAVINGS_TO_MODEL[input.savingsRange] : "7000_15000",
    income_type: input.incomeType ? INCOME_TYPE_TO_MODEL[input.incomeType] : "no_stable_income_yet",
    lifestyle_priorities: input.lifePreferences.map((preference) => LIFE_PREFERENCE_TO_MODEL[preference]),
    worries: input.mainFear ? [WORRY_TO_MODEL[input.mainFear]] : [],
    regions_open_to: mapRegions(input.regionPreferences),
    optimizing_for: input.moveOptimization
      ? OPTIMIZATION_TO_MODEL[input.moveOptimization]
      : "most_comfortable_daily_life",
    safety_importance: input.safetyImportance ?? "medium",
    cost_tolerance: input.costTolerance ?? "flexible",
    study_priority: input.studyPriority ?? "top_university",
  };
}

export function mergeCityModelResults(
  predictions: CityModelPrediction[],
  heuristicResults: CityMatchResult[]
): CityMatchResult[] {
  const heuristicByCityId = new Map(
    heuristicResults.map((result) => [result.cityId, result])
  );
  const seenCityIds = new Set<string>();
  const modelResults: CityMatchResult[] = [];

  for (const prediction of predictions) {
    const cityId = MODEL_CITY_ID_TO_APP_CITY_ID[prediction.city_model_id];
    const heuristic = cityId ? heuristicByCityId.get(cityId) : undefined;
    if (!heuristic || seenCityIds.has(cityId)) continue;

    modelResults.push({
      ...heuristic,
      score: cityListModelScore(prediction.score, heuristic.score),
    });
    seenCityIds.add(cityId);
  }

  if (modelResults.length === 0) {
    return heuristicResults;
  }

  const remainingHeuristicResults = heuristicResults.filter(
    (result) => !seenCityIds.has(result.cityId)
  );

  return [...modelResults, ...remainingHeuristicResults];
}

export function mergeCountryModelResults(
  predictions: CityModelPrediction[],
  heuristicResults: CountryMatchResult[]
): CountryMatchResult[] {
  const countrySignals = new Map<string, {
    cityId: string;
    cityName: string;
    rank: number;
    signal: number;
  }>();

  for (const prediction of predictions) {
    const cityId = getAppCityIdForModelCityId(prediction.city_model_id);
    const city = cityId ? getCityById(cityId) : undefined;
    if (!city) continue;

    const currentSignal = countrySignals.get(city.countryId);
    if (!currentSignal || prediction.rank < currentSignal.rank) {
      countrySignals.set(city.countryId, {
        cityId,
        cityName: city.name,
        rank: prediction.rank,
        signal: prediction.score,
      });
    }
  }

  if (countrySignals.size === 0) {
    return heuristicResults;
  }

  return heuristicResults
    .map((result) => {
      const modelSignal = countrySignals.get(result.countryId);
      if (!modelSignal) {
        return {
          ...result,
          score: clampScore(result.score * 0.75),
          overallFit: clampScore(result.overallFit * 0.75),
          lifestyleFit: clampScore(result.lifestyleFit * 0.75),
        };
      }

      const lifestyleFit = clampScore(result.lifestyleFit * 0.45 + modelSignal.signal * 0.55);
      const overallFit = clampScore(
        modelSignal.signal * 0.5 + result.legalFit * 0.3 + result.lifestyleFit * 0.2
      );
      const cityReason = looksRussian(result.reasons[0])
        ? `Лучшее совпадение по городам: ${modelSignal.cityName}`
        : `Top city match: ${modelSignal.cityName}`;

      return {
        ...result,
        score: overallFit,
        overallFit,
        lifestyleFit,
        reasons: [cityReason, ...result.reasons.filter((reason) => reason !== cityReason)].slice(0, 3),
        modelTopCityId: modelSignal.cityId,
        modelTopCityName: modelSignal.cityName,
        modelRank: modelSignal.rank,
      };
    })
    .sort((a, b) => b.overallFit - a.overallFit);
}
