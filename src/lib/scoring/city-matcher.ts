import type {
  CityProfile,
  CityMatchResult,
  LifePreference,
  MoveGoal,
  IncomeRange,
} from "@/types";
import { getCitiesForCountry } from "@/lib/data/cities";

type MatchInput = {
  countryId: string;
  lifePreferences: LifePreference[];
  moveGoal: MoveGoal | "";
  monthlyIncome: IncomeRange | "";
};

const PREFERENCE_WEIGHTS: Record<LifePreference, (city: CityProfile) => number> = {
  warm_climate: (c) => c.climate_score * 4,
  lower_cost: (c) => (6 - c.cost_level) * 5,
  big_city: (c) => (c.bigCity ? 20 : 0),
  sea_nearby: (c) => (c.coastal ? 20 : 0),
  expat_community: (c) => c.expat_community * 4,
  english_friendly: (c) => c.english_friendliness * 4,
  family_friendly: (c) => c.family_fit * 4,
  career_opportunities: (c) => c.career_opportunities * 4,
  calm_lifestyle: (c) => c.calmLifestyle * 4,
  student_life: (c) => c.student_fit * 4,
  public_transport: (c) => c.public_transport * 3,
};

function goalBonus(city: CityProfile, goal: MoveGoal | ""): number {
  switch (goal) {
    case "remote_work": return city.remote_worker_fit * 5;
    case "study": return city.student_fit * 5;
    case "explore_first": return city.expat_community * 3 + city.english_friendliness * 2;
    case "family": return city.family_fit * 5;
    case "find_job": return city.career_opportunities * 5;
    default: return 0;
  }
}

function incomeBonus(city: CityProfile, income: IncomeRange | ""): number {
  if (income === "under_1000" || income === "1000_2000") {
    return (6 - city.cost_level) * 4;
  }
  return 0;
}

function buildReasons(
  city: CityProfile,
  preferences: LifePreference[],
  goal: MoveGoal | ""
): string[] {
  const reasons: string[] = [];

  if (preferences.includes("warm_climate") && city.climate_score >= 4)
    reasons.push("Warm climate");
  if (preferences.includes("lower_cost") && city.cost_level <= 3)
    reasons.push("Relatively affordable");
  if (preferences.includes("sea_nearby") && city.coastal)
    reasons.push("Coastal city");
  if (preferences.includes("expat_community") && city.expat_community >= 4)
    reasons.push("Strong expat community");
  if (preferences.includes("english_friendly") && city.english_friendliness >= 4)
    reasons.push("English-friendly");
  if (preferences.includes("calm_lifestyle") && city.calmLifestyle >= 4)
    reasons.push("Relaxed pace of life");
  if (preferences.includes("public_transport") && city.public_transport >= 4)
    reasons.push("Reliable public transport");
  if (preferences.includes("career_opportunities") && city.career_opportunities >= 4)
    reasons.push("Strong job market");
  if (preferences.includes("student_life") && city.student_fit >= 4)
    reasons.push("Good student infrastructure");
  if (preferences.includes("family_friendly") && city.family_fit >= 4)
    reasons.push("Family-friendly");
  if (goal === "remote_work" && city.remote_worker_fit >= 4)
    reasons.push("Popular with remote workers");
  if (goal === "study" && city.student_fit >= 4)
    reasons.push("Good universities and student scene");

  return reasons.slice(0, 3);
}

export function matchCitiesForCountry(input: MatchInput): CityMatchResult[] {
  const cities = getCitiesForCountry(input.countryId);

  return cities
    .map((city) => {
      let rawScore = 0;
      const maxPossible = input.lifePreferences.length * 20 + 25 + 20;

      for (const pref of input.lifePreferences) {
        rawScore += PREFERENCE_WEIGHTS[pref](city);
      }
      rawScore += goalBonus(city, input.moveGoal);
      rawScore += incomeBonus(city, input.monthlyIncome);

      const baseline = 40;
      const score = Math.min(
        99,
        Math.round(baseline + (rawScore / Math.max(maxPossible, 1)) * (100 - baseline))
      );

      return {
        cityId: city.id,
        score,
        reasons: buildReasons(city, input.lifePreferences, input.moveGoal),
        risks: city.watch_out.slice(0, 2),
        mainBlocker: city.main_lifestyle_blocker,
        first90DaysDifficulty: city.first_90_days_difficulty,
      };
    })
    .sort((a, b) => b.score - a.score);
}
