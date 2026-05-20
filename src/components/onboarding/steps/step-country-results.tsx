"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle, ArrowRight, Globe, Bookmark, BookmarkCheck, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { matchCountries } from "@/lib/scoring/country-matcher";
import { getCountryById } from "@/lib/data/countries";
import type { OnboardingState, CountryMatchResult } from "@/types";

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
}

function MatchScore({ score }: { score: number }) {
  const color =
    score >= 80 ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
    score >= 65 ? "border-[var(--city-border)] bg-[var(--city-warm-muted)] text-stone-700" :
    "border-[var(--city-border)] bg-[var(--city-warm-muted)] text-[var(--city-muted-fg)]";
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${color}`}>
      {score}% fit
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
}: {
  result: CountryMatchResult;
  shortlisted: boolean;
  onSelect: () => void;
  onShortlist: () => void;
}) {
  const country = getCountryById(result.countryId);
  if (!country) return null;

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
          <MatchScore score={result.score} />
          <button
            onClick={(e) => { e.stopPropagation(); onShortlist(); }}
            className="p-1.5 rounded-lg hover:bg-[var(--city-warm-muted)] transition-colors"
            title={shortlisted ? "Remove from shortlist" : "Save to shortlist"}
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
        <SplitScore label="Overall" score={result.overallFit} />
        <SplitScore label="Lifestyle" score={result.lifestyleFit} />
        <SplitScore label="Legal" score={result.legalFit} />
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
            Main blocker
          </div>
          <div className="flex items-start gap-1.5 text-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
            <span className="text-amber-900">{result.mainBlocker}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-0.5 sm:flex-row">
        <Button size="sm" className="h-10 flex-1 gap-1.5 rounded-full" onClick={onSelect}>
          Choose this destination
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
        <Link href={`/explore/${country.slug}`} target="_blank">
          <Button variant="outline" size="sm" className="h-10 w-full rounded-full border-[var(--city-border)]">
            Explore
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function StepCountryResults({ state, onSelect, onShortlistToggle, onBack }: Props) {
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

  return (
    <div className="flex flex-col flex-1 gap-5 pt-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4 text-stone-600" />
          <span className="city-section-kicker">Your results</span>
        </div>
        <h2 className="font-serif text-2xl font-medium text-stone-900 mb-1">Your landing shortlist</h2>
        <p className="text-sm text-[var(--city-muted-fg)]">
          Ranked by fit with your preferences. Save, compare, then choose the destination you want to pressure-test next.
        </p>
      </div>

      {shortlistedCount >= 2 && (
        <Link
          href={`/compare?${buildCompareQuery(state)}`}
          target="_blank"
          className="flex items-center gap-2 rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-[var(--city-warm-muted)]/70 transition-colors"
        >
          <BarChart3 className="h-4 w-4" />
          Compare {shortlistedCount} shortlisted countries
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
          />
        ))}
      </div>

      <div className="pb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
          ← Adjust preferences
        </Button>
      </div>
    </div>
  );
}
