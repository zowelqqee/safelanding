"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type {
  OnboardingState,
  LifePreference,
  MoveGoal,
  MainFear,
  RegionPreference,
  MoveOptimization,
  SafetyImportance,
  CostTolerance,
  StudyPriority,
  IncomeRange,
  SavingsRange,
  IncomeType,
  MoveProfilePatch,
} from "@/types";
import { StepWelcome } from "./steps/step-welcome";
import { StepBase } from "./steps/step-base";
import { StepGoal } from "./steps/step-goal";
import { StepMoney } from "./steps/step-money";
import { StepPreferences } from "./steps/step-preferences";
import { StepFear } from "./steps/step-fear";
import { StepRegion } from "./steps/step-region";
import { StepOptimization } from "./steps/step-optimization";
import { StepCountryResults } from "./steps/step-country-results";
import { StepCityResults } from "./steps/step-city-results";
import { StepLegalPath } from "./steps/step-legal-path";
import { StepPlanReady } from "./steps/step-plan-ready";
import {
  getCurrentMoveProfile,
  updateMoveProfile,
} from "@/lib/profile/profileService";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { SignOutButton } from "@/components/auth/sign-out-button";
import type { UiLanguage } from "@/lib/i18n/onboarding";
import {
  LANGUAGE_CHANGE_EVENT,
  getStoredUiLanguage,
  isUiLanguage,
  notifyUiLanguageChanged,
  setStoredUiLanguage,
} from "@/lib/i18n/ui-language";

// Steps: 0-welcome 1-base 2-goal 3-money 4-prefs 5-fear 6-region 7-optimization
//        8-countries 9-cities 10-paths 11-plan-ready
const CONTENT_STEPS = 10;
const TOTAL_STEPS = 12;

const ACTIVE_STEP_INDEX: Record<string, number> = {
  welcome: 0,
  onboarding: 0,    // alias for legacy rows with default active_step
  base: 1,
  goal: 2,
  money: 3,
  prefs: 4,
  fear: 5,
  region: 6,
  optimization: 7,
  country_shortlist: 8,
  city_shortlist: 9,
  legal_path: 10,
  move_plan_ready: 11,
};

const ACTIVE_STEP_LABEL: Record<string, string> = {
  country_shortlist: "country shortlist",
  city_shortlist: "city selection",
  legal_path: "legal path selection",
  move_plan_ready: "move plan",
};

const initialState: OnboardingState = {
  step: 0,
  citizenship: "",
  currentCountry: "",
  residenceCountry: "",
  language: "en",
  moveGoal: "",
  monthlyIncome: "",
  savingsRange: "",
  incomeType: "",
  lifePreferences: [],
  mainFear: "",
  regionPreferences: [],
  moveOptimization: "",
  safetyImportance: "medium",
  costTolerance: "flexible",
  studyPriority: "top_university",
  selectedCountry: "",
  selectedCity: "",
  selectedLegalPath: "",
  shortlistedCountries: [],
  shortlistedCities: [],
};

function getInitialOnboardingState(): OnboardingState {
  if (typeof window === "undefined") {
    return initialState;
  }

  return {
    ...initialState,
    language: getStoredUiLanguage(initialState.language),
  };
}

// ─── Persistence helpers ──────────────────────────────────────────────────────

