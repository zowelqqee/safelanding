"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle, ArrowRight, Globe, Bookmark, BookmarkCheck, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { matchCountries } from "@/lib/scoring/country-matcher";
import { getCountryById } from "@/lib/data/countries";
import { commonCopy, type UiLanguage } from "@/lib/i18n/onboarding";
import type { OnboardingState, CountryMatchResult } from "@/types";

const COPY = {
  en: {
    kicker: "Your results",
    title: "Your landing shortlist",
    subtitle:
      "Ranked by fit with your preferences. Save, compare, then choose the destination you want to pressure-test next.",
    compare: "Compare",
    shortlistedCountries: "shortlisted countries",
    overall: "Overall",
    lifestyle: "Lifestyle",
    legal: "Legal",
    mainBlocker: "Main blocker",
    choose: "Choose this destination",
    removeTitle: "Remove from shortlist",
    saveTitle: "Save to shortlist",
    adjust: "← Adjust preferences",
  },
  ru: {
    kicker: "Ваши результаты",
    title: "Подборка стран для переезда",
    subtitle:
      "Отсортировано по совпадению с вашим профилем. Сохраняйте, сравнивайте и выбирайте направление для проверки.",
    compare: "Сравнить",
    shortlistedCountries: "сохранённые страны",
    overall: "Общее",
    lifestyle: "Жизнь",
    legal: "Легальный путь",
    mainBlocker: "Главный блокер",
    choose: "Выбрать это направление",
    removeTitle: "Убрать из сохранённых",
    saveTitle: "Сохранить",
    adjust: "← Изменить предпочтения",
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

function SplitScore({ label, score }: { label: string; score: number }) {
  return (
    <div className="rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-3 py-2">
      <div className="city-section-kicker mb-1">{label}</div>
      <div className="text-sm font-semibold text-stone-900">{score}%</div>
    </div>
  );
}

function CountryCard({
  result,
  shortlisted,
  onSelect,
  onShortlist,
  language,
}: {
  result: CountryMatchResult;
  shortlisted: boolean;
  onSelect: () => void;
  onShortlist: () => void;
  language: UiLanguage;
}) {
  const country = getCountryById(result.countryId);
  if (!country) return null;
  const copy = COPY[language];
  const common = commonCopy[language];

  return (
    <div className="city-card rounded-[18px] p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{country.emoji}</span>
          <div>
            <h3 className="font-semibold text-base leading-tight text-stone-900">{country.name}</h3>
            <p className="text-xs text-[var(--city-muted-fg)]">{country.continent}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <MatchScore score={result.score} language={language} />
          <button
            onClick={(e) => { e.stopPropagation(); onShortlist(); }}
            className="p-1.5 rounded-lg hover:bg-[var(--city-warm-muted)] transition-colors"
            title={shortlisted ? copy.removeTitle : copy.saveTitle}
          >
            {shortlisted
              ? <BookmarkCheck className="h-4 w-4 text-stone-700" />
              : <Bookmark className="h-4 w-4 text-[var(--city-muted-fg)]" />
            }
          </button>
        </div>
      </div>

      <p className="text-xs text-[var(--city-muted-fg)] leading-relaxed">{country.summary}</p>

      <div className="grid grid-cols-3 gap-2">
        <SplitScore label={copy.overall} score={result.overallFit} />
        <SplitScore label={copy.lifestyle} score={result.lifestyleFit} />
        <SplitScore label={copy.legal} score={result.legalFit} />
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

      {result.challenges.length > 0 && (
        <div className="rounded-xl border border-amber-200/60 bg-amber-50/60 px-3 py-2.5">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
            {copy.mainBlocker}
          </div>
          <div className="flex items-start gap-1.5 text-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
            <span className="text-amber-900">{result.mainBlocker}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-0.5 sm:flex-row">
        <Button size="sm" className="h-10 flex-1 gap-1.5 rounded-full" onClick={onSelect}>
          {copy.choose}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
        <Link href={`/explore/${country.slug}`} target="_blank">
          <Button variant="outline" size="sm" className="h-10 w-full rounded-full border-[var(--city-border)]">
            {common.explore}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function StepCountryResults({ state, onSelect, onShortlistToggle, onBack, language }: Props) {
  const results = useMemo(
    () =>
      matchCountries({
        lifePreferences: state.lifePreferences,
        moveGoal: state.moveGoal,
        monthlyIncome: state.monthlyIncome,
        regionPreferences: state.regionPreferences,
        moveOptimization: state.moveOptimization,
      }),
    [state]
  );

  const shortlistedCount = state.shortlistedCountries.length;
  const copy = COPY[language];

  return (
    <div className="flex flex-col flex-1 gap-5 pt-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4 text-stone-600" />
          <span className="city-section-kicker">{copy.kicker}</span>
        </div>
        <h2 className="font-serif text-2xl font-medium text-stone-900 mb-1">{copy.title}</h2>
        <p className="text-sm text-[var(--city-muted-fg)]">
          {copy.subtitle}
        </p>
      </div>

      {shortlistedCount >= 2 && (
        <Link
          href={`/compare?${buildCompareQuery(state)}`}
          target="_blank"
          className="flex items-center gap-2 rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-[var(--city-warm-muted)]/70 transition-colors"
        >
          <BarChart3 className="h-4 w-4" />
          {copy.compare} {shortlistedCount} {copy.shortlistedCountries}
          <ArrowRight className="h-3.5 w-3.5 ml-auto" />
        </Link>
      )}

      <div className="flex flex-col gap-3">
        {results.map((result) => (
          <CountryCard
            key={result.countryId}
            result={result}
            shortlisted={state.shortlistedCountries.includes(result.countryId)}
            onSelect={() => onSelect(result.countryId)}
            onShortlist={() => onShortlistToggle(result.countryId)}
            language={language}
          />
        ))}
      </div>

      <div className="pb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
          {copy.adjust}
        </Button>
      </div>
    </div>
  );
}
