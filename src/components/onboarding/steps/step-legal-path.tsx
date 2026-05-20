"use client";

import { useMemo } from "react";
import { CheckCircle, AlertTriangle, ArrowRight, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scorePathsForCountry } from "@/lib/scoring/path-scorer";
import { getLegalPathById } from "@/lib/data/legal-paths";
import { getCountryById } from "@/lib/data/countries";
import { getCityById } from "@/lib/data/cities";
import type { OnboardingState, PathMatchResult } from "@/types";

const COMPLEXITY_LABEL: Record<number, string> = {
  1: "Simple",
  2: "Moderate",
  3: "Involved",
  4: "Complex",
  5: "Very complex",
};

interface Props {
  state: OnboardingState;
  onSelect: (pathId: string) => void;
  onBack: () => void;
}

function MatchScore({ score }: { score: number }) {
  const color =
    score >= 70 ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
    score >= 45 ? "border-[var(--city-border)] bg-[var(--city-warm-muted)] text-stone-700" :
    "border-[var(--city-border)] bg-[var(--city-warm-muted)] text-[var(--city-muted-fg)]";
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${color}`}>
      {score}% fit
    </span>
  );
}

function PathCard({
  result,
  onSelect,
}: {
  result: PathMatchResult;
  onSelect: () => void;
}) {
  const path = getLegalPathById(result.pathId);
  if (!path) return null;

  return (
    <div className="city-card rounded-[18px] p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-tight text-stone-900">{path.name}</h3>
          <p className="text-xs text-[var(--city-muted-fg)] mt-0.5 leading-relaxed">{path.summary}</p>
        </div>
        <MatchScore score={result.score} />
      </div>

      <div className="flex items-center gap-3 text-xs text-[var(--city-muted-fg)]">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {path.estimatedPreparationTime}
        </span>
        <span className="flex items-center gap-1">
          <Shield className="h-3.5 w-3.5" />
          {COMPLEXITY_LABEL[path.complexity]}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {path.requires_remote_income && (
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] text-stone-700">
            Remote income needed
          </span>
        )}
        {path.requires_admission && (
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] text-stone-700">
            Admission needed
          </span>
        )}
        {(path.requires_local_employer || path.requires_sponsor) && (
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] text-stone-700">
            Sponsor or employer needed
          </span>
        )}
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

      {result.weakPoints.length > 0 && (
        <div className="rounded-xl border border-amber-200/60 bg-amber-50/60 px-3 py-2.5">
          <div className="flex flex-col gap-1.5">
            {result.weakPoints.map((w, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-amber-900">{w}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!path.journeyAvailable && (
        <div className="text-xs text-[var(--city-muted-fg)] bg-[var(--city-warm-muted)] border border-[var(--city-border)] px-3 py-1.5 rounded-lg">
          Full step-by-step journey for this path is coming soon.
        </div>
      )}

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
        {path.legal_disclaimer}
      </div>

      <Button size="sm" className="h-10 gap-1.5 rounded-full" onClick={onSelect}>
        Choose this legal path
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function StepLegalPath({ state, onSelect, onBack }: Props) {
  const country = getCountryById(state.selectedCountry);
  const city = getCityById(state.selectedCity);

  const results = useMemo(
    () =>
      scorePathsForCountry(state.selectedCountry, {
        worksRemotely: state.moveGoal === "remote_work" ? true : state.moveGoal === "study" ? false : null,
        foreignIncome: state.moveGoal === "remote_work" ? true : null,
        monthlyIncome: state.monthlyIncome,
        hasSavings: state.savingsRange !== "" && state.savingsRange !== "under_3000",
        readyToStudy: state.moveGoal === "study",
        hasAdmission: null,
        moveSoon: state.moveGoal === "explore_first" ? false : null,
        movingWithFamily: state.moveGoal === "family",
      }),
    [state]
  );

  return (
    <div className="flex flex-col flex-1 gap-5 pt-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-stone-600" />
          <span className="city-section-kicker">
            {country?.emoji} {country?.name}{city ? ` · ${city.name}` : ""}
          </span>
        </div>
        <h2 className="font-serif text-2xl font-medium text-stone-900 mb-1">Choose your legal path</h2>
        <p className="text-sm text-[var(--city-muted-fg)]">
          These paths are available for {country?.name ?? "your destination"}. Choose the one that fits your situation best.
        </p>
      </div>

      <div className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 leading-relaxed">
        This is a fit assessment, not legal advice. Requirements vary, income thresholds must be verified before applying, and professional review is recommended for real cases.
      </div>

      <div className="flex flex-col gap-3">
        {results.map((result) => (
          <PathCard key={result.pathId} result={result} onSelect={() => onSelect(result.pathId)} />
        ))}
      </div>

      <div className="pb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-[var(--city-muted-fg)]">
          ← Choose a different city
        </Button>
      </div>
    </div>
  );
}
