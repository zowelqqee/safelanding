"use client";

import { useMemo } from "react";
import { CheckCircle, AlertTriangle, ArrowRight, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    score >= 70 ? "bg-green-100 text-green-700" :
    score >= 45 ? "bg-blue-100 text-blue-700" :
    "bg-muted text-muted-foreground";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${color}`}>
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
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-sm">{path.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{path.summary}</p>
        </div>
        <MatchScore score={result.score} />
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {path.estimatedPreparationTime}
        </span>
        <span className="flex items-center gap-1">
          <Shield className="h-3.5 w-3.5" />
          {COMPLEXITY_LABEL[path.complexity]}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {path.requires_remote_income && (
          <Badge variant="secondary" className="text-xs">
            Remote income needed
          </Badge>
        )}
        {path.requires_admission && (
          <Badge variant="secondary" className="text-xs">
            Admission needed
          </Badge>
        )}
        {(path.requires_local_employer || path.requires_sponsor) && (
          <Badge variant="secondary" className="text-xs">
            Sponsor or employer needed
          </Badge>
        )}
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

      {result.weakPoints.length > 0 && (
        <div className="flex flex-col gap-1">
          {result.weakPoints.map((w, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{w}</span>
            </div>
          ))}
        </div>
      )}

      {!path.journeyAvailable && (
        <div className="text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg">
          Full step-by-step journey for this path is coming soon.
        </div>
      )}

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
        {path.legal_disclaimer}
      </div>

      <Button size="sm" className="h-10 gap-1.5" onClick={onSelect}>
        Start this path
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
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">
            {country?.emoji} {country?.name}{city ? ` · ${city.name}` : ""}
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Choose your legal path</h2>
        <p className="text-sm text-muted-foreground">
          These paths are available for {country?.name ?? "your destination"}. Pick the one that fits your situation.
        </p>
      </div>

      <div className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        This is a fit assessment, not legal advice. Requirements vary, income thresholds must be verified before applying, and professional review is recommended for real cases.
      </div>

      <div className="flex flex-col gap-3">
        {results.map((result) => (
          <PathCard key={result.pathId} result={result} onSelect={() => onSelect(result.pathId)} />
        ))}
      </div>

      <div className="pb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
          ← Choose a different city
        </Button>
      </div>
    </div>
  );
}
