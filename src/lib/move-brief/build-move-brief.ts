import type { UiLanguage } from "@/lib/i18n/onboarding";
import { resolveUiLanguage } from "@/lib/i18n/ui-language";
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
  getNotSetLabel,
} from "@/lib/profile/profile-labels";
import { generateRoadmap } from "@/lib/roadmap/roadmapGenerator";
import {
  buildCountryMatchInputFromMoveProfile,
  buildPathFinderAnswersFromMoveProfile,
} from "@/lib/scoring/move-profile-match";
import { matchCountries } from "@/lib/scoring/country-matcher";
import { scorePathsForCountry } from "@/lib/scoring/path-scorer";
import type { MoveProfile } from "@/types";

type FitTone = "strong" | "medium" | "weak";

const COPY = {
  en: {
    fitLabels: {
      strong: "Strong",
      medium: "Medium",
      weak: "Weak",
    } satisfies Record<FitTone, string>,
    headlineFallback: "Your move plan",
    notSelectedYet: "Not selected yet",
    profileSummaryLabels: {
      citizenship: "Citizenship",
      currentCountry: "Current country",
      preferredLanguage: "Preferred language",
      timeline: "Timeline",
      incomeRange: "Income range",
      savingsRange: "Savings range",
      incomeType: "Income type",
      movingWith: "Moving with",
      budgetRange: "Budget range",
      workStudyDetails: "Work/study details",
    },
    blockers: {
      verifiedGuidance:
        "Verified document guidance still needs partner review before any checklist can be trusted.",
      housing:
        "Housing may be difficult{city}, so expect extra search time and backup options.",
      incomeProof:
        "Income proof for this legal path should be reviewed carefully before you rely on it.",
      admission:
        "This path still needs a real study anchor or admission before it becomes practical.",
      sponsor:
        "A stronger employer or sponsor anchor may still be needed for this route.",
      bureaucracy:
        "Local bureaucracy may be slower than older guides or forum advice suggest.",
      timeline:
        "Your timeline may be tight, so sequencing and verification matter more than usual.",
      complexPath:
        "This legal path needs careful verification before you turn it into a document plan.",
      promisingPlan:
        "Your plan is promising, but the practical details still need careful verification.",
      arrivalFrictionPrefix:
        "Arrival friction may be higher than it first looks:",
      arrivalFrictionFallback:
        "Practical arrival friction can be higher than early research suggests.",
    },
  },
  ru: {
    fitLabels: {
      strong: "Сильное",
      medium: "Среднее",
      weak: "Слабое",
    } satisfies Record<FitTone, string>,
    headlineFallback: "План переезда",
    notSelectedYet: "Пока не выбрано",
    profileSummaryLabels: {
      citizenship: "Гражданство",
      currentCountry: "Текущая страна",
      preferredLanguage: "Язык интерфейса",
      timeline: "Сроки",
      incomeRange: "Доход",
      savingsRange: "Накопления",
      incomeType: "Тип дохода",
      movingWith: "С кем переезд",
      budgetRange: "Бюджет",
      workStudyDetails: "Работа и учёба",
    },
    blockers: {
      verifiedGuidance:
        "Проверенные рекомендации по документам всё ещё требуют partner review, прежде чем им можно было бы доверять как чеклисту.",
      housing:
        "С жильём{city} может быть сложно, поэтому закладывайте больше времени на поиск и запасные варианты.",
      incomeProof:
        "Подтверждение дохода для этого легального пути стоит внимательно проверить до того, как вы начнёте на него рассчитывать.",
      admission:
        "Для этого пути всё ещё нужен реальный учебный якорь или подтверждённое зачисление.",
      sponsor:
        "Для этого маршрута всё ещё может понадобиться более сильная опора в виде работодателя или спонсора.",
      bureaucracy:
        "Локальная бюрократия может идти медленнее, чем обещают старые гайды и форумы.",
      timeline:
        "Сроки могут быть сжатыми, поэтому порядок шагов и перепроверка здесь особенно важны.",
      complexPath:
        "Этот легальный путь требует аккуратной проверки, прежде чем превращать его в документный план.",
      promisingPlan:
        "План выглядит рабочим, но практические детали всё ещё нужно внимательно проверить.",
      arrivalFrictionPrefix:
        "Фрикции после переезда могут оказаться выше, чем кажется на старте:",
      arrivalFrictionFallback:
        "Практические сложности после переезда часто оказываются выше, чем кажется по первым ресёрчам.",
    },
  },
} satisfies Record<
  UiLanguage,
  {
    fitLabels: Record<FitTone, string>;
    headlineFallback: string;
    notSelectedYet: string;
    profileSummaryLabels: Record<string, string>;
    blockers: Record<string, string>;
  }
