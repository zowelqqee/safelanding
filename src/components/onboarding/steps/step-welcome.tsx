"use client";

import { ArrowRight, MapPin, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeInfo {
  stepIndex: number;
  label: string;
}

interface Props {
  onStart: () => void;
  resume?: ResumeInfo | null;
  onResume?: () => void;
  showRoadmapCta?: boolean;
  onOpenRoadmap?: () => void;
}

export function StepWelcome({
  onStart,
  resume,
  onResume,
  showRoadmapCta = false,
  onOpenRoadmap,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
      <div className="w-12 h-12 rounded-2xl bg-[var(--city-warm-muted)] border border-[var(--city-border)] flex items-center justify-center mb-6">
        <MapPin className="h-6 w-6 text-stone-600" />
      </div>
      <h1 className="font-serif text-3xl font-medium text-stone-900 mb-3">
        Your move, step by step.
      </h1>
      <p className="text-[var(--city-muted-fg)] max-w-sm leading-relaxed mb-2">
        Soft Landing helps you choose where to move, understand realistic legal paths,
        build your move profile, and follow a clear roadmap.
      </p>
      <p className="text-xs text-[var(--city-muted-fg)] mb-10">
        Takes about 3 minutes. No account required to see your results.
      </p>

      {showRoadmapCta ? (
        <div className="w-full max-w-xs flex flex-col gap-3">
          <div className="city-card rounded-xl px-4 py-3 text-left">
            <div className="city-section-kicker mb-0.5">Continue your roadmap</div>
            <div className="text-sm text-stone-900">
              Your destination and legal path are already selected.
            </div>
          </div>
          <Button
            size="lg"
            onClick={onOpenRoadmap}
            className="gap-2 text-base h-12 w-full rounded-full"
          >
            <RotateCcw className="h-4 w-4" />
            Continue your roadmap
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onStart}
            className="text-[var(--city-muted-fg)]"
          >
            Open onboarding instead
          </Button>
        </div>
      ) : resume ? (
        <div className="w-full max-w-xs flex flex-col gap-3">
          <div className="city-card rounded-xl px-4 py-3 text-left">
            <div className="city-section-kicker mb-0.5">Continue your move</div>
            <div className="text-sm text-stone-900">
              You stopped at: <span className="font-medium">{resume.label}</span>
            </div>
          </div>
          <Button
            size="lg"
            onClick={onResume}
            className="gap-2 text-base h-12 w-full rounded-full"
          >
            <RotateCcw className="h-4 w-4" />
            Continue
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onStart}
            className="text-[var(--city-muted-fg)]"
          >
            Start over instead
          </Button>
        </div>
      ) : (
        <Button
          size="lg"
          onClick={onStart}
          className="gap-2 text-base px-7 h-12 w-full max-w-xs rounded-full"
        >
          Start my move
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}

      <p className="text-xs text-[var(--city-muted-fg)] mt-5 max-w-xs">
        Soft Landing does not provide legal advice. For legal decisions, consult
        a qualified immigration professional.
      </p>
    </div>
  );
}
