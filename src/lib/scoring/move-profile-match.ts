import type {
  CountryMatchInput,
} from "@/lib/scoring/country-matcher";
import type {
  IncomeRange,
  LifePreference,
  MoveGoal,
  MoveOptimization,
  MainFear,
  PathFinderAnswers,
  MoveProfile,
  RegionPreference,
} from "@/types";

function isMoveGoal(value: string | null): value is MoveGoal {
  return value === "remote_work" ||
    value === "study" ||
    value === "explore_first" ||
    value === "find_job" ||
    value === "family" ||
    value === "not_sure";
}

function isIncomeRange(value: string | null): value is IncomeRange {
  return value === "under_1000" ||
    value === "1000_2000" ||
    value === "2000_3000" ||
    value === "3000_5000" ||
    value === "5000_plus";
}

function isRegionPreference(value: string): value is RegionPreference {
  return value === "europe" ||
    value === "north_america" ||
    value === "asia" ||
    value === "middle_east" ||
    value === "latin_america" ||
    value === "not_sure";
}

function isMoveOptimization(value: string | null): value is MoveOptimization {
  return value === "fastest_legal_path" ||
    value === "best_career" ||
    value === "lowest_cost" ||
    value === "comfortable_life" ||
    value === "best_study" ||
    value === "safest_longterm";
}

function isMainFear(value: string | undefined): value is MainFear {
  return value === "documents" ||
    value === "money" ||
    value === "housing" ||
    value === "language" ||
    value === "finding_work" ||
    value === "being_alone" ||
    value === "choosing_wrong_place" ||
    value === "legal_status";
}

export function buildCountryMatchInputFromMoveProfile(
  profile: MoveProfile
): CountryMatchInput {
  const lifePreferences = profile.life_preferences.filter(Boolean) as LifePreference[];
  const regionPreferences = profile.open_regions.filter(isRegionPreference);
  const mainFear = profile.worries.find(isMainFear) ?? "";

  return {
    language: profile.preferred_language === "ru" ? "ru" : "en",
    citizenship: profile.citizenship ?? "",
    currentCountry: profile.current_country ?? "",
    residenceCountry: profile.residence_country ?? "",
    lifePreferences,
    moveGoal: isMoveGoal(profile.move_goal) ? profile.move_goal : "",
    monthlyIncome: isIncomeRange(profile.monthly_income_range)
      ? profile.monthly_income_range
      : "",
    savingsRange: profile.savings_range as CountryMatchInput["savingsRange"],
    incomeType: profile.income_type as CountryMatchInput["incomeType"],
    mainFear,
    regionPreferences,
    moveOptimization: isMoveOptimization(profile.optimization_goal)
      ? profile.optimization_goal
      : "",
    pathAnswers: buildPathFinderAnswersFromMoveProfile(profile),
  };
}

export function buildPathFinderAnswersFromMoveProfile(
  profile: MoveProfile
): PathFinderAnswers {
  const workStatus = profile.work_status_detail;

  return {
    monthlyIncome: isIncomeRange(profile.monthly_income_range)
      ? profile.monthly_income_range
      : "",
    hasSavings: Boolean(profile.savings_range && profile.savings_range !== "under_3000"),
    worksRemotely:
      workStatus === "remote_employee" ||
      workStatus === "freelancer" ||
      workStatus === "founder",
    foreignIncome:
      workStatus === "remote_employee" ||
      workStatus === "freelancer" ||
      workStatus === "founder",
    readyToStudy:
      profile.study_status_detail === "applying_to_university" ||
      profile.study_status_detail === "admitted" ||
      profile.study_status_detail === "language_school" ||
      profile.study_status_detail === "short_course",
    hasAdmission:
      profile.study_status_detail === "admitted" ||
      profile.has_school_admission === true,
    hasSchoolAdmission: profile.has_school_admission,
    hasJobOffer:
      profile.has_job_offer === true ||
      workStatus === "employed_local_offer",
    hasExtraordinaryProfile: null,
    hasCapital: workStatus === "founder" ? true : null,
    moveSoon:
      profile.urgency_level === "within_3_months" ||
      profile.urgency_level === "within_6_months"
        ? true
        : profile.urgency_level === "flexible" || profile.urgency_level === "not_sure"
          ? false
          : null,
    movingWithFamily:
      profile.moving_with === "family" || profile.moving_with === "children",
  };
}