>;

export type MoveBriefFit = {
  label: string;
  tone: FitTone;
  score?: number;
};

export type MoveBriefData = {
  caseReference: string;
  preparedAt: string;
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

function formatPreparedAt(language: UiLanguage) {
  return new Intl.DateTimeFormat(language === "ru" ? "ru-RU" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function fitToneFromScore(score: number): FitTone {
  if (score >= 70) return "strong";
  if (score >= 50) return "medium";
  return "weak";
}

function buildFit(language: UiLanguage, score?: number): MoveBriefFit {
  const copy = COPY[language];

  if (typeof score === "number") {
    const tone = fitToneFromScore(score);
    return {
      score,
      tone,
      label: copy.fitLabels[tone],
    };
  }

  return {
    tone: "medium",
    label: copy.fitLabels.medium,
  };
}

function pushUnique(items: string[], value?: string | null) {
  if (!value) return;
  if (!items.includes(value)) {
    items.push(value);
  }
}

function withOptionalCity(template: string, cityName?: string) {
  return template.replace("{city}", cityName ? ` in ${cityName}` : "");
}

function withOptionalCityRu(template: string, cityName?: string) {
  return template.replace("{city}", cityName ? ` в ${cityName}` : "");
}

function buildBlockers(profile: MoveProfile, language: UiLanguage) {
  const copy = COPY[language].blockers;
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

  pushUnique(blockers, copy.verifiedGuidance);

  if (cityHousingDifficulty >= 4 || countryHousingDifficulty >= 4) {
    pushUnique(
      blockers,
      language === "ru"
        ? withOptionalCityRu(copy.housing, city?.name)
        : withOptionalCity(copy.housing, city?.name)
    );
  }

  if (legalPath?.requires_remote_income) {
    pushUnique(blockers, copy.incomeProof);
  }

  if (
    legalPath?.requires_admission &&
    profile.has_school_admission !== true &&
    profile.study_status_detail !== "admitted"
  ) {
    pushUnique(blockers, copy.admission);
  }

  if (
    (legalPath?.requires_local_employer || legalPath?.requires_sponsor) &&
    profile.has_job_offer !== true
  ) {
    pushUnique(blockers, copy.sponsor);
  }

  if (country?.bureaucracy_level && country.bureaucracy_level >= 4) {
    pushUnique(blockers, copy.bureaucracy);
  }

  if (
    profile.urgency_level === "within_3_months" ||
    profile.urgency_level === "within_6_months" ||
    profile.must_arrive_before
  ) {
    pushUnique(blockers, copy.timeline);
  }

  pushUnique(blockers, country?.main_legal_blocker);
  pushUnique(blockers, city?.main_lifestyle_blocker);

  if (blockers.length < 3) {
    pushUnique(
      blockers,
      legalPath?.complexity && legalPath.complexity >= 3
        ? copy.complexPath
        : copy.promisingPlan
    );
  }

  if (blockers.length < 3) {
    pushUnique(
      blockers,
      city?.what_people_underestimate
        ? `${copy.arrivalFrictionPrefix} ${city.what_people_underestimate}`
        : country?.what_people_underestimate
          ? `${copy.arrivalFrictionPrefix} ${country.what_people_underestimate}`
          : copy.arrivalFrictionFallback
    );
  }

  return blockers.slice(0, 5);
}

export function buildMoveBrief(
  profile: MoveProfile,
  language = resolveUiLanguage(profile.preferred_language)
): MoveBriefData {
  const copy = COPY[language];
  const notSet = getNotSetLabel(language);
  const roadmap = generateRoadmap(profile);
  const currentLevel =
    roadmap.levels.find((level) => level.id === roadmap.currentLevelId) ??
    roadmap.levels[0];
  const country = profile.selected_country_id
    ? getCountryById(profile.selected_country_id)
    : undefined;
  const city = profile.selected_city_id
    ? getCityById(profile.selected_city_id)
    : undefined;
  const legalPath = profile.selected_legal_path_id
    ? getLegalPathById(profile.selected_legal_path_id)
    : undefined;

  const countryMatchInput = buildCountryMatchInputFromMoveProfile(profile);
  const countryMatch = country
    ? matchCountries(countryMatchInput).find(
        (match) => match.countryId === country.id
      ) ?? null
    : null;
  const pathScore = country
    ? scorePathsForCountry(
        country.id,
        buildPathFinderAnswersFromMoveProfile(profile)
      ).find((result) => result.pathId === legalPath?.id) ?? null
    : null;

  const lifestyleScore = countryMatch?.lifestyleFit;
  const legalScore = pathScore?.score ?? countryMatch?.legalFit;
  const overallScore =
    typeof lifestyleScore === "number" && typeof legalScore === "number"
      ? Math.round(lifestyleScore * 0.6 + legalScore * 0.4)
      : countryMatch?.overallFit;

  return {
    caseReference: `SL-${profile.id.slice(0, 8).toUpperCase()}`,
    preparedAt: formatPreparedAt(language),
    headline:
      city && country
        ? `${city.name}, ${country.name}`
        : country?.name ?? copy.headlineFallback,
    destination: {
      country: country?.name ?? copy.notSelectedYet,
      city: city?.name ?? copy.notSelectedYet,
      legalPath: legalPath?.name ?? copy.notSelectedYet,
      moveGoal: formatMoveGoal(profile.move_goal, language),
      currentStage: currentLevel.title,
    },
    fit: {
      overall: buildFit(language, overallScore),
      lifestyle: buildFit(language, lifestyleScore),
      legal: buildFit(language, legalScore),
    },
    profileSummary: [
      {
        label: copy.profileSummaryLabels.citizenship,
        value: profile.citizenship ?? notSet,
      },
      {
        label: copy.profileSummaryLabels.currentCountry,
        value: profile.current_country ?? notSet,
      },
      {
        label: copy.profileSummaryLabels.preferredLanguage,
        value: formatPreferredLanguage(profile.preferred_language, language),
      },
      {
        label: copy.profileSummaryLabels.timeline,
        value: formatTimelineSummary(profile, language),
      },
      {
        label: copy.profileSummaryLabels.incomeRange,
        value: formatIncomeRange(profile.monthly_income_range, language),
      },
      {
        label: copy.profileSummaryLabels.savingsRange,
        value: formatSavingsRange(profile.savings_range, language),
      },
      {
        label: copy.profileSummaryLabels.incomeType,
        value: formatIncomeType(profile.income_type, language),
      },
      {
        label: copy.profileSummaryLabels.movingWith,
        value: formatMovingWith(profile.moving_with, language),
      },
      {
        label: copy.profileSummaryLabels.budgetRange,
        value: formatBudgetRange(
          profile.expected_monthly_budget_range,
          language
        ),
      },
      {
        label: copy.profileSummaryLabels.workStudyDetails,
        value: formatWorkStudySummary(profile, language),
      },
    ],
    blockers: buildBlockers(profile, language),
  };
}
