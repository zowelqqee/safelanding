import type {
  CountryProfile,
  CountryMatchResult,
  LifePreference,
  MoveGoal,
  IncomeRange,
  PathFinderAnswers,
  RegionPreference,
  MoveOptimization,
} from "@/types";
import { COUNTRIES } from "@/lib/data/countries";
import { getLegalPathById } from "@/lib/data/legal-paths";
import { scorePathsForCountry } from "./path-scorer";

const CONTINENT_BY_REGION: Record<RegionPreference, string[]> = {
  europe: ["Europe"],
  north_america: ["North America"],
  asia: ["Asia"],
  middle_east: ["Middle East"],
  latin_america: ["Latin America"],
  not_sure: [],
};

export type CountryMatchInput = {
  lifePreferences: LifePreference[];
  moveGoal: MoveGoal | "";
  monthlyIncome: IncomeRange | "";
  regionPreferences?: RegionPreference[];
  moveOptimization?: MoveOptimization | "";
  pathAnswers?: Partial<PathFinderAnswers>;
};

const PREFERENCE_WEIGHTS: Record<LifePreference, (c: CountryProfile) => number> = {
  warm_climate: (c) => c.climate_score * 5,
  lower_cost: (c) => (6 - c.cost_level) * 5,
  big_city: (c) => c.career_opportunities * 2,
  sea_nearby: (c) => (c.coastal ? 18 : 0),
  expat_community: (c) => c.expat_community * 4,
  english_friendly: (c) => c.english_friendliness * 5,
  family_friendly: (c) => c.family_fit * 4,
  career_opportunities: (c) => c.career_opportunities * 5,
  calm_lifestyle: (c) => c.calm_lifestyle * 4,
  student_life: (c) => c.study_fit * 4,
  public_transport: (c) => c.public_transport * 3,
};

