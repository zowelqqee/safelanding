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

type NodeSeed = {
  id: string;
  title: string;
  description?: string;
};

const FIND_YOUR_PLACE_NODES: NodeSeed[] = [
  { id: "choose-open-regions", title: "Choose open regions" },
  { id: "set-priorities", title: "Set priorities" },
  { id: "get-country-shortlist", title: "Get country shortlist" },
  { id: "choose-country", title: "Choose country" },
  { id: "choose-city", title: "Choose city" },
];

const CHOOSE_PATH_NODES: NodeSeed[] = [
  { id: "compare-legal-paths", title: "Compare legal paths" },
  { id: "review-blockers", title: "Review blockers" },
  { id: "select-legal-path", title: "Select legal path" },
  { id: "create-move-plan", title: "Create move plan" },
];

const BUILD_PROFILE_NODES: NodeSeed[] = [
  {
    id: "confirm-personal-details",
    title: "Confirm personal details",
    description: "Review the personal details that anchor your move plan.",
  },
  {
    id: "add-timeline",
    title: "Add timeline",
    description: "Set your target move window and how soon you want to act.",
  },
  {
    id: "add-work-study-details",
    title: "Add work/study details",
    description: "Capture the facts that support your chosen legal path.",
  },
  {
    id: "add-budget-reality",
    title: "Add budget reality",
    description: "Turn your plan into a realistic monthly and savings picture.",
  },
  {
    id: "add-family-partner-info",
    title: "Add family/partner info",
    description: "Capture whether anyone is moving with you, even if the answer is just you.",
  },
];

const PREPARE_DOCUMENTS_NODES: NodeSeed[] = [
  {
    id: "request-partner-review",
    title: "Request partner review",
    description:
      "Verified document guidance is not unlocked yet. We will add partner-reviewed help later.",
  },
];

const REVIEW_RISKS_NODES: NodeSeed[] = [
  { id: "missing-documents", title: "Missing documents" },
  { id: "expiring-documents", title: "Expiring documents" },
  { id: "weak-proof", title: "Weak proof" },
  { id: "housing-risk", title: "Housing risk" },
  { id: "legal-uncertainty", title: "Legal uncertainty" },
];

const SUBMIT_NODES: NodeSeed[] = [
  { id: "prepare-application-package", title: "Prepare application package" },
  { id: "book-appointment", title: "Book appointment" },
  { id: "submit-application", title: "Submit application" },
  { id: "track-status", title: "Track status" },
];

const ARRIVAL_NODES: NodeSeed[] = [
  { id: "temporary-housing", title: "Temporary housing" },
  { id: "flights", title: "Flights" },
  { id: "esim", title: "eSIM" },
  { id: "banking", title: "Banking" },
  { id: "transport", title: "Transport" },
  { id: "first-address", title: "First address" },
];

const FIRST_30_DAYS_NODES: NodeSeed[] = [
  { id: "registration", title: "Registration" },
  { id: "local-documents", title: "Local documents" },
  { id: "insurance-setup", title: "Insurance" },
  { id: "housing-setup", title: "Housing" },
  { id: "community", title: "Community" },
  { id: "work-study-setup", title: "Work/study setup" },
];

const BUILD_PROFILE_NODE_HREFS: Record<string, string> = {
  "confirm-personal-details": "/app/roadmap/personal-details",
  "add-timeline": "/app/roadmap/timeline",
  "add-work-study-details": "/app/roadmap/work-study",
  "add-budget-reality": "/app/roadmap/budget",
  "add-family-partner-info": "/app/roadmap/family",
};

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
      return {
        ...seed,
        status: "completed",
        href: hrefMap?.[seed.id],
      };
    }

    if (index === firstIncompleteIndex || firstIncompleteIndex === -1) {
      return {
        ...seed,
        status: "active",
        href: hrefMap?.[seed.id],
      };
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
  hasSelectedLegalPath = false
) {
  if (hasSelectedLegalPath) return "Move plan started";
  if (readinessPercent <= 15) return "Getting started";
  return "Early planning";
}

function buildFindYourPlaceLevel(profile: MoveProfile): RoadmapLevel {
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
  const completedFlags = [
    regionsDone,
    prioritiesDone,
    shortlistDone,
    countryDone,
    cityDone,
  ];
  const completedCount = completedFlags.filter(Boolean).length;
  const status: RoadmapStatus = countryDone && cityDone ? "completed" : "active";

  return {
    id: "find-your-place",
    title: "Find your place",
    description: "Turn your onboarding answers into a shortlist, then choose a country and city.",
    status,
    progress: status === "completed" ? 100 : Math.round((completedCount / completedFlags.length) * 100),
    nodes: createSequentialNodes(FIND_YOUR_PLACE_NODES, status, completedFlags),
  };
}

