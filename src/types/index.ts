// ─── Country ─────────────────────────────────────────────────────────────────

export type CountryProfile = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  region: string;
  continent: string;
  languages: string[];
  currency: string;
  schengen_area: boolean;
  schengenArea: boolean;
  summary: string;
  best_for: string[];
  watch_out: string[];
  lifestyle_fit_factors: string[];
  legal_fit_factors: string[];
  cost_level: 1 | 2 | 3 | 4 | 5;
  housing_difficulty: 1 | 2 | 3 | 4 | 5;
  english_friendliness: 1 | 2 | 3 | 4 | 5;
  expat_community: 1 | 2 | 3 | 4 | 5;
  career_opportunities: 1 | 2 | 3 | 4 | 5;
  study_fit: 1 | 2 | 3 | 4 | 5;
  remote_work_fit: 1 | 2 | 3 | 4 | 5;
  family_fit: 1 | 2 | 3 | 4 | 5;
  climate_score: 1 | 2 | 3 | 4 | 5;
  bureaucracy_level: 1 | 2 | 3 | 4 | 5;
  long_term_stability: 1 | 2 | 3 | 4 | 5;
  calm_lifestyle: 1 | 2 | 3 | 4 | 5;
  public_transport: 1 | 2 | 3 | 4 | 5;
  main_legal_blocker: string;
  main_lifestyle_blocker: string;
  what_people_underestimate: string;
  first_90_days_preview: string[];
  legal_disclaimer: string;
  city_ids: string[];
  available_legal_path_ids: string[];
  journey_available: boolean;
  heroImage?: string;
  costLevel: 1 | 2 | 3 | 4 | 5;
  housingDifficulty: 1 | 2 | 3 | 4 | 5;
  englishFriendliness: 1 | 2 | 3 | 4 | 5;
  expatCommunity: 1 | 2 | 3 | 4 | 5;
  careerOpportunities: 1 | 2 | 3 | 4 | 5;
  climateWarmth: 1 | 2 | 3 | 4 | 5;
  remoteWorkerFit: 1 | 2 | 3 | 4 | 5;
  studentFit: 1 | 2 | 3 | 4 | 5;
  familyFit: 1 | 2 | 3 | 4 | 5;
  calmLifestyle: 1 | 2 | 3 | 4 | 5;
  publicTransport: 1 | 2 | 3 | 4 | 5;
  coastal: boolean;
  goodFor: string[];
  challenges: string[];
  availableLegalPathIds: string[];
  cityIds: string[];
  journeyAvailable: boolean;
};

export type CountryMatchResult = {
  countryId: string;
  score: number;
  overallFit: number;
  lifestyleFit: number;
  legalFit: number;
  mainBlocker: string;
  reasons: string[];
  challenges: string[];
  topPathId?: string;
};

// ─── City / Region ────────────────────────────────────────────────────────────

export type CityProfile = {
  id: string;
  country_id: string;
  countryId: string;
  country: string;
  name: string;
  slug: string;
  summary: string;
  best_for: string[];
  watch_out: string[];
  avg_rent_range: string;
  monthly_budget_range: string;
  cost_level: 1 | 2 | 3 | 4 | 5;
  housing_difficulty: 1 | 2 | 3 | 4 | 5;
  english_friendliness: 1 | 2 | 3 | 4 | 5;
  expat_community: 1 | 2 | 3 | 4 | 5;
  career_opportunities: 1 | 2 | 3 | 4 | 5;
  student_fit: 1 | 2 | 3 | 4 | 5;
  remote_worker_fit: 1 | 2 | 3 | 4 | 5;
  family_fit: 1 | 2 | 3 | 4 | 5;
  public_transport: 1 | 2 | 3 | 4 | 5;
  climate_score: 1 | 2 | 3 | 4 | 5;
  first_90_days_preview: string[];
  first_90_days_difficulty: 1 | 2 | 3 | 4 | 5;
  main_lifestyle_blocker: string;
  what_people_underestimate: string;
  big_city: boolean;
  calm_lifestyle: 1 | 2 | 3 | 4 | 5;
  costLevel: 1 | 2 | 3 | 4 | 5;
  housingDifficulty: 1 | 2 | 3 | 4 | 5;
  englishFriendliness: 1 | 2 | 3 | 4 | 5;
  expatCommunity: 1 | 2 | 3 | 4 | 5;
  careerOpportunities: 1 | 2 | 3 | 4 | 5;
  studentFit: 1 | 2 | 3 | 4 | 5;
  remoteWorkerFit: 1 | 2 | 3 | 4 | 5;
  familyFit: 1 | 2 | 3 | 4 | 5;
  climateWarmth: 1 | 2 | 3 | 4 | 5;
  publicTransport: 1 | 2 | 3 | 4 | 5;
  calmLifestyle: 1 | 2 | 3 | 4 | 5;
  coastal: boolean;
  bigCity: boolean;
  bestFor: string[];
  badFor: string[];
  risks: string[];
  longDescription: string;
  firstNinetyDays: FirstNinetyDays;
  housingAvgRent?: string;
  monthlyBudgetMin?: string;
  heroImage?: string;
  thumbnailImage?: string;
};

