import { getCityById } from "@/lib/data/cities";
import { getCountryById } from "@/lib/data/countries";
import { getLegalPathById } from "@/lib/data/legal-paths";
import type {
  MoveProfile,
  Roadmap,
  RoadmapLevel,
  RoadmapNode,
  RoadmapStatus,
} from "@/types";

type UiLang = "en" | "ru";

// ─── All user-visible strings, keyed by language ──────────────────────────────

const COPY = {
  en: {
    levels: {
      "find-your-place": {
        title: "Find your place",
        description: "Turn your onboarding answers into a shortlist, then choose a country and city.",
      },
      "choose-legal-path": {
        title: "Choose legal path",
        description: "Compare the available routes for your chosen destination and lock in the best fit.",
      },
      "build-your-move-profile": {
        title: "Build your move profile",
        description: "Fill in the final planning details that turn your selected path into a usable move plan.",
      },
      "prepare-documents": {
        titleActive: "Prepare documents",
        titleLocked: "Prepare documents",
        descriptionActive: "Review your Move Brief and request guidance from a relocation advisor for your chosen path.",
        descriptionLocked: "Unlocks after you complete your move profile.",
      },
      "review-risks": {
        title: "Review risks",
        description: "Available once document preparation begins.",
      },
      "submit-appointment": {
        title: "Submit / appointment",
        description: "Available once your application package is ready.",
      },
      "prepare-arrival": {
        title: "Prepare arrival",
        description: "Available after your submission plan is in place.",
      },
      "first-30-days": {
        title: "First 30 days",
        description: "Available when arrival planning starts.",
      },
    },
    nodes: {
      "choose-open-regions":  { title: "Choose open regions" },
      "set-priorities":       { title: "Set priorities" },
      "get-country-shortlist":{ title: "Get country shortlist" },
      "choose-country":       { title: "Choose country" },
      "choose-city":          { title: "Choose city" },
      "compare-legal-paths":  { title: "Compare legal paths" },
      "review-blockers":      { title: "Review blockers" },
      "select-legal-path":    { title: "Select legal path" },
      "create-move-plan":     { title: "Create move plan" },
      "confirm-personal-details": {
        title: "Confirm personal details",
        description: "Review the personal details that anchor your move plan.",
      },
      "add-timeline": {
        title: "Add timeline",
        description: "Set your target move window and how soon you want to act.",
      },
      "add-work-study-details": {
        title: "Add work/study details",
        description: "Capture the facts that support your chosen legal path.",
      },
      "add-budget-reality": {
        title: "Add budget reality",
        description: "Turn your plan into a realistic monthly and savings picture.",
      },
      "add-family-partner-info": {
        title: "Add family/partner info",
        description: "Capture whether anyone is moving with you, even if the answer is just you.",
      },
      "request-partner-review": {
        title: "Request advisor review",
        description: "Share your Move Brief with a relocation advisor to get document guidance for your path.",
      },
      "missing-documents":          { title: "Missing documents" },
      "expiring-documents":         { title: "Expiring documents" },
      "weak-proof":                 { title: "Weak proof" },
      "housing-risk":               { title: "Housing risk" },
      "legal-uncertainty":          { title: "Legal uncertainty" },
      "prepare-application-package":{ title: "Prepare application package" },
      "book-appointment":           { title: "Book appointment" },
      "submit-application":         { title: "Submit application" },
      "track-status":               { title: "Track status" },
      "temporary-housing":          { title: "Temporary housing" },
      "flights":                    { title: "Flights" },
      "esim":                       { title: "eSIM" },
      "banking":                    { title: "Banking" },
      "transport":                  { title: "Transport" },
      "first-address":              { title: "First address" },
      "registration":               { title: "Registration" },
      "local-documents":            { title: "Local documents" },
      "insurance-setup":            { title: "Insurance" },
      "housing-setup":              { title: "Housing" },
      "community":                  { title: "Community" },
      "work-study-setup":           { title: "Work/study setup" },
    },
    preparation: {
      planStarted:  "Move plan started",
      gettingStarted: "Getting started",
      earlyPlanning:  "Early planning",
    },
    title: {
      cityAndCountry: (city: string, country: string) => `Your move to ${city}, ${country}`,
      countryOnly:    (country: string) => `Your move to ${country}`,
      cityOnly:       (city: string)    => `Your move to ${city}`,
      fallback: "Your relocation roadmap",
    },
    subtitle: {
      withDestination: "Your personal roadmap generated from your move profile.",
      fallback: "Built from your onboarding answers so you always know the next step.",
    },
  },

  ru: {
    levels: {
      "find-your-place": {
        title: "Выбор направления",
        description: "Ответьте на стартовые вопросы, получите подборку направлений и выберите страну с городом.",
      },
      "choose-legal-path": {
        title: "Виза или ВНЖ",
        description: "Сравните доступные варианты для выбранного направления и выберите самый подходящий.",
      },
      "build-your-move-profile": {
        title: "Профиль переезда",
        description: "Заполните последние детали планирования, чтобы превратить выбранный путь в рабочий план.",
      },
      "prepare-documents": {
        titleActive: "Подготовка документов",
        titleLocked: "Подготовка документов",
        descriptionActive: "Посмотрите сводку переезда и запросите консультацию советника по выбранному варианту.",
        descriptionLocked: "Открывается после завершения профиля переезда.",
      },
      "review-risks": {
        title: "Проверка рисков",
        description: "Открывается после начала подготовки документов.",
      },
      "submit-appointment": {
        title: "Подача и запись",
        description: "Открывается, когда пакет документов готов.",
      },
      "prepare-arrival": {
        title: "Подготовка к прилёту",
        description: "Открывается после планирования подачи.",
      },
      "first-30-days": {
        title: "Первые 30 дней",
        description: "Открывается с началом планирования прилёта.",
      },
    },
    nodes: {
      "choose-open-regions":  { title: "Выбрать регионы" },
      "set-priorities":       { title: "Задать приоритеты" },
      "get-country-shortlist":{ title: "Получить список стран" },
      "choose-country":       { title: "Выбрать страну" },
      "choose-city":          { title: "Выбрать город" },
      "compare-legal-paths":  { title: "Сравнить визы и ВНЖ" },
      "review-blockers":      { title: "Посмотреть риски" },
      "select-legal-path":    { title: "Выбрать вариант" },
      "create-move-plan":     { title: "Собрать план переезда" },
      "confirm-personal-details": {
        title: "Личные данные",
        description: "Проверьте личные данные, которые лежат в основе вашего плана переезда.",
      },
      "add-timeline": {
        title: "Сроки",
        description: "Задайте целевое окно переезда и насколько скоро вы готовы действовать.",
      },
      "add-work-study-details": {
        title: "Работа / учёба",
        description: "Укажите факты, которые подтверждают выбранный вариант визы или ВНЖ.",
      },
      "add-budget-reality": {
        title: "Финансы",
        description: "Превратите план в реалистичную картину ежемесячных расходов и накоплений.",
      },
      "add-family-partner-info": {
        title: "Семья / партнёр",
        description: "Укажите, кто едет вместе с вами — даже если ответ «только я».",
      },
      "request-partner-review": {
        title: "Консультация советника",
        description: "Поделитесь сводкой переезда с советником, чтобы получить рекомендации по документам.",
      },
      "missing-documents":          { title: "Отсутствующие документы" },
      "expiring-documents":         { title: "Истекающие документы" },
      "weak-proof":                 { title: "Слабые подтверждения" },
      "housing-risk":               { title: "Риск с жильём" },
      "legal-uncertainty":          { title: "Правовая неопределённость" },
      "prepare-application-package":{ title: "Пакет документов" },
      "book-appointment":           { title: "Запись на приём" },
      "submit-application":         { title: "Подача заявления" },
      "track-status":               { title: "Отслеживание статуса" },
      "temporary-housing":          { title: "Временное жильё" },
      "flights":                    { title: "Перелёты" },
      "esim":                       { title: "eSIM" },
      "banking":                    { title: "Банк и платежи" },
      "transport":                  { title: "Транспорт" },
      "first-address":              { title: "Первый адрес" },
      "registration":               { title: "Регистрация" },
      "local-documents":            { title: "Местные документы" },
      "insurance-setup":            { title: "Страховка" },
      "housing-setup":              { title: "Жильё" },
      "community":                  { title: "Люди и сообщество" },
      "work-study-setup":           { title: "Работа / учёба" },
    },
    preparation: {
      planStarted:  "План переезда начат",
      gettingStarted: "Начало",
      earlyPlanning:  "Ранняя стадия",
    },
    title: {
      cityAndCountry: (city: string, country: string) => `Ваш переезд в ${city}, ${country}`,
      countryOnly:    (country: string) => `Ваш переезд в ${country}`,
      cityOnly:       (city: string)    => `Ваш переезд в ${city}`,
      fallback: "Ваш план переезда",
    },
    subtitle: {
      withDestination: "Ваш персональный план на основе профиля переезда.",
      fallback: "Построен из ответов анкеты, чтобы вы всегда знали следующий шаг.",
    },
  },
} as const;

