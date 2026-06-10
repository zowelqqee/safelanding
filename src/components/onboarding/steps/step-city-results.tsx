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
  MapPin,
  X,
  Heart,
  BarChart3,
  RotateCcw,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { matchCitiesForCountry } from "@/lib/scoring/city-matcher";
import { getCityById } from "@/lib/data/cities";
import { getCountryById } from "@/lib/data/countries";
import { useCityCardViewTracking } from "@/lib/analytics/cityCardView";
import { commonCopy, type UiLanguage } from "@/lib/i18n/onboarding";
import { getCountryDisplay } from "@/lib/i18n/country-display";
import { getCityDisplay, translateCityText } from "@/lib/i18n/city-display";
import type { OnboardingState, CityMatchResult } from "@/types";

const COPY = {
  en: {
    cities: "Cities",
    titleMobile: "Swipe to pick your city",
    titleDesktop: "Pick your city",
    subtitleMobile: "Swipe right to save · left to skip · tap Choose to continue",
    subtitleDesktop: "Drag or use arrow keys · ← skip · → save · Enter to choose",
    choose: "Choose",
    skip: "Skip",
    save: "Save",
    rentFrom: "Rent from",
    budget: "Budget / mo",
    first90: "First 90 days",
    difficulty: "difficulty",
    mainBlocker: "Main blocker",
    pros: "Why it fits",
    risk: "Watch out",
    allDone: "That's all of them",
    allDoneSubtitle: "Here are the cities you saved. Pick one to continue.",
    noSaved: "You didn't save any cities.",
    noSavedHint: "Go back to review the results again.",
    compare: "Compare",
    shortlistedCount: "saved",
    restart: "Review again",
    differentCountry: "← Choose a different country",
    best: "Best match",
    of: "of",
    noMatches: "No city matches are ready here yet",
    noMatchesText: "Choose a different country and we'll keep the rest of your profile intact.",
  },
  ru: {
    cities: "Города",
    titleMobile: "Свайпайте, чтобы выбрать город",
    titleDesktop: "Выберите город",
    subtitleMobile: "Вправо — сохранить · влево — пропустить · «Выбрать» — дальше",
    subtitleDesktop: "Перетащите или используйте стрелки · ← пропустить · → сохранить · Enter выбрать",
    choose: "Выбрать",
    skip: "Пропустить",
    save: "Сохранить",
    rentFrom: "Аренда от",
    budget: "Бюджет / мес",
    first90: "Первые 90 дней",
    difficulty: "сложность",
    mainBlocker: "Главный риск",
    pros: "Почему подходит",
    risk: "Обратите внимание",
    allDone: "Это все варианты",
    allDoneSubtitle: "Вот города, которые вы сохранили. Выберите один, чтобы продолжить.",
    noSaved: "Вы не сохранили ни одного города.",
    noSavedHint: "Вернитесь и просмотрите результаты заново.",
    compare: "Сравнить",
    shortlistedCount: "сохранено",
    restart: "Просмотреть снова",
    differentCountry: "← Выбрать другую страну",
    best: "Лучшее совпадение",
    of: "из",
    noMatches: "Подходящие города для этой страны ещё не готовы",
    noMatchesText: "Выберите другую страну, остальной профиль сохранится.",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

interface Props {
  state: OnboardingState;
  onSelect: (cityId: string) => void;
  onShortlistToggle: (cityId: string) => void;
  onBack: () => void;
  language: UiLanguage;
}

type CityPredictionResponse = {
  results?: CityMatchResult[];
};

function buildCityCompareQuery(state: OnboardingState) {
  const params = new URLSearchParams();
  params.set("type", "city");
  params.set("country", state.selectedCountry);
  params.set("city", state.shortlistedCities.join(","));
  return params.toString();
}

// ─── Single Tinder card ───────────────────────────────────────────────────────

function TinderCityCard({
  result,
  countrySlug,
  position,
  isBest,
  isTop,
  stackOffset,
  onSwipeLeft,
  onSwipeRight,
  onSelect,
  language,
}: {
  result: CityMatchResult;
  countrySlug: string;
  position: number;
  isBest: boolean;
  isTop: boolean;
  stackOffset: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSelect: () => void;
  language: UiLanguage;
}) {
  const city = getCityById(result.cityId);
  const cardRef = useCityCardViewTracking({ cityId: result.cityId, position });
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-16, 16]);
  const saveOpacity = useTransform(x, [20, 100], [0, 1]);
  const skipOpacity = useTransform(x, [-100, -20], [1, 0]);

  if (!city) return null;

  const copy = COPY[language];
  const common = commonCopy[language];
  const cityDisplay = getCityDisplay(city, language);
  const mainBlocker =
    result.mainBlocker === city.main_lifestyle_blocker
      ? cityDisplay.mainLifestyleBlocker
      : translateCityText(result.mainBlocker, language);

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
      ref={cardRef}
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
              ★ {copy.best}
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-semibold leading-tight text-stone-900 sm:text-2xl">
                {cityDisplay.name}
              </h2>
              {(city.housingAvgRent || city.monthlyBudgetMin) && (
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--city-muted-fg)]">
                  {city.housingAvgRent && (
                    <span>{copy.rentFrom} {city.housingAvgRent}</span>
                  )}
                  {city.housingAvgRent && city.monthlyBudgetMin && (
                    <span className="text-stone-300">·</span>
                  )}
                  {city.monthlyBudgetMin && (
                    <span>{copy.budget} {city.monthlyBudgetMin}</span>
                  )}
                </div>
              )}
            </div>
            <span className={`mt-1 shrink-0 rounded-full border px-2.5 py-1 text-sm font-bold ${scoreColor}`}>
              {result.score}%
            </span>
          </div>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-3 py-2">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--city-muted-fg)]">
                {copy.first90}
              </div>
              <div className="text-sm font-bold text-stone-900">
                {result.first90DaysDifficulty}/5 {copy.difficulty}
              </div>
            </div>
            <div className="rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-3 py-2">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--city-muted-fg)]">
                {copy.mainBlocker}
              </div>
              <div className="text-sm font-bold leading-tight text-stone-900">{mainBlocker}</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="flex-shrink-0 px-5 pb-3">
          <p className="text-sm leading-relaxed text-[var(--city-muted-fg)]">{cityDisplay.summary}</p>
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
                  <span className="text-stone-800">{translateCityText(r, language)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk */}
        {result.risks.length > 0 && (() => {
          const r = result.risks[0];
          const riskIndex = city.watch_out.indexOf(r);
          const riskText =
            riskIndex >= 0
              ? cityDisplay.watchOut[riskIndex] ?? cityDisplay.watchOut[0]
              : translateCityText(r, language);
          return (
            <div className="mx-5 mb-3 flex-shrink-0 rounded-xl border border-amber-200/60 bg-amber-50/60 px-3 py-2.5">
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                {copy.risk}
              </div>
              <div className="flex items-start gap-1.5 text-xs">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span className="text-amber-900">{riskText}</span>
              </div>
            </div>
          );
        })()}

        {/* Card CTA */}
        <div className="mt-auto flex-shrink-0 px-5 pb-5 pt-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-11 flex-1 gap-1.5 rounded-full text-sm font-semibold"
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
            >
              {copy.choose} {cityDisplay.name}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Link
              href={`/explore/${countrySlug}/${city.slug}`}
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
  countrySlug,
  state,
  onSelect,
  onRestart,
  onBack,
  language,
}: {
  savedIds: string[];
  results: CityMatchResult[];
  countrySlug: string;
  state: OnboardingState;
  onSelect: (id: string) => void;
  onRestart: () => void;
  onBack: () => void;
  language: UiLanguage;
}) {
  const copy = COPY[language];
  const common = commonCopy[language];
  const savedResults = results.filter((r) => savedIds.includes(r.cityId));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 pt-2"
    >
      <div>
        <div className="mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-stone-600" />
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
          href={`/compare?${buildCityCompareQuery(state)}`}
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
          const city = getCityById(result.cityId);
          if (!city) return null;
          const cityDisplay = getCityDisplay(city, language);
          const scoreColor =
            result.score >= 80
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : result.score >= 65
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-stone-100 text-stone-600 border-stone-200";
          return (
            <div key={result.cityId} className="city-card rounded-[18px] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-base leading-tight text-stone-900">
                    {cityDisplay.name}
                  </h3>
                  {city.housingAvgRent && (
                    <p className="mt-0.5 text-xs text-[var(--city-muted-fg)]">
                      {copy.rentFrom} {city.housingAvgRent}
                    </p>
                  )}
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${scoreColor}`}>
                  {result.score}%
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-9 flex-1 gap-1.5 rounded-full text-xs font-semibold"
                  onClick={() => onSelect(result.cityId)}
                >
                  {copy.choose}
                  <ArrowRight className="h-3 w-3" />
                </Button>
                <Link href={`/explore/${countrySlug}/${city.slug}`} target="_blank">
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
          {copy.differentCountry}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function StepCityResults({ state, onSelect, onShortlistToggle, onBack, language }: Props) {
  const country = getCountryById(state.selectedCountry);
  const countryDisplay = country ? getCountryDisplay(country, language) : null;
  const countrySlug = country?.slug ?? state.selectedCountry;
  const copy = COPY[language];

  const predictionRequest = useMemo(
    () => ({
      countryId: state.selectedCountry,
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
    [
      state.selectedCountry, state.citizenship, state.currentCountry, state.residenceCountry,
      state.language, state.moveGoal, state.monthlyIncome, state.savingsRange, state.incomeType,
      state.lifePreferences, state.mainFear, state.regionPreferences, state.moveOptimization,
      state.safetyImportance, state.costTolerance, state.studyPriority,
    ]
  );
  const predictionRequestKey = useMemo(() => JSON.stringify(predictionRequest), [predictionRequest]);

  const fallbackResults = useMemo(
    () =>
      matchCitiesForCountry({
        countryId: predictionRequest.countryId,
        lifePreferences: predictionRequest.lifePreferences,
        moveGoal: predictionRequest.moveGoal,
        monthlyIncome: predictionRequest.monthlyIncome,
      }),
    [
      predictionRequest.countryId, predictionRequest.lifePreferences,
      predictionRequest.moveGoal, predictionRequest.monthlyIncome,
    ]
  );

  const [modelResults, setModelResults] = useState<{
    key: string;
    results: CityMatchResult[];
  } | null>(null);

  useEffect(() => {
    if (!predictionRequest.countryId) return;

    const controller = new AbortController();
    let cancelled = false;

    fetch("/api/city-predictions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(predictionRequest),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json() as Promise<CityPredictionResponse>;
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
    if (!state.shortlistedCities.includes(id)) onShortlistToggle(id);
    advance();
  }, [state.shortlistedCities, onShortlistToggle, advance]);

  const handleSwipeLeft = useCallback(() => advance(), [advance]);

  // Keyboard navigation for desktop
  useEffect(() => {
    if (done || total === 0) return;
    const handleKey = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "BUTTON", "A"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === "ArrowLeft") handleSwipeLeft();
      else if (e.key === "ArrowRight") handleSwipeRight(visibleResults[currentIndex].cityId);
      else if (e.key === "Enter") onSelect(visibleResults[currentIndex].cityId);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [done, currentIndex, visibleResults, handleSwipeLeft, handleSwipeRight, onSelect, total]);

  if (total === 0) {
    return (
      <div className="flex flex-1 flex-col gap-5 pt-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-stone-600" />
            <span className="city-section-kicker">
              {country && countryDisplay ? `${country.emoji} ${countryDisplay.name}` : copy.cities}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-medium text-stone-900">{copy.titleDesktop}</h2>
        </div>
        <div className="city-card rounded-2xl border-dashed px-4 py-8 text-center">
          <p className="text-sm font-medium text-stone-900">{copy.noMatches}</p>
          <p className="mt-2 text-sm text-[var(--city-muted-fg)]">{copy.noMatchesText}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
          {copy.differentCountry}
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <DoneScreen
        savedIds={state.shortlistedCities}
        results={visibleResults}
        countrySlug={countrySlug}
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

      {/* Header */}
      <div>
        <div className="mb-1 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-stone-600" />
          <span className="city-section-kicker">
            {country && countryDisplay ? `${country.emoji} ${countryDisplay.name}` : copy.cities}
          </span>
        </div>
        <h2 className="font-serif text-xl font-medium text-stone-900 sm:text-2xl">
          <span className="sm:hidden">{copy.titleMobile}</span>
          <span className="hidden sm:inline">{copy.titleDesktop}</span>
        </h2>
        <p className="mt-1 text-xs text-[var(--city-muted-fg)] sm:hidden">
          {copy.subtitleMobile}
        </p>
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

      {/* Card stack */}
      <div
        className="relative w-full"
        style={{ height: "clamp(400px, 58svh, 560px)" }}
      >
        <AnimatePresence>
          {(() => {
            const sliced = visibleResults.slice(currentIndex, currentIndex + 3);
            const count = sliced.length;
            return sliced
              .reverse()
              .map((result, reverseIdx) => {
                const stackOffset = (count - 1) - reverseIdx;
                const isTop = stackOffset === 0;
                return (
                  <TinderCityCard
                    key={result.cityId}
                    result={result}
                    countrySlug={countrySlug}
                    position={currentIndex + (count - 1 - reverseIdx) + 1}
                    isBest={currentIndex === 0 && isTop}
                    isTop={isTop}
                    stackOffset={stackOffset}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={() => handleSwipeRight(result.cityId)}
                    onSelect={() => onSelect(result.cityId)}
                    language={language}
                  />
                );
              });
          })()}
        </AnimatePresence>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-center gap-4 pb-1 sm:gap-6">
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

        <button
          onClick={() => currentResult && handleSwipeRight(currentResult.cityId)}
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
        {copy.differentCountry}
      </Button>
    </div>
  );
}