export type FirstNinetyDays = {
  week1: string[];
  weeks2to4: string[];
  months2to3: string[];
};

export type CityMatchResult = {
  cityId: string;
  score: number;
  reasons: string[];
  risks: string[];
  mainBlocker: string;
  first90DaysDifficulty: number;
};

export type CityRealitySignalTopic =
  | "housing"
  | "language"
  | "bureaucracy"
  | "money"
  | "community"
  | "first_90_days"
  | "regret"
  | "advice";

export type CityRealitySignalSentiment = "positive" | "mixed" | "negative";

export type CityRealitySnapshotSignal = {
  title: string;
  description: string;
};

export type CityRealityStorySignal = {
  quote: string;
  sourceLabel: string;
  sourceUrl: string;
  sourceAgeLabel?: string;
  topic: CityRealitySignalTopic;
  sentiment: CityRealitySignalSentiment;
  summary?: string;
};

export type CityRealitySourceLink = {
  label: string;
  url: string;
  topic: CityRealitySignalTopic;
};

export type CityRealityPatternSummary = {
  peopleLove: string[];
  peopleStruggleWith: string[];
  peopleUnderestimate: string[];
  first90Days: string[];
};

export type CityRealityReport = {
  cityId: string;
  countryId: string;
  summary: string;
  disclaimer: string;
  snapshotSignals: CityRealitySnapshotSignal[];
  storySignals: CityRealityStorySignal[];
  patternSummary: CityRealityPatternSummary;
  adviceBeforeMove: string[];
  sourceLinks: CityRealitySourceLink[];
};

// ─── Relocation video stories ────────────────────────────────────────────────

export type RelocationVideoPlatform = "youtube" | "other";

export type RelocationVideoPersonType =
  | "remote_worker"
  | "student"
  | "family"
  | "founder"
  | "employee"
  | "freelancer"
  | "unknown";

export type RelocationVideoTopic =
  | "housing"
  | "cost"
  | "documents"
  | "language"
  | "work"
  | "community"
  | "first_90_days"
  | "mistakes"
  | "regret"
  | "adaptation"
  | "general";

export type RelocationVideoSentiment = "positive" | "mixed" | "negative";

export type RelocationVideoStory = {
  id: string;
  countryId: string;
  cityId?: string;
  title: string;
  channelName: string;
  videoUrl: string;
  thumbnailUrl?: string;
  platform: RelocationVideoPlatform;
  personType: RelocationVideoPersonType;
  movedFrom?: string;
  movedTo: string;
  livedThereFor?: string;
  topic: RelocationVideoTopic;
  sentiment: RelocationVideoSentiment;
  keyTakeaway: string;
  summary: string;
  language: string;
  publishedAt?: string;
  collectedAt: string;
  verified: boolean;
};

// ─── Legal paths ──────────────────────────────────────────────────────────────

export type LegalPath = {
  id: string;
  country_id: string;
  countryId: string;
  name: string;
  slug: string;
  scenario:
    | "remote"
    | "study"
    | "work"
    | "family"
    | "capital"
    | "exploration"
    | "talent"
    | "business";
  summary: string;
  good_if: string[];
  weak_points: string[];
  goodIf: string[];
  weakPoints: string[];
  complexity: 1 | 2 | 3 | 4 | 5;
  estimated_preparation_time: string;
  estimatedPreparationTime: string;
  requires_sponsor: boolean;
  requires_admission: boolean;
  requires_remote_income: boolean;
  requires_local_employer: boolean;
  legal_disclaimer: string;
  requiredDocumentTypeIds: string[];
  available: boolean;
  journey_available: boolean;
  journeyAvailable: boolean;
};

