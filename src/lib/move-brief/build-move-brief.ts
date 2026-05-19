import { getCityById } from "@/lib/data/cities";
import { getCountryById } from "@/lib/data/countries";
import { getLegalPathById } from "@/lib/data/legal-paths";
import {
  formatBudgetRange,
  formatIncomeRange,
  formatIncomeType,
  formatMoveGoal,
  formatMovingWith,
  formatPreferredLanguage,
  formatSavingsRange,
  formatTimelineSummary,
  formatWorkStudySummary,
} from "@/lib/profile/profile-labels";
import { generateRoadmap } from "@/lib/roadmap/roadmapGenerator";
import { buildCountryMatchInputFromMoveProfile, buildPathFinderAnswersFromMoveProfile } from "@/lib/scoring/move-profile-match";
import { matchCountries } from "@/lib/scoring/country-matcher";
import { scorePathsForCountry } from "@/lib/scoring/path-scorer";
import type { MoveProfile } from "@/types";

export type MoveBriefFit = {
  label: "Strong" | "Medium" | "Weak";
  score?: number;
};

export type MoveBriefData = {
  headline: string;
  destination: {
    country: string;
    city: string;
    legalPath: string;
    moveGoal: string;
    currentStage: string;
  };
  fit: {
    overall: MoveBriefFit;
    lifestyle: MoveBriefFit;
    legal: MoveBriefFit;
  };
  profileSummary: Array<{ label: string; value: string }>;
  blockers: string[];
};

function fitLabelFromScore(score: number): MoveBriefFit["label"] {
  if (score >= 70) return "Strong";
  if (score >= 50) return "Medium";
  return "Weak";
}

function buildFit(score?: number): MoveBriefFit {
  if (typeof score === "number") {
    return {
      score,
      label: fitLabelFromScore(score),
    };
  }

  return {
    label: "Medium",
  };
}

function pushUnique(items: string[], value?: string | null) {
  if (!value) return;
  if (!items.includes(value)) {
    items.push(value);
  }
}

function buildBlockers(profile: MoveProfile) {
  const country = profile.selected_country_id
    ? getCountryById(profile.selected_country_id)
    : undefined;
  const city = profile.selected_city_id
    ? getCityById(profile.selected_city_id)
    : undefined;
  const legalPath = profile.selected_legal_path_id
    ? getLegalPathById(profile.selected_legal_path_id)
    : undefined;
  const cityHousingDifficulty = city?.housingDifficulty ?? 0;
  const countryHousingDifficulty = country?.housingDifficulty ?? 0;

  const blockers: string[] = [];

  pushUnique(
    blockers,
    "Verified document guidance still needs partner review before any checklist can be trusted."
  );

  if (cityHousingDifficulty >= 4 || countryHousingDifficulty >= 4) {
    pushUnique(
      blockers,
      `Housing may be difficult${city ? ` in ${city.name}` : ""}, so expect extra search time and backup options.`
    );
  }

  if (legalPath?.requires_remote_income) {
    pushUnique(
      blockers,
      "Income proof for this legal path should be reviewed carefully before you rely on it."
    );
  }

  if (
    legalPath?.requires_admission &&
    profile.has_school_admission !== true &&
    profile.study_status_detail !== "admitted"
  ) {
    pushUnique(
      blockers,
      "This path still needs a real study anchor or admission before it becomes practical."
    );
  }

  if (
    (legalPath?.requires_local_employer || legalPath?.requires_sponsor) &&
    profile.has_job_offer !== true
  ) {
    pushUnique(
      blockers,
      "A stronger employer or sponsor anchor may still be needed for this route."
    );
  }

  if (country?.bureaucracy_level && country.bureaucracy_level >= 4) {
    pushUnique(
      blockers,
      "Local bureaucracy may be slower than older guides or forum advice suggest."
    );
  }

  if (
    profile.urgency_level === "within_3_months" ||
    profile.urgency_level === "within_6_months" ||
    profile.must_arrive_before
  ) {
    pushUnique(
      blockers,
      "Your timeline may be tight, so sequencing and verification matter more than usual."
    );
  }

  pushUnique(blockers, country?.main_legal_blocker);
  pushUnique(blockers, city?.main_lifestyle_blocker);

  if (blockers.length < 3) {
    pushUnique(
      blockers,
      legalPath?.complexity && legalPath.complexity >= 3
        ? "This legal path needs careful verification before you turn it into a document plan."
        : "Your plan is promising, but the practical details still need careful verification."
    );
  }

  if (blockers.length < 3) {
    pushUnique(
      blockers,
      city?.what_people_underestimate
        ? `Arrival friction may be higher than it first looks: ${city.what_people_underestimate}`
        : country?.what_people_underestimate
          ? `Arrival friction may be higher than it first looks: ${country.what_people_underestimate}`
          : "Practical arrival friction can be higher than early research suggests."
    );
  }

  return blockers.slice(0, 5);
}

export function buildMoveBrief(profile: MoveProfile): MoveBriefData {
  const roadmap = generateRoadmap(profile);
  const currentLevel =
    roadmap.levels.find((level) => level.id === roadmap.currentLevelId) ?? roadmap.levels[0];
  const country = profile.selected_country_id
    ? getCountryById(profile.selected_country_id)
    : undefined;
  const city = profile.selected_city_id ? getCityById(profile.selected_city_id) : undefined;
  const legalPath = profile.selected_legal_path_id
    ? getLegalPathById(profile.selected_legal_path_id)
    : undefined;

  const countryMatchInput = buildCountryMatchInputFromMoveProfile(profile);
  const countryMatch = country
    ? matchCountries(countryMatchInput).find((match) => match.countryId === country.id) ?? null
    : null;
  const pathScore = country
    ? scorePathsForCountry(country.id, buildPathFinderAnswersFromMoveProfile(profile)).find(
        (result) => result.pathId === legalPath?.id
      ) ?? null
    : null;

  const lifestyleScore = countryMatch?.lifestyleFit;
  const legalScore = pathScore?.score ?? countryMatch?.legalFit;
  const overallScore =
    typeof lifestyleScore === "number" && typeof legalScore === "number"
      ? Math.round(lifestyleScore * 0.6 + legalScore * 0.4)
      : countryMatch?.overallFit;

  return {
    headline: city && country ? `${city.name}, ${country.name}` : country?.name ?? "Your move plan",
    destination: {
      country: country?.name ?? "Not selected yet",
      city: city?.name ?? "Not selected yet",
      legalPath: legalPath?.name ?? "Not selected yet",
      moveGoal: formatMoveGoal(profile.move_goal),
      currentStage: currentLevel.title,
    },
    fit: {
      overall: buildFit(overallScore),
      lifestyle: buildFit(lifestyleScore),
      legal: buildFit(legalScore),
    },
    profileSummary: [
      { label: "Citizenship", value: profile.citizenship ?? "Not set" },
      { label: "Current country", value: profile.current_country ?? "Not set" },
      { label: "Preferred language", value: formatPreferredLanguage(profile.preferred_language) },
      { label: "Timeline", value: formatTimelineSummary(profile) },
      { label: "Income range", value: formatIncomeRange(profile.monthly_income_range) },
      { label: "Savings range", value: formatSavingsRange(profile.savings_range) },
      { label: "Income type", value: formatIncomeType(profile.income_type) },
      { label: "Moving with", value: formatMovingWith(profile.moving_with) },
      {
        label: "Budget range",
        value: formatBudgetRange(profile.expected_monthly_budget_range),
      },
      { label: "Work/study details", value: formatWorkStudySummary(profile) },
    ],
    blockers: buildBlockers(profile),
  };
}
