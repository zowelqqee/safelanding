import type { UiLanguage } from "@/lib/i18n/onboarding";
import { getIntlLanguageTag, resolveUiLanguage } from "@/lib/i18n/ui-language";
import type { MoveProfile } from "@/types";

const COPY = {
  en: {
    notSet: "Not set",
    mustArriveBefore: "Must arrive before",
    datesFlexible: "Dates are flexible",
    datesFixed: "Dates are fixed",
    work: "Work",
    study: "Study",
    jobOffer: "Job offer in place",
    schoolAdmission: "School admission in place",
  },
  ru: {
    notSet: "Не указано",
    mustArriveBefore: "Нужно приехать до",
    datesFlexible: "Даты гибкие",
    datesFixed: "Даты фиксированы",
    work: "Работа",
    study: "Учёба",
    jobOffer: "Оффер уже есть",
    schoolAdmission: "Зачисление уже есть",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

const MOVE_GOAL_LABELS = {
  en: {
    remote_work: "Remote work",
    study: "Study",
    explore_first: "Explore first, decide later",
    find_job: "Find a job abroad",
    family: "Move with family or partner",
    not_sure: "Not sure yet",
  },
  ru: {
    remote_work: "Удалённая работа",
    study: "Учёба",
    explore_first: "Сначала разведать, потом решить",
    find_job: "Найти работу за границей",
    family: "Переезд с семьёй или партнёром",
    not_sure: "Пока не уверен",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

const INCOME_RANGE_LABELS = {
  en: {
    under_1000: "< EUR 1,000 / month",
    "1000_2000": "EUR 1,000 to 2,000 / month",
    "2000_3000": "EUR 2,000 to 3,000 / month",
    "3000_5000": "EUR 3,000 to 5,000 / month",
    "5000_plus": "EUR 5,000+ / month",
  },
  ru: {
    under_1000: "< 1 000 EUR / мес",
    "1000_2000": "1 000-2 000 EUR / мес",
    "2000_3000": "2 000-3 000 EUR / мес",
    "3000_5000": "3 000-5 000 EUR / мес",
    "5000_plus": "5 000+ EUR / мес",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

const SAVINGS_RANGE_LABELS = {
  en: {
    under_3000: "< EUR 3,000",
    "3000_7000": "EUR 3,000 to 7,000",
    "7000_15000": "EUR 7,000 to 15,000",
    "15000_30000": "EUR 15,000 to 30,000",
    "30000_plus": "EUR 30,000+",
  },
  ru: {
    under_3000: "< 3 000 EUR",
    "3000_7000": "3 000-7 000 EUR",
    "7000_15000": "7 000-15 000 EUR",
    "15000_30000": "15 000-30 000 EUR",
    "30000_plus": "30 000+ EUR",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

const INCOME_TYPE_LABELS = {
  en: {
    remote_employment: "Remote employment",
    freelance: "Freelance or clients",
    business_owner: "Business owner",
    savings_only: "Savings only",
    student_family: "Student or family support",
    no_stable_income: "No stable income yet",
  },
  ru: {
    remote_employment: "Удалённая работа",
    freelance: "Фриланс или клиенты",
    business_owner: "Владелец бизнеса",
    savings_only: "Только накопления",
    student_family: "Студент или поддержка семьи",
    no_stable_income: "Пока нет стабильного дохода",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

const LANGUAGE_LABELS = {
  en: {
    en: "English",
    ru: "Russian",
  },
  ru: {
    en: "Английский",
    ru: "Русский",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

const URGENCY_LABELS = {
  en: {
    flexible: "Flexible",
    within_3_months: "Within 3 months",
    within_6_months: "Within 6 months",
    this_year: "This year",
    not_sure: "Not sure yet",
  },
  ru: {
    flexible: "Гибко",
    within_3_months: "В течение 3 месяцев",
    within_6_months: "В течение 6 месяцев",
    this_year: "В этом году",
    not_sure: "Пока не уверен",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

const MOVING_WITH_LABELS = {
  en: {
    alone: "Alone",
    partner: "Partner",
    family: "Family",
    children: "Children",
    not_sure: "Not sure yet",
  },
  ru: {
    alone: "Один",
    partner: "С партнёром",
    family: "С семьёй",
    children: "С детьми",
    not_sure: "Пока не уверен",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

const WORK_STATUS_LABELS = {
  en: {
    remote_employee: "Remote employee",
    freelancer: "Freelancer",
    founder: "Founder",
    job_seeker: "Job seeker",
    employed_local_offer: "Local job offer",
    not_working: "Not working",
    not_sure: "Not sure yet",
  },
  ru: {
    remote_employee: "Удалённый сотрудник",
    freelancer: "Фрилансер",
    founder: "Основатель",
    job_seeker: "Ищу работу",
    employed_local_offer: "Есть локальный оффер",
    not_working: "Не работаю",
    not_sure: "Пока не уверен",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

const STUDY_STATUS_LABELS = {
  en: {
    not_studying: "Not studying",
    applying_to_university: "Applying to university",
    admitted: "Already admitted",
    language_school: "Language school",
    short_course: "Short course",
    not_sure: "Not sure yet",
  },
  ru: {
    not_studying: "Не учусь",
    applying_to_university: "Подаюсь в университет",
    admitted: "Уже зачислен",
    language_school: "Языковая школа",
    short_course: "Короткий курс",
    not_sure: "Пока не уверен",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

const BUDGET_RANGE_LABELS = {
  en: {
    under_1500: "Under 1,500 / month",
    "1500_2500": "1,500 to 2,500 / month",
    "2500_4000": "2,500 to 4,000 / month",
    "4000_6000": "4,000 to 6,000 / month",
    "6000_plus": "6,000+ / month",
  },
  ru: {
    under_1500: "До 1 500 / мес",
    "1500_2500": "1 500-2 500 / мес",
    "2500_4000": "2 500-4 000 / мес",
    "4000_6000": "4 000-6 000 / мес",
    "6000_plus": "6 000+ / мес",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

function toTitleCase(value: string) {
  return value
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatMappedValue(
  value: string | null | undefined,
  map: Record<UiLanguage, Record<string, string>>,
  language: UiLanguage,
  fallback = COPY[language].notSet
) {
  if (!value) return fallback;
  return map[language][value] ?? toTitleCase(value);
}

export function getNotSetLabel(language: UiLanguage = "en") {
  return COPY[language].notSet;
}

export function formatMoveGoal(
  value: string | null | undefined,
  language: UiLanguage = "en"
) {
  return formatMappedValue(value, MOVE_GOAL_LABELS, language);
}

export function formatIncomeRange(
  value: string | null | undefined,
  language: UiLanguage = "en"
) {
  return formatMappedValue(value, INCOME_RANGE_LABELS, language);
}

export function formatSavingsRange(
  value: string | null | undefined,
  language: UiLanguage = "en"
) {
  return formatMappedValue(value, SAVINGS_RANGE_LABELS, language);
}

export function formatIncomeType(
  value: string | null | undefined,
  language: UiLanguage = "en"
) {
  return formatMappedValue(value, INCOME_TYPE_LABELS, language);
}

export function formatPreferredLanguage(
  value: string | null | undefined,
  language: UiLanguage = "en"
) {
  return formatMappedValue(value, LANGUAGE_LABELS, language);
}

export function formatUrgencyLevel(
  value: string | null | undefined,
  language: UiLanguage = "en"
) {
  return formatMappedValue(value, URGENCY_LABELS, language);
}

export function formatMovingWith(
  value: string | null | undefined,
  language: UiLanguage = "en"
) {
  return formatMappedValue(value, MOVING_WITH_LABELS, language);
}

export function formatWorkStatus(
  value: string | null | undefined,
  language: UiLanguage = "en"
) {
  return formatMappedValue(value, WORK_STATUS_LABELS, language);
}

export function formatStudyStatus(
  value: string | null | undefined,
  language: UiLanguage = "en"
) {
  return formatMappedValue(value, STUDY_STATUS_LABELS, language);
}

export function formatBudgetRange(
  value: string | null | undefined,
  language: UiLanguage = "en"
) {
  return formatMappedValue(value, BUDGET_RANGE_LABELS, language);
}

export function formatMonthValue(
  value: string | null | undefined,
  language: UiLanguage = "en"
) {
  if (!value) return COPY[language].notSet;
  const date = new Date(`${value}-01T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(getIntlLanguageTag(language), {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateValue(
  value: string | null | undefined,
  language: UiLanguage = "en"
) {
  if (!value) return COPY[language].notSet;
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(getIntlLanguageTag(language), {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatTimelineSummary(
  profile: MoveProfile,
  language: UiLanguage = "en"
) {
  const copy = COPY[language];
  const parts: string[] = [];

  if (profile.target_move_month) {
    parts.push(formatMonthValue(profile.target_move_month, language));
  }

  if (profile.urgency_level) {
    parts.push(formatUrgencyLevel(profile.urgency_level, language));
  }

  if (profile.must_arrive_before) {
    parts.push(
      `${copy.mustArriveBefore} ${formatDateValue(profile.must_arrive_before, language)}`
    );
  }

  if (profile.flexible_dates === true) {
    parts.push(copy.datesFlexible);
  } else if (profile.flexible_dates === false) {
    parts.push(copy.datesFixed);
  }

  return parts.length > 0 ? parts.join(" · ") : copy.notSet;
}

export function formatWorkStudySummary(
  profile: MoveProfile,
  language: UiLanguage = "en"
) {
  const copy = COPY[language];
  const parts: string[] = [];

  if (profile.work_status_detail) {
    parts.push(`${copy.work}: ${formatWorkStatus(profile.work_status_detail, language)}`);
  }

  if (profile.study_status_detail) {
    parts.push(
      `${copy.study}: ${formatStudyStatus(profile.study_status_detail, language)}`
    );
  }

  if (profile.has_job_offer === true) {
    parts.push(copy.jobOffer);
  }

  if (profile.has_school_admission === true) {
    parts.push(copy.schoolAdmission);
  }

  if (profile.employer_or_school_name) {
    parts.push(profile.employer_or_school_name);
  }

  return parts.length > 0 ? parts.join(" · ") : copy.notSet;
}

export function getProfileLanguage(profile: Pick<MoveProfile, "preferred_language"> | null) {
  return resolveUiLanguage(profile?.preferred_language);
}