function clamp(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function goalBonus(country: CountryProfile, goal: MoveGoal | ""): number {
  switch (goal) {
    case "remote_work":
      return country.remote_work_fit * 6;
    case "study":
      return country.study_fit * 6;
    case "explore_first":
      return country.english_friendliness * 3 + country.expat_community * 2;
    case "family":
      return country.family_fit * 6;
    case "find_job":
      return country.career_opportunities * 6;
    case "not_sure":
      return country.expat_community * 3;
    default:
      return 0;
  }
}

function incomeBonus(country: CountryProfile, income: IncomeRange | ""): number {
  if (income === "under_1000" || income === "1000_2000") {
    return (6 - country.cost_level) * 5;
  }

  if (income === "5000_plus") {
    return country.career_opportunities * 2;
  }

  return 0;
}

function optimizationBonus(country: CountryProfile, opt: MoveOptimization | ""): number {
  switch (opt) {
    case "fastest_legal_path":
      return (6 - country.bureaucracy_level) * 5 + (6 - country.housing_difficulty) * 2;
    case "best_career":
      return country.career_opportunities * 8;
    case "lowest_cost":
      return (6 - country.cost_level) * 8;
    case "comfortable_life":
      return country.calm_lifestyle * 5 + country.expat_community * 3;
    case "best_study":
      return country.study_fit * 8;
    case "safest_longterm":
      return country.long_term_stability * 6 + country.family_fit * 3;
    default:
      return 0;
  }
}

function regionPenalty(country: CountryProfile, regions: RegionPreference[]) {
  if (!regions.length || regions.includes("not_sure")) return 0;
  const allowedRegions = regions.flatMap((region) => CONTINENT_BY_REGION[region]);
  return allowedRegions.includes(country.region) ? 0 : -40;
}

function buildPathAnswers(input: CountryMatchInput): PathFinderAnswers {
  return {
    worksRemotely:
      input.pathAnswers?.worksRemotely ??
      (input.moveGoal === "remote_work" ? true : input.moveGoal === "study" ? false : null),
    foreignIncome:
      input.pathAnswers?.foreignIncome ??
      (input.moveGoal === "remote_work" ? true : null),
    monthlyIncome: input.monthlyIncome,
    hasSavings: input.pathAnswers?.hasSavings ?? null,
    readyToStudy:
      input.pathAnswers?.readyToStudy ?? (input.moveGoal === "study" ? true : null),
    hasAdmission: input.pathAnswers?.hasAdmission ?? null,
    hasJobOffer: input.pathAnswers?.hasJobOffer ?? null,
    hasSchoolAdmission: input.pathAnswers?.hasSchoolAdmission ?? null,
    hasExtraordinaryProfile: input.pathAnswers?.hasExtraordinaryProfile ?? null,
    hasCapital: input.pathAnswers?.hasCapital ?? null,
    moveSoon: input.pathAnswers?.moveSoon ?? (input.moveGoal === "explore_first" ? false : null),
    movingWithFamily:
      input.pathAnswers?.movingWithFamily ?? (input.moveGoal === "family" ? true : null),
  };
}

function buildReasons(
  country: CountryProfile,
  preferences: LifePreference[],
  goal: MoveGoal | "",
  opt: MoveOptimization | "",
  legalFit: number,
  topPathName?: string
): string[] {
  const reasons: string[] = [];

  if (preferences.includes("warm_climate") && country.climate_score >= 4) {
    reasons.push("Warm climate matches your preference");
  }
  if (preferences.includes("lower_cost") && country.cost_level <= 3) {
    reasons.push("Costs are more manageable than many peer destinations");
  }
  if (preferences.includes("sea_nearby") && country.coastal) {
    reasons.push("Coastal access is part of daily life");
  }
  if (preferences.includes("english_friendly") && country.english_friendliness >= 4) {
    reasons.push("Daily life is relatively English-friendly");
  }
  if (preferences.includes("career_opportunities") && country.career_opportunities >= 4) {
    reasons.push("Career upside is genuinely strong");
  }
  if (goal === "remote_work" && country.remote_work_fit >= 4) {
    reasons.push("The lifestyle side works well for remote workers");
  }
  if (goal === "study" && country.study_fit >= 4) {
    reasons.push("Study infrastructure is a real strength here");
  }
  if (opt === "safest_longterm" && country.long_term_stability >= 4) {
    reasons.push("Long-term stability matches your priority");
  }
  if (legalFit >= 65 && topPathName) {
    reasons.push(`${topPathName} looks more plausible than the average route here`);
  }

  return reasons.slice(0, 3);
}

export function matchCountries(input: CountryMatchInput): CountryMatchResult[] {
  const regions = input.regionPreferences ?? [];
  const opt = input.moveOptimization ?? "";
  const pathAnswers = buildPathAnswers(input);

  return COUNTRIES.map((country) => {
    let rawLifestyleScore = 0;
    const maxPossible = input.lifePreferences.length * 25 + 30 + 25 + 40;

    for (const preference of input.lifePreferences) {
      rawLifestyleScore += PREFERENCE_WEIGHTS[preference](country);
    }

    rawLifestyleScore += goalBonus(country, input.moveGoal);
    rawLifestyleScore += incomeBonus(country, input.monthlyIncome);
    rawLifestyleScore += optimizationBonus(country, opt);
    rawLifestyleScore += regionPenalty(country, regions);

    const lifestyleFit = clamp(
      5,
      Math.round(40 + (rawLifestyleScore / Math.max(maxPossible, 1)) * 55),
      99
    );

    const pathScores = scorePathsForCountry(country.id, pathAnswers);
    const topNonExploration = pathScores.find((result) => {
      const path = getLegalPathById(result.pathId);
      return path?.scenario !== "exploration";
    });
    const topExploration = pathScores.find((result) => {
      const path = getLegalPathById(result.pathId);
      return path?.scenario === "exploration";
    });
    const legalFit = topNonExploration
      ? clamp(10, Math.round(topNonExploration.score * 0.95), 95)
      : clamp(10, Math.min(topExploration?.score ?? 25, 35), 95);

    const overallFit = clamp(
      5,
      Math.round(lifestyleFit * 0.6 + legalFit * 0.4),
      99
    );
    const topPathName = topNonExploration
      ? getLegalPathById(topNonExploration.pathId)?.name
      : undefined;
    const mainBlocker =
      legalFit < 55 || legalFit < lifestyleFit - 12
        ? country.main_legal_blocker
        : country.main_lifestyle_blocker;

    return {
      countryId: country.id,
      score: overallFit,
      overallFit,
      lifestyleFit,
      legalFit,
      mainBlocker,
      reasons: buildReasons(country, input.lifePreferences, input.moveGoal, opt, legalFit, topPathName),
      challenges: [mainBlocker],
      topPathId: topNonExploration?.pathId,
    };
  }).sort((a, b) => b.overallFit - a.overallFit);
}