async function persistStepData(completedStep: number, state: OnboardingState) {
  const patches: Record<number, MoveProfilePatch> = {
    1: {
      citizenship: state.citizenship || null,
      current_country: state.currentCountry || null,
      residence_country: state.residenceCountry || null,
      preferred_language: state.language,
      active_step: "goal",
    },
    2: {
      move_goal: state.moveGoal || null,
      active_step: "money",
    },
    3: {
      monthly_income_range: state.monthlyIncome || null,
      savings_range: state.savingsRange || null,
      income_type: state.incomeType || null,
      active_step: "prefs",
    },
    4: {
      life_preferences: state.lifePreferences,
      active_step: "fear",
    },
    5: {
      worries: state.mainFear ? [state.mainFear] : [],
      active_step: "region",
    },
    6: {
      open_regions: state.regionPreferences,
      active_step: "optimization",
    },
    7: {
      optimization_goal: state.moveOptimization || null,
      onboarding_completed: true,
      active_step: "country_shortlist",
    },
  };
  const patch = patches[completedStep];
  if (patch) {
    await updateMoveProfile(patch);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

type ResumeInfo = { stepIndex: number; label: string };

interface OnboardingFlowProps {
  isPreview?: boolean;
}

export function OnboardingFlow({ isPreview = false }: OnboardingFlowProps) {
  const [state, setState] = useState<OnboardingState>(() => getInitialOnboardingState());
  const [profileLoaded, setProfileLoaded] = useState(isPreview);
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);
  const [showRoadmapCta, setShowRoadmapCta] = useState(false);
  const prevStep = useRef(-1);
  const router = useRouter();

  // ── Load profile on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (isPreview) {
      return;
    }

    let cancelled = false;

    getCurrentMoveProfile()
      .then((profile) => {
        if (cancelled || !profile) return;

        const profileLanguage = isUiLanguage(profile.preferred_language)
          ? profile.preferred_language
          : getStoredUiLanguage("en");

        setStoredUiLanguage(profileLanguage);
        notifyUiLanguageChanged(profileLanguage);

        setState((prev) => ({
          ...prev,
          citizenship: profile.citizenship ?? "",
          currentCountry: profile.current_country ?? "",
          residenceCountry: profile.residence_country ?? "",
          language: profileLanguage,
          moveGoal: (profile.move_goal as MoveGoal) ?? "",
          monthlyIncome: (profile.monthly_income_range as IncomeRange) ?? "",
          savingsRange: (profile.savings_range as SavingsRange) ?? "",
          incomeType: (profile.income_type as IncomeType) ?? "",
          lifePreferences: (profile.life_preferences as LifePreference[]) ?? [],
          mainFear: ((profile.worries as string[])?.[0] as MainFear) ?? "",
          regionPreferences: (profile.open_regions as RegionPreference[]) ?? [],
          moveOptimization: (profile.optimization_goal as MoveOptimization) ?? "",
          selectedCountry: profile.selected_country_id ?? "",
          selectedCity: profile.selected_city_id ?? "",
          selectedLegalPath: profile.selected_legal_path_id ?? "",
          shortlistedCountries: profile.saved_country_ids ?? [],
          shortlistedCities: profile.saved_city_ids ?? [],
        }));

        setShowRoadmapCta(
          Boolean(
            profile.selected_legal_path_id ||
            profile.active_step === "move_plan_ready"
          )
        );

        if (!profile.onboarding_completed) return;

        const idx = ACTIVE_STEP_INDEX[profile.active_step] ?? 8;
        const label = ACTIVE_STEP_LABEL[profile.active_step];
        // Only show resume for meaningful resume points (country shortlist and beyond)
        if (idx >= 8 && label) {
          setResumeInfo({ stepIndex: idx, label });
        }
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) {
          setProfileLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isPreview]);

  useEffect(() => {
    const handleLanguageChange = (event: Event) => {
      if (
        event instanceof CustomEvent &&
        isUiLanguage(event.detail?.language)
      ) {
        setState((prev) => ({ ...prev, language: event.detail.language }));
      }
    };

    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange);

    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange);
    };
  }, []);

  // ── Persist step data when step advances ───────────────────────────────────
  useEffect(() => {
    if (!profileLoaded) return;
    if (prevStep.current === state.step) return;
    const from = prevStep.current;
    prevStep.current = state.step;
    if (!isPreview && from >= 1) {
      persistStepData(from, state).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step, profileLoaded]);

  // ── State helpers ──────────────────────────────────────────────────────────
  const update = (patch: Partial<OnboardingState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  const updateLanguage = (language: UiLanguage) => {
    setState((prev) => ({ ...prev, language }));

    setStoredUiLanguage(language);
    notifyUiLanguageChanged(language);

    if (!isPreview) {
      updateMoveProfile({ preferred_language: language }).catch(console.error);
    }
  };

  const handleBaseChange = (patch: Partial<{
    citizenship: string;
    currentCountry: string;
    residenceCountry: string;
    language: UiLanguage;
  }>) => {
    if (patch.language) {
      updateLanguage(patch.language);
    }

    const rest: Partial<OnboardingState> = {};
    if (patch.citizenship !== undefined) rest.citizenship = patch.citizenship;
    if (patch.currentCountry !== undefined) rest.currentCountry = patch.currentCountry;
    if (patch.residenceCountry !== undefined) rest.residenceCountry = patch.residenceCountry;

    if (Object.keys(rest).length > 0) {
      update(rest);
    }
  };

  const next = () =>
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, TOTAL_STEPS - 1) }));

  const back = () =>
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 0) }));

  const handleResume = () => {
    if (resumeInfo) {
      setState((prev) => ({ ...prev, step: resumeInfo.stepIndex }));
    }
  };

  const handleOpenRoadmap = () => {
    router.push("/app/roadmap");
  };

  const handleStartOnboarding = () => {
    void trackEvent("onboarding_started");
    next();
  };

  // ── Selection handlers ─────────────────────────────────────────────────────
  const handleCountrySelected = (countryId: string) => {
    update({ selectedCountry: countryId });
    void trackEvent("country_selected", { countryId });
    next();
    if (!isPreview) {
      updateMoveProfile({
        selected_country_id: countryId,
        active_step: "city_shortlist",
        onboarding_completed: true,
      }).catch(console.error);
    }
  };

  const handleCitySelected = (cityId: string) => {
    update({ selectedCity: cityId });
    void trackEvent("city_selected", {
      cityId,
      countryId: state.selectedCountry,
    });
    next();
    if (!isPreview) {
      updateMoveProfile({
        selected_city_id: cityId,
        active_step: "legal_path",
        onboarding_completed: true,
      }).catch(console.error);
    }
  };

  const handlePathSelected = (pathId: string) => {
    update({ selectedLegalPath: pathId });
    void trackEvent("legal_path_selected", {
      legalPathId: pathId,
      cityId: state.selectedCity,
      countryId: state.selectedCountry,
    });
    void trackEvent("onboarding_completed", {
      legalPathId: pathId,
      cityId: state.selectedCity,
      countryId: state.selectedCountry,
    });
    next();
    if (!isPreview) {
      updateMoveProfile({
        selected_legal_path_id: pathId,
        active_step: "move_plan_ready",
        onboarding_completed: true,
      }).catch(console.error);
    }
  };

  const handleShortlistCountry = (countryId: string) => {
    setState((prev) => {
      const next = prev.shortlistedCountries.includes(countryId)
        ? prev.shortlistedCountries.filter((id) => id !== countryId)
        : [...prev.shortlistedCountries, countryId];
      if (!isPreview) {
        updateMoveProfile({ saved_country_ids: next }).catch(console.error);
      }
      return { ...prev, shortlistedCountries: next };
    });
  };

  const handleShortlistCity = (cityId: string) => {
    setState((prev) => {
      const next = prev.shortlistedCities.includes(cityId)
        ? prev.shortlistedCities.filter((id) => id !== cityId)
        : [...prev.shortlistedCities, cityId];
      if (!isPreview) {
        updateMoveProfile({ saved_city_ids: next }).catch(console.error);
      }
      return { ...prev, shortlistedCities: next };
    });
  };

  const handleOptimizationChange = (patch: Partial<{
    moveOptimization: MoveOptimization;
    safetyImportance: SafetyImportance;
    costTolerance: CostTolerance;
    studyPriority: StudyPriority;
  }>) => {
    update(patch);
  };

  const handleConfirmPlan = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sl_onboarding", JSON.stringify(state));
    }
    if (!isPreview) {
      updateMoveProfile({
        selected_country_id: state.selectedCountry || null,
        selected_city_id: state.selectedCity || null,
        selected_legal_path_id: state.selectedLegalPath || null,
        active_step: "move_plan_ready",
        onboarding_completed: true,
      }).catch(console.error);
    }
    router.push("/app/roadmap");
  };

  // ── Step tree ──────────────────────────────────────────────────────────────
  const stepComponents = [
    <StepWelcome
      key="welcome"
      onStart={handleStartOnboarding}
      resume={profileLoaded ? resumeInfo : null}
      onResume={handleResume}
      showRoadmapCta={showRoadmapCta}
      onOpenRoadmap={handleOpenRoadmap}
      language={state.language}
    />,
    <StepBase
      key="base"
      citizenship={state.citizenship}
      currentCountry={state.currentCountry}
      residenceCountry={state.residenceCountry}
      language={state.language}
      onChange={handleBaseChange}
      onNext={next}
      onBack={back}
    />,
    <StepGoal
      key="goal"
      value={state.moveGoal}
      onChange={(v) => update({ moveGoal: v as MoveGoal })}
      onNext={next}
      onBack={back}
      language={state.language}
    />,
    <StepMoney
      key="money"
      monthlyIncome={state.monthlyIncome}
      savingsRange={state.savingsRange}
      incomeType={state.incomeType}
      onChange={(v) => update(v)}
      onNext={next}
      onBack={back}
      language={state.language}
    />,
    <StepPreferences
      key="prefs"
      selected={state.lifePreferences}
      onChange={(v) => update({ lifePreferences: v as LifePreference[] })}
      onNext={next}
      onBack={back}
      language={state.language}
    />,
    <StepFear
      key="fear"
      value={state.mainFear}
      onChange={(v) => update({ mainFear: v as MainFear })}
      onNext={next}
      onBack={back}
      language={state.language}
    />,
    <StepRegion
      key="region"
      selected={state.regionPreferences}
      onChange={(v) => update({ regionPreferences: v as RegionPreference[] })}
      onNext={next}
      onBack={back}
      language={state.language}
    />,
    <StepOptimization
      key="optimization"
      value={state.moveOptimization}
      moveGoal={state.moveGoal}
      safetyImportance={state.safetyImportance}
      costTolerance={state.costTolerance}
      studyPriority={state.studyPriority}
      onChange={handleOptimizationChange}
      onNext={next}
      onBack={back}
      language={state.language}
    />,
    <StepCountryResults
      key="countries"
      state={state}
      onSelect={handleCountrySelected}
      onShortlistToggle={handleShortlistCountry}
      onBack={back}
      language={state.language}
    />,
    <StepCityResults
      key="cities"
      state={state}
      onSelect={handleCitySelected}
      onShortlistToggle={handleShortlistCity}
      onBack={back}
      language={state.language}
    />,
    <StepLegalPath
      key="paths"
      state={state}
      onSelect={handlePathSelected}
      onBack={back}
      language={state.language}
    />,
    <StepPlanReady
      key="plan-ready"
      state={state}
      onConfirm={handleConfirmPlan}
      onBack={back}
      language={state.language}
    />,
  ];

  const showProgress = state.step > 0 && state.step <= CONTENT_STEPS;
  const progress = Math.round((state.step / CONTENT_STEPS) * 100);

  return (
    <div className="flex flex-1 flex-col">
      {showProgress && (
        <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-[var(--city-border)]">
          <motion.div
            className="h-full bg-stone-700"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-8">
        {!isPreview && (
          <div className="flex justify-end pb-3">
            <SignOutButton variant="ghost" size="sm" className="text-[var(--city-muted-fg)]" />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="flex-1 flex flex-col"
          >
            {stepComponents[state.step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
