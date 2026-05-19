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
    score >= 80 ? "bg-green-100 text-green-700" :
    score >= 65 ? "bg-blue-100 text-blue-700" :
    "bg-muted text-muted-foreground";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${color}`}>
      {score}% fit
    </span>
  );
}

function SplitScore({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  return (
    <div className="rounded-xl bg-muted/60 px-3 py-2">
      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{score}%</div>
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
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{country.emoji}</span>
          <div>
            <h3 className="font-semibold text-base leading-tight">{country.name}</h3>
            <p className="text-xs text-muted-foreground">{country.continent}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <MatchScore score={result.score} />
          <button
            onClick={(e) => { e.stopPropagation(); onShortlist(); }}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            title={shortlisted ? "Remove from shortlist" : "Save to shortlist"}
          >
            {shortlisted
              ? <BookmarkCheck className="h-4 w-4 text-primary" />
              : <Bookmark className="h-4 w-4 text-muted-foreground" />
            }
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{country.summary}</p>

      <div className="grid grid-cols-3 gap-2">
        <SplitScore label="Overall" score={result.overallFit} />
        <SplitScore label="Lifestyle" score={result.lifestyleFit} />
        <SplitScore label="Legal" score={result.legalFit} />
      </div>

      {result.reasons.length > 0 && (
        <div className="flex flex-col gap-1">
          {result.reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs">
              <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}

      {result.challenges.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
          <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-amber-700">
            Main blocker
          </div>
          <div className="flex items-start gap-1.5 text-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
            <span className="text-amber-900">{result.mainBlocker}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-0.5 sm:flex-row">
        <Button size="sm" className="h-10 flex-1 gap-1.5" onClick={onSelect}>
          Choose this destination
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
        <Link href={`/explore/${country.slug}`} target="_blank">
          <Button variant="outline" size="sm" className="h-10 w-full px-3">
            Compare
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
          <Globe className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">Your results</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Your landing shortlist</h2>
        <p className="text-sm text-muted-foreground">
          Ranked by fit with your preferences. Save, compare, then choose the destination you want to pressure-test next.
        </p>
      </div>

      {shortlistedCount >= 2 && (
        <Link
          href={`/compare?${buildCompareQuery(state)}`}
          target="_blank"
          className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
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