// ─── Node seed helpers ────────────────────────────────────────────────────────

type NodeSeed = {
  id: string;
  title: string;
  description?: string;
};

function getNode(lang: UiLang, id: string): NodeSeed {
  const node = COPY[lang].nodes[id as keyof typeof COPY.en.nodes] as
    | { title: string; description?: string }
    | undefined;
  return { id, title: node?.title ?? id, description: node?.description };
}

function buildNodeSeeds(lang: UiLang, ids: string[]): NodeSeed[] {
  return ids.map((id) => getNode(lang, id));
}

const FIND_YOUR_PLACE_IDS = [
  "choose-open-regions", "set-priorities", "get-country-shortlist",
  "choose-country", "choose-city",
];
const CHOOSE_PATH_IDS = [
  "compare-legal-paths", "review-blockers", "select-legal-path", "create-move-plan",
];
const BUILD_PROFILE_IDS = [
  "confirm-personal-details", "add-timeline", "add-work-study-details",
  "add-budget-reality", "add-family-partner-info",
];
const PREPARE_DOCUMENTS_IDS = ["request-partner-review"];
const REVIEW_RISKS_IDS = [
  "missing-documents", "expiring-documents", "weak-proof", "housing-risk", "legal-uncertainty",
];
const SUBMIT_IDS = [
  "prepare-application-package", "book-appointment", "submit-application", "track-status",
];
const ARRIVAL_IDS = [
  "temporary-housing", "flights", "esim", "banking", "transport", "first-address",
];
const FIRST_30_DAYS_IDS = [
  "registration", "local-documents", "insurance-setup", "housing-setup",
  "community", "work-study-setup",
];