function buildChooseLegalPathLevel(profile: MoveProfile): RoadmapLevel {
  const citySelected = hasValue(profile.selected_city_id);
  const pathSelected = hasValue(profile.selected_legal_path_id);
  const status: RoadmapStatus = pathSelected
    ? "completed"
    : citySelected
      ? "active"
      : "locked";

  return {
    id: "choose-legal-path",
    title: "Choose legal path",
    description: "Compare the available routes for your chosen destination and lock in the best fit.",
    status,
    progress: status === "completed" ? 100 : status === "active" ? 45 : 0,
    nodes: createSequentialNodes(
      CHOOSE_PATH_NODES,
      status,
      pathSelected ? [true, true, true, true] : [false, false, false, false]
    ),
  };
}

function buildMoveProfileLevel(profile: MoveProfile): RoadmapLevel {
  const pathSelected = hasValue(profile.selected_legal_path_id);
  const personalDone = profile.personal_details_confirmed;
  const timelineDone = profile.timeline_confirmed;
  const workStudyDone = profile.work_study_confirmed;
  const budgetDone = profile.budget_confirmed;
  const familyDone = profile.family_confirmed;
  const completedFlags = [
    personalDone,
    timelineDone,
    workStudyDone,
    budgetDone,
    familyDone,
  ];
  const completedCount = completedFlags.filter(Boolean).length;
  const isComplete = completedFlags.every(Boolean);
  const status: RoadmapStatus = !pathSelected
    ? "locked"
    : isComplete
      ? "completed"
      : "active";
  const progress = status === "locked"
    ? 0
    : status === "completed"
      ? 100
      : Math.max(12, completedCount * 20);

  return {
    id: "build-your-move-profile",
    title: "Build your move profile",
    description: "Fill in the final planning details that turn your selected path into a usable move plan.",
    status,
    progress,
    nodes: createSequentialNodes(
      BUILD_PROFILE_NODES,
      status,
      completedFlags,
      BUILD_PROFILE_NODE_HREFS
    ),
  };
}

function buildPrepareDocumentsLevel(profile: MoveProfile): RoadmapLevel {
  const buildProfileCompleted =
    profile.personal_details_confirmed &&
    profile.timeline_confirmed &&
    profile.work_study_confirmed &&
    profile.budget_confirmed &&
    profile.family_confirmed;
  const status: RoadmapStatus = buildProfileCompleted ? "active" : "locked";

  return {
    id: "prepare-documents",
    title: "Prepare documents",
    description: buildProfileCompleted
      ? "Document guidance for this path requires verified local partners. We are not showing document checklists yet."
      : "Unlocks after you complete your move profile.",
    status,
    progress: 0,
    nodes: createSequentialNodes(
      PREPARE_DOCUMENTS_NODES,
      status,
      PREPARE_DOCUMENTS_NODES.map(() => false)
    ),
    ctaLabel: buildProfileCompleted
      ? "Join waitlist for verified document guidance"
      : undefined,
    ctaDescription: buildProfileCompleted
      ? "Document guidance for this path requires verified local partners. We are not showing document checklists yet."
      : undefined,
  };
}

function buildRoadmapTitle(profile: MoveProfile) {
  const cityLabel = resolveCityLabel(profile);
  const countryLabel = resolveCountryLabel(profile);

  if (cityLabel && countryLabel) {
    return `Your move to ${cityLabel}, ${countryLabel}`;
  }

  if (countryLabel) {
    return `Your move to ${countryLabel}`;
  }

  if (cityLabel) {
    return `Your move to ${cityLabel}`;
  }

  return "Your relocation roadmap";
}

function buildRoadmapSubtitle(profile: MoveProfile) {
  const pathLabel = resolvePathLabel(profile);
  if (pathLabel) {
    return pathLabel;
  }

  if (hasValue(profile.selected_country_id) || hasValue(profile.selected_city_id)) {
    return "Your personal roadmap generated from your move profile.";
  }

  return "Built from your onboarding answers so you always know the next step.";
}

export function generateRoadmap(profile: MoveProfile): Roadmap {
  const levels = [
    buildFindYourPlaceLevel(profile),
    buildChooseLegalPathLevel(profile),
    buildMoveProfileLevel(profile),
    buildPrepareDocumentsLevel(profile),
    createLockedLevel(
      "review-risks",
      "Review risks",
      "Unlocks after your first document checklist exists.",
      REVIEW_RISKS_NODES
    ),
    createLockedLevel(
      "submit-appointment",
      "Submit / appointment",
      "Unlocks when your application package is ready.",
      SUBMIT_NODES
    ),
    createLockedLevel(
      "prepare-arrival",
      "Prepare arrival",
      "Unlocks after your submission plan is ready.",
      ARRIVAL_NODES
    ),
    createLockedLevel(
      "first-30-days",
      "First 30 days",
      "Unlocks when your arrival plan starts.",
      FIRST_30_DAYS_NODES
    ),
  ];

  const currentLevel = levels.find((level) => level.status === "active") ?? levels[0];
  const nextTask =
    currentLevel.nodes.find((node) => node.status === "active") ??
    currentLevel.nodes.find((node) => node.status === "waiting");

  return {
    title: buildRoadmapTitle(profile),
    subtitle: buildRoadmapSubtitle(profile),
    readinessPercent: calculateReadiness(profile),
    currentLevelId: currentLevel.id,
    nextTaskLabel: nextTask?.title ?? currentLevel.title,
    levels,
  };
}