export type DocumentType = {
  id: string;
  name: string;
  description: string;
  requiredFor: string[];
  acceptedFormats: string[];
  validityDays?: number;
  requiresTranslation?: boolean;
  requiresApostille?: boolean;
  templateUrl?: string;
  exampleUrl?: string;
  weight: number;
};

// ─── User & Journey ───────────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  userId: string;
  citizenship?: string;
  currentCountry?: string;
  residenceCountry?: string;
  language: "ru" | "en";
  moveGoal?: MoveGoal;
  monthlyIncome?: IncomeRange;
  savingsRange?: SavingsRange;
  incomeType?: IncomeType;
  lifePreferences?: LifePreference[];
  mainFear?: MainFear;
  createdAt: string;
  updatedAt: string;
};

export type MoveGoal =
  | "remote_work"
  | "study"
  | "explore_first"
  | "find_job"
  | "family"
  | "not_sure";

export type IncomeRange =
  | "under_1000"
  | "1000_2000"
  | "2000_3000"
  | "3000_5000"
  | "5000_plus";

export type SavingsRange =
  | "under_3000"
  | "3000_7000"
  | "7000_15000"
  | "15000_30000"
  | "30000_plus";

export type IncomeType =
  | "remote_employment"
  | "freelance"
  | "business_owner"
  | "savings_only"
  | "student_family"
  | "no_stable_income";

export type LifePreference =
  | "warm_climate"
  | "lower_cost"
  | "big_city"
  | "sea_nearby"
  | "expat_community"
  | "english_friendly"
  | "family_friendly"
  | "career_opportunities"
  | "calm_lifestyle"
  | "student_life"
  | "public_transport";

export type MainFear =
  | "documents"
  | "money"
  | "housing"
  | "language"
  | "finding_work"
  | "being_alone"
  | "choosing_wrong_place"
  | "legal_status";

export type UserJourney = {
  id: string;
  userId: string;
  countryId: string;
  cityId: string;
  legalPathId: string;
  status: "active" | "paused" | "completed";
  overallProgress: number;
  readinessScore: number;
  currentStageId: string;
  createdAt: string;
  updatedAt: string;
};

export type JourneyStageStatus = "locked" | "active" | "completed";

export type JourneyStage = {
  id: string;
  journeyId: string;
  templateStageId: string;
  title: string;
  description: string;
  status: JourneyStageStatus;
  progress: number;
  order: number;
  tasks: Task[];
};

export type Task = {
  id: string;
  userId: string;
  journeyId: string;
  stageId: string;
  title: string;
  description?: string;
  type: "document" | "form" | "service" | "research" | "appointment" | "review";
  status: "todo" | "in_progress" | "done" | "blocked";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  relatedDocumentTypeId?: string;
  serviceCategory?: string;
  createdAt: string;
  updatedAt: string;
};

export type DocumentStatus =
  | "missing"
  | "uploaded"
  | "needs_translation"
  | "needs_apostille"
  | "expiring_soon"
  | "expired"
  | "risky"
  | "looks_good";