const BUILD_PROFILE_NODE_HREFS: Record<string, string> = {
  "confirm-personal-details": "/app/roadmap/personal-details",
  "add-timeline": "/app/roadmap/timeline",
  "add-work-study-details": "/app/roadmap/work-study",
  "add-budget-reality": "/app/roadmap/budget",
  "add-family-partner-info": "/app/roadmap/family",
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function hasValue(value: string | null) {
  return Boolean(value && value.trim().length > 0);
}

function hasList(values: string[] | null | undefined) {
  return Boolean(values && values.length > 0);
}

function resolveCountryLabel(profile: MoveProfile) {
  const id = profile.selected_country_id;
  if (!id) return "";
  return getCountryById(id)?.name ?? id;
}

function resolveCityLabel(profile: MoveProfile) {
  const id = profile.selected_city_id;
  if (!id) return "";
  return getCityById(id)?.name ?? id;
}

function resolvePathLabel(profile: MoveProfile) {
  const id = profile.selected_legal_path_id;
  if (!id) return "";
  return getLegalPathById(id)?.name ?? id;
}

function createSequentialNodes(
  seeds: NodeSeed[],
  status: RoadmapStatus,
  completedFlags: boolean[],
  hrefMap?: Record<string, string>
): RoadmapNode[] {
  if (status === "completed") {
    return seeds.map((seed) => ({
      ...seed,
      status: "completed",
      href: hrefMap?.[seed.id],
    }));
  }

  if (status === "locked" || status === "blocked") {
    return seeds.map((seed) => ({ ...seed, status }));
  }

  const firstIncompleteIndex = completedFlags.findIndex((flag) => !flag);

  return seeds.map((seed, index) => {
    if (completedFlags[index]) {
      return { ...seed, status: "completed", href: hrefMap?.[seed.id] };
    }
    if (index === firstIncompleteIndex || firstIncompleteIndex === -1) {
      return { ...seed, status: "active", href: hrefMap?.[seed.id] };
    }
    return { ...seed, status: "waiting" };
  });
}

function createLockedLevel(
  id: string,
  title: string,
  description: string,
  nodes: NodeSeed[]
): RoadmapLevel {
  return {
    id,
    title,
    description,
    status: "locked",
    progress: 0,
    nodes: nodes.map((node) => ({ ...node, status: "locked" })),
  };
}

function calculateReadiness(profile: MoveProfile) {
  let score = 5;
  const buildProfileCompleted =
    profile.personal_details_confirmed &&
    profile.timeline_confirmed &&
    profile.work_study_confirmed &&
    profile.budget_confirmed &&
    profile.family_confirmed;

  if (profile.onboarding_completed) score += 10;
  if (hasValue(profile.selected_country_id)) score += 10;
  if (hasValue(profile.selected_city_id)) score += 10;
  if (hasValue(profile.selected_legal_path_id)) score += 10;
  if (hasValue(profile.citizenship)) score += 5;
  if (hasValue(profile.current_country)) score += 5;
  if (hasValue(profile.move_goal)) score += 5;
  if (hasValue(profile.monthly_income_range) || hasValue(profile.savings_range)) score += 5;
  if (
    hasList(profile.open_regions) ||
    hasList(profile.life_preferences) ||
    hasValue(profile.optimization_goal)
  ) {
    score += 5;
  }

  return Math.min(score, buildProfileCompleted ? 45 : 35);
}

export function getMovePreparationLabel(
  readinessPercent: number,
  hasSelectedLegalPath = false,
  lang: UiLang = "en"
) {
  const c = COPY[lang].preparation;
  if (hasSelectedLegalPath) return c.planStarted;
  if (readinessPercent <= 15) return c.gettingStarted;
  return c.earlyPlanning;
}

// ─── Level builders ───────────────────────────────────────────────────────────

function buildFindYourPlaceLevel(profile: MoveProfile, lang: UiLang): RoadmapLevel {
  const lc = COPY[lang].levels["find-your-place"];
  const regionsDone = hasList(profile.open_regions);
  const prioritiesDone =
    hasValue(profile.move_goal) ||
    hasList(profile.life_preferences) ||
    hasValue(profile.optimization_goal);
  const shortlistDone =
    profile.onboarding_completed ||
    hasList(profile.saved_country_ids) ||
    hasValue(profile.selected_country_id);
  const countryDone = hasValue(profile.selected_country_id);
  const cityDone = hasValue(profile.selected_city_id);
  const completedFlags = [regionsDone, prioritiesDone, shortlistDone, countryDone, cityDone];
  const completedCount = completedFlags.filter(Boolean).length;
  const status: RoadmapStatus = countryDone && cityDone ? "completed" : "active";

  return {
    id: "find-your-place",
    title: lc.title,
    description: lc.description,
    status,
    progress: status === "completed" ? 100 : Math.round((completedCount / completedFlags.length) * 100),
    nodes: createSequentialNodes(buildNodeSeeds(lang, FIND_YOUR_PLACE_IDS), status, completedFlags),
  };
}

function buildChooseLegalPathLevel(profile: MoveProfile, lang: UiLang): RoadmapLevel {
  const lc = COPY[lang].levels["choose-legal-path"];
  const citySelected = hasValue(profile.selected_city_id);
  const pathSelected = hasValue(profile.selected_legal_path_id);
  const status: RoadmapStatus = pathSelected ? "completed" : citySelected ? "active" : "locked";

  return {
    id: "choose-legal-path",
    title: lc.title,
    description: lc.description,
    status,
    progress: status === "completed" ? 100 : status === "active" ? 45 : 0,
    nodes: createSequentialNodes(
      buildNodeSeeds(lang, CHOOSE_PATH_IDS),
      status,
      pathSelected ? [true, true, true, true] : [false, false, false, false]
    ),
  };
}

function buildMoveProfileLevel(profile: MoveProfile, lang: UiLang): RoadmapLevel {
  const lc = COPY[lang].levels["build-your-move-profile"];
  const pathSelected = hasValue(profile.selected_legal_path_id);
  const completedFlags = [
    profile.personal_details_confirmed,
    profile.timeline_confirmed,
    profile.work_study_confirmed,
    profile.budget_confirmed,
    profile.family_confirmed,
  ];
  const completedCount = completedFlags.filter(Boolean).length;
  const isComplete = completedFlags.every(Boolean);
  const status: RoadmapStatus = !pathSelected ? "locked" : isComplete ? "completed" : "active";
  const progress =
    status === "locked" ? 0 : status === "completed" ? 100 : Math.max(12, completedCount * 20);

  return {
    id: "build-your-move-profile",
    title: lc.title,
    description: lc.description,
    status,
    progress,
    nodes: createSequentialNodes(
      buildNodeSeeds(lang, BUILD_PROFILE_IDS),
      status,
      completedFlags,
      BUILD_PROFILE_NODE_HREFS
    ),
  };
}

function buildPrepareDocumentsLevel(profile: MoveProfile, lang: UiLang): RoadmapLevel {
  const lc = COPY[lang].levels["prepare-documents"];
  const buildProfileCompleted =
    profile.personal_details_confirmed &&
    profile.timeline_confirmed &&
    profile.work_study_confirmed &&
    profile.budget_confirmed &&
    profile.family_confirmed;
  const status: RoadmapStatus = buildProfileCompleted ? "active" : "locked";

  return {
    id: "prepare-documents",
    title: buildProfileCompleted ? lc.titleActive : lc.titleLocked,
    description: buildProfileCompleted ? lc.descriptionActive : lc.descriptionLocked,
    status,
    progress: 0,
    nodes: createSequentialNodes(
      buildNodeSeeds(lang, PREPARE_DOCUMENTS_IDS),
      status,
      PREPARE_DOCUMENTS_IDS.map(() => false)
    ),
  };
}

// ─── Roadmap title / subtitle ─────────────────────────────────────────────────

function buildRoadmapTitle(profile: MoveProfile, lang: UiLang) {
  const t = COPY[lang].title;
  const cityLabel = resolveCityLabel(profile);
  const countryLabel = resolveCountryLabel(profile);
  if (cityLabel && countryLabel) return t.cityAndCountry(cityLabel, countryLabel);
  if (countryLabel) return t.countryOnly(countryLabel);
  if (cityLabel) return t.cityOnly(cityLabel);
  return t.fallback;
}

function buildRoadmapSubtitle(profile: MoveProfile, lang: UiLang) {
  const s = COPY[lang].subtitle;
  const pathLabel = resolvePathLabel(profile);
  if (pathLabel) return pathLabel;
  if (hasValue(profile.selected_country_id) || hasValue(profile.selected_city_id)) {
    return s.withDestination;
  }
  return s.fallback;
}

// ─── Public export ────────────────────────────────────────────────────────────

export function generateRoadmap(profile: MoveProfile, lang: UiLang = "en"): Roadmap {
  const levels = [
    buildFindYourPlaceLevel(profile, lang),
    buildChooseLegalPathLevel(profile, lang),
    buildMoveProfileLevel(profile, lang),
    buildPrepareDocumentsLevel(profile, lang),
    createLockedLevel(
      "review-risks",
      COPY[lang].levels["review-risks"].title,
      COPY[lang].levels["review-risks"].description,
      buildNodeSeeds(lang, REVIEW_RISKS_IDS)
    ),
    createLockedLevel(
      "submit-appointment",
      COPY[lang].levels["submit-appointment"].title,
      COPY[lang].levels["submit-appointment"].description,
      buildNodeSeeds(lang, SUBMIT_IDS)
    ),
    createLockedLevel(
      "prepare-arrival",
      COPY[lang].levels["prepare-arrival"].title,
      COPY[lang].levels["prepare-arrival"].description,
      buildNodeSeeds(lang, ARRIVAL_IDS)
    ),
    createLockedLevel(
      "first-30-days",
      COPY[lang].levels["first-30-days"].title,
      COPY[lang].levels["first-30-days"].description,
      buildNodeSeeds(lang, FIRST_30_DAYS_IDS)
    ),
  ];

  const currentLevel = levels.find((level) => level.status === "active") ?? levels[0];
  const nextTask =
    currentLevel.nodes.find((node) => node.status === "active") ??
    currentLevel.nodes.find((node) => node.status === "waiting");

  return {
    title: buildRoadmapTitle(profile, lang),
    subtitle: buildRoadmapSubtitle(profile, lang),
    readinessPercent: calculateReadiness(profile),
    currentLevelId: currentLevel.id,
    nextTaskLabel: nextTask?.title ?? currentLevel.title,
    levels,
    language: lang,
  };
}
