"use client";

import { CheckCircle, MapPin, Route, AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCountryById } from "@/lib/data/countries";
import { getCityById } from "@/lib/data/cities";
import { getLegalPathById } from "@/lib/data/legal-paths";
import type { OnboardingState } from "@/types";

interface Props {
  state: OnboardingState;
  onConfirm: () => void;
  onBack: () => void;
}

export function StepPlanReady({ state, onConfirm, onBack }: Props) {
  const country = getCountryById(state.selectedCountry);
  const city = getCityById(state.selectedCity);
  const path = getLegalPathById(state.selectedLegalPath);

  if (!country || !city || !path) return null;

  const blockers = path.weakPoints.slice(0, 3);

  const NEXT_STEP_MAP: Record<string, string> = {
    remote: "Confirm your timeline, budget, and work details before you move into partner-reviewed guidance later.",
    study: "Confirm your timeline, study status, and budget before you move into the next roadmap stage.",
    work: "Confirm your timing, work status, and financial reality before you move into the next roadmap stage.",
    exploration: "Plan your scouting trip and research neighborhoods in person",
    family: "Confirm who is moving with you and what practical constraints that creates for the plan.",
    capital: "Pressure-test your financial reality before you move into the next roadmap stage.",
  };
  const nextStep = NEXT_STEP_MAP[path.scenario] ?? "Review your move profile and create your roadmap.";

  return (
    <div className="flex flex-col flex-1 gap-6 pt-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
          <CheckCircle className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Your move plan is ready</h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what you&apos;ve chosen. Review it before we build your roadmap.
        </p>
      </div>

      {/* Destination summary */}
      <div className="rounded-xl border bg-card divide-y">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-2xl">{country.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">Destination</div>
            <div className="text-sm font-semibold">{city.name}, {country.name}</div>
          </div>
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Route className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">Legal path</div>
            <div className="text-sm font-semibold">{path.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">Estimated preparation time</div>
            <div className="text-sm font-semibold">{path.estimatedPreparationTime}</div>
          </div>
        </div>
      </div>

      {/* Blockers */}
      {blockers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold">Top blockers to watch</span>
          </div>
          <div className="flex flex-col gap-2">
            {blockers.map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
                <span className="text-amber-500 font-medium shrink-0">{i + 1}.</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next step */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
        <div className="text-xs font-medium text-primary mb-1">Your first step</div>
        <p className="text-sm text-foreground leading-relaxed">{nextStep}</p>
      </div>

      <div className="flex flex-col gap-2 pb-6">
        <Button onClick={onConfirm} className="h-12 gap-2 text-base">
          Create my roadmap
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
          ← Change legal path
        </Button>
      </div>
    </div>
  );
}