export type UserDocument = {
  id: string;
  userId: string;
  documentTypeId: string;
  journeyId?: string;
  fileUrl?: string;
  fileName?: string;
  status: DocumentStatus;
  issuedAt?: string;
  expiresAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ServiceCard = {
  id: string;
  category: string;
  title: string;
  description: string;
  countryId: string;
  cityId?: string;
  relatedStageId?: string;
  relatedDocumentTypeId?: string;
  ctaLabel: string;
  externalUrl?: string;
  affiliateTag?: string;
  isPartner: boolean;
};

export type RelocationStory = {
  id: string;
  cityId: string;
  countryId: string;
  title: string;
  personLabel: string;
  movedFrom: string;
  movedTo: string;
  moveYear: number;
  pathType: "remote" | "study" | "work" | "family" | "exploration" | "other";
  budgetRange?: string;
  timeToHousing?: string;
  hardestPart?: string;
  biggestMistake?: string;
  bestAdvice?: string;
  quote: string;
  body: string;
  tags: string[];
};

export type RegionPreference =
  | "europe"
  | "north_america"
  | "asia"
  | "middle_east"
  | "latin_america"
  | "not_sure";

export type MoveOptimization =
  | "fastest_legal_path"
  | "best_career"
  | "lowest_cost"
  | "comfortable_life"
  | "best_study"
  | "safest_longterm";

// ─── Onboarding state ─────────────────────────────────────────────────────────

export type OnboardingState = {
  step: number;
  // Step 1 — base
  citizenship: string;
  currentCountry: string;
  residenceCountry: string;
  language: "ru" | "en";
  // Step 2 — goal
  moveGoal: MoveGoal | "";
  // Step 3 — money
  monthlyIncome: IncomeRange | "";
  savingsRange: SavingsRange | "";
  incomeType: IncomeType | "";
  // Step 4 — preferences
  lifePreferences: LifePreference[];
  // Step 5 — fear
  mainFear: MainFear | "";
  // Step 6 — region preferences
  regionPreferences: RegionPreference[];
  // Step 7 — what to optimize for
  moveOptimization: MoveOptimization | "";
  // Step 8 — country selection (set after user picks from country shortlist)
  selectedCountry: string;
  // Step 9 — city selection
  selectedCity: string;
  // Step 10 — legal path selection
  selectedLegalPath: string;
  // Shortlists (advisory, can shortlist multiple before choosing one)
  shortlistedCountries: string[];
  shortlistedCities: string[];
};

// ─── Move profile (Supabase) ─────────────────────────────────────────────────

export type MoveProfile = {
  id: string;
  user_id: string | null;
  anonymous_id?: string | null;
  citizenship: string | null;
  current_country: string | null;
  residence_country: string | null;
  preferred_language: string;
  move_goal: string | null;
  monthly_income_range: string | null;
  savings_range: string | null;
  income_type: string | null;
  life_preferences: string[];
  worries: string[];      // TEXT[] — stored as single-element array for mainFear
  open_regions: string[];
  optimization_goal: string | null;
  saved_country_ids: string[];
  saved_city_ids: string[];
  selected_country_id: string | null;
  selected_city_id: string | null;
  selected_legal_path_id: string | null;
  personal_details_confirmed: boolean;
  timeline_confirmed: boolean;
  work_study_confirmed: boolean;
  budget_confirmed: boolean;
  family_confirmed: boolean;
  target_move_month: string | null;
  urgency_level: string | null;
  must_arrive_before: string | null;
  flexible_dates: boolean | null;
  moving_with: string | null;
  work_status_detail: string | null;
  study_status_detail: string | null;
  has_job_offer: boolean | null;
  has_school_admission: boolean | null;
  employer_or_school_name: string | null;
  expected_monthly_budget_range: string | null;
  emergency_fund_range: string | null;
  budget_notes: string | null;
  dependents_count: number | null;
  family_notes: string | null;
  active_step: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type MoveProfilePatch = Partial<
  Omit<MoveProfile, "id" | "user_id" | "anonymous_id" | "created_at" | "updated_at">
>;

export type PartnerReviewRequest = {
  id?: string;
  user_id: string;
  move_profile_id: string;
  selected_country_id: string | null;
  selected_city_id: string | null;
  selected_legal_path_id: string | null;
  email: string;
  message: string | null;
  consent_given: boolean;
  status: string;
  created_at?: string;
  updated_at?: string;
};

export type UserFeedback = {
  id: string;
  user_id: string | null;
  move_profile_id: string | null;
  source: string;
  usefulness: string;
  would_request_real_help: string | null;
  comment: string | null;
  created_at: string;
};

// ─── Generated roadmap ───────────────────────────────────────────────────────

export type RoadmapStatus =
  | "completed"
  | "active"
  | "locked"
  | "blocked"
  | "waiting";

export type RoadmapNode = {
  id: string;
  title: string;
  status: RoadmapStatus;
  description?: string;
  href?: string;
};

export type RoadmapLevel = {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  progress: number;
  nodes: RoadmapNode[];
  ctaLabel?: string;
  ctaDescription?: string;
};

export type Roadmap = {
  title: string;
  subtitle: string;
  readinessPercent: number;
  currentLevelId: string;
  nextTaskLabel: string;
  levels: RoadmapLevel[];
};

// ─── Path scoring inputs ──────────────────────────────────────────────────────

export type PathFinderAnswers = {
  worksRemotely: boolean | null;
  foreignIncome: boolean | null;
  monthlyIncome: IncomeRange | "";
  hasSavings: boolean | null;
  readyToStudy: boolean | null;
  hasAdmission: boolean | null;
  hasJobOffer?: boolean | null;
  hasSchoolAdmission?: boolean | null;
  hasExtraordinaryProfile?: boolean | null;
  hasCapital?: boolean | null;
  moveSoon: boolean | null;
  movingWithFamily: boolean | null;
};

export type PathMatchResult = {
  pathId: string;
  score: number;
  reasons: string[];
  weakPoints: string[];
};
