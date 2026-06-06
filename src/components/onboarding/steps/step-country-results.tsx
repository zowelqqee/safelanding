"use client";

import { useEffect, useMemo, useCallback, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Globe,
  X,
  Heart,
  BarChart3,
  Sparkles,
  RotateCcw,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { matchCountries } from "@/lib/scoring/country-matcher";
import { getCountryById } from "@/lib/data/countries";
import { commonCopy, type UiLanguage } from "@/lib/i18n/onboarding";
import type { OnboardingState, CountryMatchResult } from "@/types";

const COPY = {
  en: {
    kicker: "Your matches",
    titleMobile: "Swipe to build your shortlist",
    titleDesktop: "Pick your shortlist",
    subtitleMobile: "Swipe right to save · left to skip · tap Choose to continue",
    subtitleDesktop: "Drag or use arrow keys · ← skip · → save · Enter to choose",
    choose: "Choose",
    skip: "Skip",
    save: "Save",
    pros: "Why it fits",
    cons: "Watch out",
    overall: "Overall",
    lifestyle: "Life",
    legal: "Legal",
    allDone: "That's all of them",
    allDoneSubtitle: "Here are the countries you saved. Pick one to continue.",
    noSaved: "You didn't save any countries.",
    noSavedHint: "Go back to review the results again.",
    compare: "Compare",
    shortlistedCount: "saved",
    restart: "Review again",
    adjust: "← Adjust preferences",
    best: "Best match",
    of: "of",
    keys: "← / → keys · Enter to choose",
  },
  ru: {
    kicker: "Ваши совпадения",
    titleMobile: "Свайпайте, чтобы составить список",
    titleDesktop: "Выберите направления",
    subtitleMobile: "Вправо — сохранить · влево — пропустить · «Выбрать» — дальше",
    subtitleDesktop: "Перетащите или используйте стрелки · ← пропустить · → сохранить · Enter выбрать",
    choose: "Выбрать",
    skip: "Пропустить",
    save: "Сохранить",
    pros: "Почему подходит",
    cons: "Обратите внимание",
    overall: "Итого",
    lifestyle: "Жизнь",
    legal: "Виза/ВНЖ",
    allDone: "Это все варианты",
    allDoneSubtitle: "Вот страны, которые вы сохранили. Выберите одну, чтобы продолжить.",
    noSaved: "Вы не сохранили ни одной страны.",
    noSavedHint: "Вернитесь и просмотрите результаты заново.",
    compare: "Сравнить",
    shortlistedCount: "сохранено",
    restart: "Просмотреть снова",
    adjust: "← Изменить предпочтения",
    best: "Лучшее совпадение",
    of: "из",
    keys: "← / → клавиши · Enter — выбрать",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

function buildCompareQuery(state: OnboardingState) {
  const params = new URLSearchParams();
  params.set("type", "country");
  params.set("c", state.shortlistedCountries.join(","));
  if (state.moveGoal) params.set("goal", state.moveGoal);
  if (state.monthlyIncome) params.set("income", state.monthlyIncome);
  if (state.lifePreferences.length > 0) params.set("prefs", state.lifePreferences.join(","));
  if (state.regionPreferences.length > 0) params.set("regions", state.regionPreferences.join(","));
  if (state.moveOptimization) params.set("opt", state.moveOptimization);
  return params.toString();
}

interface Props {
  state: OnboardingState;
  onSelect: (countryId: string) => void;
  onShortlistToggle: (countryId: string) => void;
  onBack: () => void;
  language: UiLanguage;
}

type CountryPredictionResponse = {
  results?: CountryMatchResult[];
};

// ─── Single Tinder card ───────────────────────────────────────────────────────

function TinderCard({
  result,
  isBest,
  isTop,
  stackOffset,
  onSwipeLeft,
  onSwipeRight,
  onSelect,
  language,
}: {
  result: CountryMatchResult;
  isBest: boolean;
  isTop: boolean;
  stackOffset: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSelect: () => void;
  language: UiLanguage;
}) {
  const country = getCountryById(result.countryId);
  if (!country) return null;

  const copy = COPY[language];
  const common = commonCopy[language];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-16, 16]);
  const saveOpacity = useTransform(x, [20, 100], [0, 1]);
  const skipOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    if (info.offset.x > 110 || info.velocity.x > 500) {
      animate(x, 700, { duration: 0.28, ease: "easeOut" }).then(onSwipeRight);
    } else if (info.offset.x < -110 || info.velocity.x < -500) {
      animate(x, -700, { duration: 0.28, ease: "easeOut" }).then(onSwipeLeft);
    } else {
      animate(x, 0, { type: "spring", stiffness: 350, damping: 28 });
    }
  };

  const scoreColor =
    result.score >= 80
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : result.score >= 65
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-stone-100 text-stone-600 border-stone-200";

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale: 1 - stackOffset * 0.04,
        y: stackOffset * 10,
        zIndex: 10 - stackOffset,
      }}
      drag={isTop ? "x" : false}
      dragElastic={0.65}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={isTop ? handleDragEnd : undefined}
      className="absolute inset-0 city-card rounded-[22px] overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
    >
      {/* Save overlay */}
      {isTop && (
        <motion.div
          style={{ opacity: saveOpacity }}
          className="pointer-events-none absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full border-2 border-emerald-500 bg-white/95 px-3 py-1.5 shadow-sm"
        >
          <Heart className="h-4 w-4 fill-emerald-500 text-emerald-500" />
          <span className="text-sm font-bold uppercase tracking-wide text-emerald-700">
            {copy.save}
          </span>
        </motion.div>
      )}

      {/* Skip overlay */}
      {isTop && (
        <motion.div
          style={{ opacity: skipOpacity }}
          className="pointer-events-none absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border-2 border-rose-400 bg-white/95 px-3 py-1.5 shadow-sm"
        >
          <X className="h-4 w-4 text-rose-500" />
          <span className="text-sm font-bold uppercase tracking-wide text-rose-500">
            {copy.skip}
          </span>
        </motion.div>
      )}

      {/* Scrollable content */}
      <div className="flex h-full flex-col overflow-y-auto overscroll-contain">
        {/* Header */}
        <div className="flex-shrink-0 px-5 pt-5 pb-3">
          {isBest && (
            <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
              <Sparkles className="h-3 w-3" />
              {copy.best}
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[40px] sm:text-[48px] leading-none">{country.emoji}</span>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-semibold leading-tight text-stone-900">
                  {country.name}
                </h2>
                <p className="mt-0.5 text-xs text-[var(--city-muted-fg)]">{country.continent}</p>
              </div>
            </div>
            <span className={`mt-1 shrink-0 rounded-full border px-2.5 py-1 text-sm font-bold ${scoreColor}`}>
              {result.score}%
            </span>
          </div>

          {/* Score cells */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: copy.overall, val: result.overallFit },
              { label: copy.lifestyle, val: result.lifestyleFit },
              { label: copy.legal, val: result.legalFit },
            ].map(({ label, val }) => (
              <div
                key={label}
                className="rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-2.5 py-2"
              >
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--city-muted-fg)]">
                  {label}
                </div>
                <div className="text-sm font-bold text-stone-900">{val}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="flex-shrink-0 px-5 pb-3">
          <p className="text-sm leading-relaxed text-[var(--city-muted-fg)]">{country.summary}</p>
        </div>

        {/* Pros */}
        {result.reasons.length > 0 && (
          <div className="flex-shrink-0 px-5 pb-3">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">
              {copy.pros}
            </div>
            <div className="flex flex-col gap-1.5">
              {result.reasons.slice(0, 3).map((r, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span className="text-stone-800">{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cons */}
        {result.challenges.length > 0 && (
          <div className="mx-5 mb-3 flex-shrink-0 rounded-xl border border-amber-200/60 bg-amber-50/60 px-3 py-2.5">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
              {copy.cons}
            </div>
            <div className="flex flex-col gap-1.5">
              {result.challenges.slice(0, 2).map((c, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <span className="text-amber-900">{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card CTA */}
        <div className="mt-auto flex-shrink-0 px-5 pb-5 pt-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-11 flex-1 gap-1.5 rounded-full text-sm font-semibold"
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
            >
              {copy.choose} {country.name}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Link
              href={`/explore/${country.slug}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outline"
                size="sm"
                className="h-11 rounded-full border-[var(--city-border)] text-xs px-4"
              >
                {common.explore}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Done screen ──────────────────────────────────────────────────────────────

function DoneScreen({
  savedIds,
  results,
  state,
  onSelect,
  onRestart,
  onBack,
  language,
}: {
  savedIds: string[];
  results: CountryMatchResult[];
  state: OnboardingState;
  onSelect: (id: string) => void;
  onRestart: () => void;
  onBack: () => void;
  language: UiLanguage;
}) {
  const copy = COPY[language];
  const common = commonCopy[language];
  const savedResults = results.filter((r) => savedIds.includes(r.countryId));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 pt-2"
    >
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Globe className="h-4 w-4 text-stone-600" />
          <span className="city-section-kicker">{copy.allDone}</span>
        </div>
        <p className="text-sm text-[var(--city-muted-fg)]">
          {savedResults.length > 0 ? copy.allDoneSubtitle : copy.noSaved}
        </p>
        {savedResults.length === 0 && (
          <p className="mt-1 text-xs text-[var(--city-muted-fg)]">{copy.noSavedHint}</p>
        )}
      </div>

      {savedIds.length >= 2 && (
        <Link
          href={`/compare?${buildCompareQuery(state)}`}
          target="_blank"
          className="flex items-center gap-2 rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-[var(--city-warm-muted)]/70 transition-colors"
        >
          <BarChart3 className="h-4 w-4" />
          {copy.compare} {savedIds.length} {copy.shortlistedCount}
          <ArrowRight className="h-3.5 w-3.5 ml-auto" />
        </Link>
      )}

      <div className="flex flex-col gap-3">
        {savedResults.map((result) => {
          const country = getCountryById(result.countryId);
          if (!country) return null;
          const scoreColor =
            result.score >= 80
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : result.score >= 65
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-stone-100 text-stone-600 border-stone-200";
          return (
            <div key={result.countryId} className="city-card rounded-[18px] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{country.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-base leading-tight text-stone-900">
                      {country.name}
                    </h3>
                    <p className="text-xs text-[var(--city-muted-fg)]">{country.continent}</p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${scoreColor}`}>
                  {result.score}%
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-9 flex-1 gap-1.5 rounded-full text-xs font-semibold"
                  onClick={() => onSelect(result.countryId)}
                >
                  {copy.choose}
                  <ArrowRight className="h-3 w-3" />
                </Button>
                <Link href={`/explore/${country.slug}`} target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-full border-[var(--city-border)] text-xs"
                  >
                    {common.explore}
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 pb-6">
        <Button variant="outline" size="sm" onClick={onRestart} className="gap-1.5 rounded-full">
          <RotateCcw className="h-3.5 w-3.5" />
          {copy.restart}
        </Button>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
          {copy.adjust}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function StepCountryResults({ state, onSelect, onShortlistToggle, onBack, language }: Props) {
  const predictionRequest = useMemo(
    () => ({
      citizenship: state.citizenship,
      currentCountry: state.currentCountry,
      residenceCountry: state.residenceCountry,
      language: state.language,
      moveGoal: state.moveGoal,
      monthlyIncome: state.monthlyIncome,
      savingsRange: state.savingsRange,
      incomeType: state.incomeType,
      lifePreferences: state.lifePreferences,
      mainFear: state.mainFear,
      regionPreferences: state.regionPreferences,
      moveOptimization: state.moveOptimization,
      safetyImportance: state.safetyImportance,
      costTolerance: state.costTolerance,
      studyPriority: state.studyPriority,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state.citizenship, state.currentCountry, state.residenceCountry, state.language,
      state.moveGoal, state.monthlyIncome, state.savingsRange, state.incomeType,
      state.lifePreferences, state.mainFear, state.regionPreferences, state.moveOptimization,
      state.safetyImportance, state.costTolerance, state.studyPriority,
    ]
  );
  const predictionRequestKey = useMemo(() => JSON.stringify(predictionRequest), [predictionRequest]);

  const fallbackResults = useMemo(
    () =>
      matchCountries({
        language: predictionRequest.language,
        citizenship: predictionRequest.citizenship,
        currentCountry: predictionRequest.currentCountry,
        residenceCountry: predictionRequest.residenceCountry,
        lifePreferences: predictionRequest.lifePreferences,
        moveGoal: predictionRequest.moveGoal,
        monthlyIncome: predictionRequest.monthlyIncome,
        savingsRange: predictionRequest.savingsRange,
        incomeType: predictionRequest.incomeType,
        mainFear: predictionRequest.mainFear,
        regionPreferences: predictionRequest.regionPreferences,
        moveOptimization: predictionRequest.moveOptimization,
        safetyImportance: predictionRequest.safetyImportance,
        costTolerance: predictionRequest.costTolerance,
        studyPriority: predictionRequest.studyPriority,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      predictionRequest.lifePreferences, predictionRequest.language, predictionRequest.citizenship,
      predictionRequest.currentCountry, predictionRequest.residenceCountry, predictionRequest.moveGoal,
      predictionRequest.monthlyIncome, predictionRequest.savingsRange, predictionRequest.incomeType,
      predictionRequest.mainFear, predictionRequest.regionPreferences, predictionRequest.moveOptimization,
      predictionRequest.safetyImportance, predictionRequest.costTolerance, predictionRequest.studyPriority,
    ]
  );

  const [modelResults, setModelResults] = useState<{
    key: string;
    results: CountryMatchResult[];
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    fetch("/api/country-predictions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(predictionRequest),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json() as Promise<CountryPredictionResponse>;
      })
      .then((payload) => {
        if (!cancelled && Array.isArray(payload.results)) {
          setModelResults({ key: predictionRequestKey, results: payload.results });
        }
      })
      .catch((err: Error) => {
        if (!cancelled && err.name !== "AbortError") {
          setModelResults((cur) => (cur?.key === predictionRequestKey ? null : cur));
        }
      });

    return () => { cancelled = true; controller.abort(); };
  }, [predictionRequest, predictionRequestKey]);

  const results =
    modelResults?.key === predictionRequestKey ? modelResults.results : fallbackResults;
  const visibleResults = results.slice(0, 5);

  const copy = COPY[language];
  const total = visibleResults.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [done, setDone] = useState(false);

  const advance = useCallback(() => {
    setCurrentIndex((i) => {
      const next = i + 1;
      if (next >= total) { setDone(true); return i; }
      return next;
    });
  }, [total]);

  const handleSwipeRight = useCallback((id: string) => {
    if (!state.shortlistedCountries.includes(id)) onShortlistToggle(id);
    advance();
  }, [state.shortlistedCountries, onShortlistToggle, advance]);

  const handleSwipeLeft = useCallback(() => advance(), [advance]);

  // Keyboard navigation for desktop
  useEffect(() => {
    if (done || total === 0) return;
    const handleKey = (e: KeyboardEvent) => {
      // Don't trigger if focus is on an input/button
      if (["INPUT", "TEXTAREA", "BUTTON", "A"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === "ArrowLeft") handleSwipeLeft();
      else if (e.key === "ArrowRight") handleSwipeRight(visibleResults[currentIndex].countryId);
      else if (e.key === "Enter") onSelect(visibleResults[currentIndex].countryId);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [done, currentIndex, visibleResults, handleSwipeLeft, handleSwipeRight, onSelect, total]);

  if (done) {
    return (
      <DoneScreen
        savedIds={state.shortlistedCountries}
        results={visibleResults}
        state={state}
        onSelect={onSelect}
        onRestart={() => { setCurrentIndex(0); setDone(false); }}
        onBack={onBack}
        language={language}
      />
    );
  }

  const currentResult = visibleResults[currentIndex];

  return (
    <div className="flex flex-1 flex-col gap-3 pt-4 sm:gap-4">

      {/* Header — compact on mobile, spacious on desktop */}
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Globe className="h-4 w-4 text-stone-600" />
          <span className="city-section-kicker">{copy.kicker}</span>
        </div>
        <h2 className="font-serif text-xl font-medium text-stone-900 sm:text-2xl">
          <span className="sm:hidden">{copy.titleMobile}</span>
          <span className="hidden sm:inline">{copy.titleDesktop}</span>
        </h2>
        <p className="mt-1 text-xs text-[var(--city-muted-fg)] sm:hidden">
          {copy.subtitleMobile}
        </p>
        {/* Desktop hint */}
        <p className="mt-1 hidden items-center gap-1.5 text-xs text-[var(--city-muted-fg)] sm:flex">
          <Keyboard className="h-3.5 w-3.5 shrink-0" />
          {copy.subtitleDesktop}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {visibleResults.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i < currentIndex
                ? "w-3 bg-stone-300"
                : i === currentIndex
                ? "w-5 bg-stone-800"
                : "w-3 bg-stone-200"
            }`}
          />
        ))}
        <span className="ml-auto text-xs text-[var(--city-muted-fg)]">
          {currentIndex + 1} {copy.of} {total}
        </span>
      </div>

      {/* Card stack — shorter on mobile, taller on desktop */}
      <div
        className="relative w-full"
        style={{ height: "clamp(400px, 58svh, 560px)" }}
      >
        <AnimatePresence>
          {visibleResults
            .slice(currentIndex, currentIndex + 3)
            .reverse()
            .map((result, reverseIdx) => {
              const stackOffset = 2 - reverseIdx;
              const isTop = stackOffset === 0;
              return (
                <TinderCard
                  key={result.countryId}
                  result={result}
                  isBest={currentIndex === 0 && isTop}
                  isTop={isTop}
                  stackOffset={stackOffset}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={() => handleSwipeRight(result.countryId)}
                  onSelect={() => onSelect(result.countryId)}
                  language={language}
                />
              );
            })}
        </AnimatePresence>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 pb-1">
        {/* Skip */}
        <button
          onClick={handleSwipeLeft}
          className="group flex flex-col items-center gap-1"
          title={copy.skip}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-rose-200 bg-white shadow-sm transition-all group-hover:border-rose-400 group-hover:shadow-md group-active:scale-95 sm:h-16 sm:w-16">
            <X className="h-6 w-6 text-rose-400 sm:h-7 sm:w-7" />
          </span>
          <span className="hidden text-[11px] font-medium text-stone-400 sm:block">{copy.skip}</span>
        </button>

        {/* Save / shortlist */}
        <button
          onClick={() => currentResult && handleSwipeRight(currentResult.countryId)}
          className="group flex flex-col items-center gap-1"
          title={copy.save}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-200 bg-white shadow-sm transition-all group-hover:border-emerald-400 group-hover:shadow-md group-active:scale-95 sm:h-16 sm:w-16">
            <Heart className="h-6 w-6 text-emerald-500 sm:h-7 sm:w-7" />
          </span>
          <span className="hidden text-[11px] font-medium text-stone-400 sm:block">{copy.save}</span>
        </button>
      </div>

      <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground pb-4">
        {copy.adjust}
      </Button>
    </div>
  );
}
