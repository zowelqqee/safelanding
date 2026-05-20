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
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--city-warm-muted)] border border-[var(--city-border)] mb-4">
          <CheckCircle className="h-7 w-7 text-stone-600" />
        </div>
        <h2 className="font-serif text-2xl font-medium text-stone-900 mb-1">Your move plan is ready</h2>
        <p className="text-sm text-[var(--city-muted-fg)]">
          Here&apos;s what you&apos;ve chosen. Review it before we build your roadmap.
        </p>
      </div>

      <div className="city-card rounded-[18px] divide-y divide-[var(--city-border)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-2xl">{country.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="city-section-kicker">Destination</div>
            <div className="text-sm font-semibold text-stone-900 mt-0.5">{city.name}, {country.name}</div>
          </div>
          <MapPin className="h-4 w-4 text-[var(--city-muted-fg)] shrink-0" />
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--city-warm-muted)] border border-[var(--city-border)] flex items-center justify-center shrink-0">
            <Route className="h-4 w-4 text-stone-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="city-section-kicker">Legal path</div>
            <div className="text-sm font-semibold text-stone-900 mt-0.5">{path.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--city-warm-muted)] border border-[var(--city-border)] flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4 text-stone-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="city-section-kicker">Preparation time</div>
            <div className="text-sm font-semibold text-stone-900 mt-0.5">{path.estimatedPreparationTime}</div>
          </div>
        </div>
      </div>

      {blockers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-stone-900">Top blockers to watch</span>
          </div>
          <div className="flex flex-col gap-2">
            {blockers.map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-amber-900 bg-amber-50 border border-amber-200/70 rounded-xl px-3 py-2.5">
                <span className="text-amber-600 font-semibold shrink-0">{i + 1}.</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl bg-[var(--city-warm-muted)] border border-[var(--city-border)] px-4 py-3">
        <div className="city-section-kicker mb-1">Your first step</div>
        <p className="text-sm text-stone-800 leading-relaxed">{nextStep}</p>
      </div>

      <div className="flex flex-col gap-2 pb-6">
        <Button onClick={onConfirm} className="h-12 gap-2 text-base rounded-full">
          Create my roadmap
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-[var(--city-muted-fg)]">
          ← Change legal path
        </Button>
      </div>
    </div>
  );
}
