import type { MoveProfile } from "@/types";

const MOVE_GOAL_LABELS: Record<string, string> = {
  remote_work: "Remote work",
  study: "Study",
  explore_first: "Explore first, decide later",
  find_job: "Find a job abroad",
  family: "Move with family or partner",
  not_sure: "Not sure yet",
};

const INCOME_RANGE_LABELS: Record<string, string> = {
  under_1000: "< EUR 1,000 / month",
  "1000_2000": "EUR 1,000 to 2,000 / month",
  "2000_3000": "EUR 2,000 to 3,000 / month",
  "3000_5000": "EUR 3,000 to 5,000 / month",
  "5000_plus": "EUR 5,000+ / month",
};

const SAVINGS_RANGE_LABELS: Record<string, string> = {
  under_3000: "< EUR 3,000",
  "3000_7000": "EUR 3,000 to 7,000",
  "7000_15000": "EUR 7,000 to 15,000",
  "15000_30000": "EUR 15,000 to 30,000",
  "30000_plus": "EUR 30,000+",
};

const INCOME_TYPE_LABELS: Record<string, string> = {
  remote_employment: "Remote employment",
  freelance: "Freelance or clients",
  business_owner: "Business owner",
  savings_only: "Savings only",
  student_family: "Student or family support",
  no_stable_income: "No stable income yet",
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  ru: "Russian",
};

const URGENCY_LABELS: Record<string, string> = {
  flexible: "Flexible",
  within_3_months: "Within 3 months",
  within_6_months: "Within 6 months",
  this_year: "This year",
  not_sure: "Not sure yet",
};

const MOVING_WITH_LABELS: Record<string, string> = {
  alone: "Alone",
  partner: "Partner",
  family: "Family",
  children: "Children",
  not_sure: "Not sure yet",
};

const WORK_STATUS_LABELS: Record<string, string> = {
  remote_employee: "Remote employee",
  freelancer: "Freelancer",
  founder: "Founder",
  job_seeker: "Job seeker",
  employed_local_offer: "Local job offer",
  not_working: "Not working",
  not_sure: "Not sure yet",
};

const STUDY_STATUS_LABELS: Record<string, string> = {
  not_studying: "Not studying",
  applying_to_university: "Applying to university",
  admitted: "Already admitted",
  language_school: "Language school",
  short_course: "Short course",
  not_sure: "Not sure yet",
};

const BUDGET_RANGE_LABELS: Record<string, string> = {
  under_1500: "Under 1,500 / month",
  "1500_2500": "1,500 to 2,500 / month",
  "2500_4000": "2,500 to 4,000 / month",
  "4000_6000": "4,000 to 6,000 / month",
  "6000_plus": "6,000+ / month",
};

function toTitleCase(value: string) {
  return value
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatMappedValue(
  value: string | null | undefined,
  map: Record<string, string>,
  fallback = "Not set"
) {
  if (!value) return fallback;
  return map[value] ?? toTitleCase(value);
}

export function formatMoveGoal(value: string | null | undefined) {
  return formatMappedValue(value, MOVE_GOAL_LABELS);
}

export function formatIncomeRange(value: string | null | undefined) {
  return formatMappedValue(value, INCOME_RANGE_LABELS);
}

export function formatSavingsRange(value: string | null | undefined) {
  return formatMappedValue(value, SAVINGS_RANGE_LABELS);
}

export function formatIncomeType(value: string | null | undefined) {
  return formatMappedValue(value, INCOME_TYPE_LABELS);
}

export function formatPreferredLanguage(value: string | null | undefined) {
  return formatMappedValue(value, LANGUAGE_LABELS);
}

export function formatUrgencyLevel(value: string | null | undefined) {
  return formatMappedValue(value, URGENCY_LABELS);
}

export function formatMovingWith(value: string | null | undefined) {
  return formatMappedValue(value, MOVING_WITH_LABELS);
}

export function formatWorkStatus(value: string | null | undefined) {
  return formatMappedValue(value, WORK_STATUS_LABELS);
}

export function formatStudyStatus(value: string | null | undefined) {
  return formatMappedValue(value, STUDY_STATUS_LABELS);
}

export function formatBudgetRange(value: string | null | undefined) {
  return formatMappedValue(value, BUDGET_RANGE_LABELS);
}

export function formatMonthValue(value: string | null | undefined) {
  if (!value) return "Not set";
  const date = new Date(`${value}-01T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateValue(value: string | null | undefined) {
  if (!value) return "Not set";
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatTimelineSummary(profile: MoveProfile) {
  const parts: string[] = [];

  if (profile.target_move_month) {
    parts.push(formatMonthValue(profile.target_move_month));
  }

  if (profile.urgency_level) {
    parts.push(formatUrgencyLevel(profile.urgency_level));
  }

  if (profile.must_arrive_before) {
    parts.push(`Must arrive before ${formatDateValue(profile.must_arrive_before)}`);
  }

  if (profile.flexible_dates === true) {
    parts.push("Dates are flexible");
  } else if (profile.flexible_dates === false) {
    parts.push("Dates are fixed");
  }

  return parts.length > 0 ? parts.join(" · ") : "Not set";
}

export function formatWorkStudySummary(profile: MoveProfile) {
  const parts: string[] = [];

  if (profile.work_status_detail) {
    parts.push(`Work: ${formatWorkStatus(profile.work_status_detail)}`);
  }

  if (profile.study_status_detail) {
    parts.push(`Study: ${formatStudyStatus(profile.study_status_detail)}`);
  }

  if (profile.has_job_offer === true) {
    parts.push("Job offer in place");
  }

  if (profile.has_school_admission === true) {
    parts.push("School admission in place");
  }

  if (profile.employer_or_school_name) {
    parts.push(profile.employer_or_school_name);
  }

  return parts.length > 0 ? parts.join(" · ") : "Not set";
}
