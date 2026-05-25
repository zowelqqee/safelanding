"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle, ArrowRight, MapPin, Bookmark, BookmarkCheck, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { matchCitiesForCountry } from "@/lib/scoring/city-matcher";
import { getCityById } from "@/lib/data/cities";
import { getCountryById } from "@/lib/data/countries";
import { commonCopy, type UiLanguage } from "@/lib/i18n/onboarding";
import type { OnboardingState, CityMatchResult } from "@/types";

const COPY = {
  en: {
    cities: "Cities",
    title: "Choose your city",
    subtitle:
      "Matched to your preferences. Save, compare, then choose the city that feels most realistic.",
    rentFrom: "Rent from",
    budget: "Budget",
    first90: "First 90 days",
    difficulty: "difficulty",
    mainBlocker: "Main blocker",
    choose: "Choose this destination",
    compare: "Compare",
    shortlistedCities: "shortlisted cities",
    noMatches: "No city matches are ready here yet",
    noMatchesText: "Choose a different country and we'll keep the rest of your profile intact.",
    differentCountry: "← Choose a different country",
  },
  ru: {
    cities: "Города",
    title: "Выберите город",
    subtitle:
      "Подобрано под ваши предпочтения. Сохраняйте, сравнивайте и выбирайте самый реалистичный город.",
    rentFrom: "Аренда от",
    budget: "Бюджет",
    first90: "Первые 90 дней",
    difficulty: "сложность",
    mainBlocker: "Главный блокер",
    choose: "Выбрать этот город",
    compare: "Сравнить",
    shortlistedCities: "сохранённые города",
    noMatches: "Подходящие города для этой страны ещё не готовы",
    noMatchesText: "Выберите другую страну, остальной профиль сохранится.",
    differentCountry: "← Выбрать другую страну",
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

function MatchScore({ score, language }: { score: number; language: UiLanguage }) {
  const common = commonCopy[language];
  const color =
    score >= 80 ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
    score >= 65 ? "border-[var(--city-border)] bg-[var(--city-warm-muted)] text-stone-700" :
    "border-[var(--city-border)] bg-[var(--city-warm-muted)] text-[var(--city-muted-fg)]";
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${color}`}>
      {score}% {common.fit}
    </span>
  );
}

function CityCard({
  result,
  countrySlug,
  shortlisted,
  onSelect,
  onShortlist,
  language,
}: {
  result: CityMatchResult;
  countrySlug: string;
  shortlisted: boolean;
  onSelect: () => void;
  onShortlist: () => void;
  language: UiLanguage;
}) {
  const city = getCityById(result.cityId);
  if (!city) return null;
  const copy = COPY[language];
  const common = commonCopy[language];

  return (
    <div className="city-card rounded-[18px] p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-base leading-tight text-stone-900">{city.name}</h3>
          <div className="flex items-center gap-2 text-xs text-[var(--city-muted-fg)] mt-0.5">
            {city.housingAvgRent && <span>{copy.rentFrom} {city.housingAvgRent}</span>}
            {city.housingAvgRent && city.monthlyBudgetMin && <span>·</span>}
            {city.monthlyBudgetMin && <span>{copy.budget} {city.monthlyBudgetMin}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <MatchScore score={result.score} language={language} />
          <button
            onClick={(e) => { e.stopPropagation(); onShortlist(); }}
            className="p-1.5 rounded-lg hover:bg-[var(--city-warm-muted)] transition-colors"
          >
            {shortlisted
              ? <BookmarkCheck className="h-4 w-4 text-stone-700" />
              : <Bookmark className="h-4 w-4 text-[var(--city-muted-fg)]" />
            }
          </button>
        </div>
      </div>

      <p className="text-xs text-[var(--city-muted-fg)] leading-relaxed">{city.summary}</p>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-3 py-2">
          <div className="city-section-kicker mb-1">{copy.first90}</div>
          <div className="text-sm font-semibold text-stone-900">
            {result.first90DaysDifficulty}/5 {copy.difficulty}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-3 py-2">
          <div className="city-section-kicker mb-1">{copy.mainBlocker}</div>
          <div className="text-sm font-semibold leading-tight text-stone-900">
            {result.mainBlocker}
          </div>
        </div>
      </div>

      {result.reasons.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {result.reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span className="text-stone-800">{r}</span>
            </div>
          ))}
        </div>
      )}

      {result.risks.slice(0, 1).map((r, i) => (
        <div key={i} className="rounded-xl border border-amber-200/60 bg-amber-50/60 px-3 py-2">
          <div className="flex items-start gap-1.5 text-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
            <span className="text-amber-900">{r}</span>
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-2 pt-0.5 sm:flex-row">
        <Button size="sm" className="h-10 flex-1 gap-1.5 rounded-full" onClick={onSelect}>
          {copy.choose}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
        <Link href={`/explore/${countrySlug}/${city.slug}`} target="_blank">
          <Button variant="outline" size="sm" className="h-10 w-full rounded-full border-[var(--city-border)]">
            {common.explore}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function StepCityResults({ state, onSelect, onShortlistToggle, onBack, language }: Props) {
  const country = getCountryById(state.selectedCountry);
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
      state.selectedCountry,
      state.citizenship,
      state.currentCountry,
      state.residenceCountry,
      state.language,
      state.moveGoal,
      state.monthlyIncome,
      state.savingsRange,
      state.incomeType,
      state.lifePreferences,
      state.mainFear,
      state.regionPreferences,
      state.moveOptimization,
      state.safetyImportance,
      state.costTolerance,
      state.studyPriority,
    ]
  );
  const predictionRequestKey = useMemo(
    () => JSON.stringify(predictionRequest),
    [predictionRequest]
  );

  const fallbackResults = useMemo(
    () =>
      matchCitiesForCountry({
        countryId: predictionRequest.countryId,
        lifePreferences: predictionRequest.lifePreferences,
        moveGoal: predictionRequest.moveGoal,
        monthlyIncome: predictionRequest.monthlyIncome,
      }),
    [
      predictionRequest.countryId,
      predictionRequest.lifePreferences,
      predictionRequest.moveGoal,
      predictionRequest.monthlyIncome,
    ]
  );
  const [modelResults, setModelResults] = useState<{
    key: string;
    results: CityMatchResult[];
  } | null>(null);

  useEffect(() => {
    if (!predictionRequest.countryId) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    fetch("/api/city-predictions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(predictionRequest),
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`City prediction request failed with ${response.status}`);
        }
        return response.json() as Promise<CityPredictionResponse>;
      })
      .then((payload) => {
        if (!cancelled && Array.isArray(payload.results)) {
          setModelResults({
            key: predictionRequestKey,
            results: payload.results,
          });
        }
      })
      .catch((error: Error) => {
        if (!cancelled && error.name !== "AbortError") {
          setModelResults((current) =>
            current?.key === predictionRequestKey ? null : current
          );
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    predictionRequest,
    predictionRequestKey,
  ]);

  const results = modelResults?.key === predictionRequestKey
    ? modelResults.results
    : fallbackResults;

  const shortlistedCount = state.shortlistedCities.length;

  return (
    <div className="flex flex-col flex-1 gap-5 pt-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-stone-600" />
          <span className="city-section-kicker">
            {country ? `${country.emoji} ${country.name}` : copy.cities}
          </span>
        </div>
        <h2 className="font-serif text-2xl font-medium text-stone-900 mb-1">{copy.title}</h2>
        <p className="text-sm text-[var(--city-muted-fg)]">
          {copy.subtitle}
        </p>
      </div>

      {shortlistedCount >= 2 && (
        <Link
          href={`/compare?${buildCityCompareQuery(state)}`}
          target="_blank"
          className="flex items-center gap-2 rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-[var(--city-warm-muted)]/70 transition-colors"
        >
          <BarChart3 className="h-4 w-4" />
          {copy.compare} {shortlistedCount} {copy.shortlistedCities}
          <ArrowRight className="ml-auto h-3.5 w-3.5" />
        </Link>
      )}

      {results.length === 0 ? (
        <div className="city-card rounded-2xl px-4 py-8 text-center border-dashed">
          <p className="text-sm font-medium text-stone-900">
            {copy.noMatches}
          </p>
          <p className="mt-2 text-sm text-[var(--city-muted-fg)]">
            {copy.noMatchesText}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((result) => (
            <CityCard
              key={result.cityId}
              result={result}
              countrySlug={country?.slug ?? state.selectedCountry}
              shortlisted={state.shortlistedCities.includes(result.cityId)}
              onSelect={() => onSelect(result.cityId)}
              onShortlist={() => onShortlistToggle(result.cityId)}
              language={language}
            />
          ))}
        </div>
      )}

      <div className="pb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-[var(--city-muted-fg)]">
          {copy.differentCountry}
        </Button>
      </div>
    </div>
  );
}
