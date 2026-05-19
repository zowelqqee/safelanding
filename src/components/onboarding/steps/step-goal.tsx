"use client";

import { Button } from "@/components/ui/button";
import { StepHeader } from "../step-header";
import type { MoveGoal } from "@/types";

const GOALS: { value: MoveGoal; label: string; description: string; available: boolean }[] = [
  { value: "remote_work", label: "Move for remote work", description: "I work remotely and want to base myself abroad", available: true },
  { value: "study", label: "Move for study", description: "I want to study abroad — university or language school", available: true },
  { value: "explore_first", label: "Explore first, decide later", description: "I want to visit and figure things out on the ground", available: true },
  { value: "not_sure", label: "Not sure yet", description: "Help me understand my options", available: true },
  { value: "find_job", label: "Find a job abroad", description: "Looking for employment in another country", available: true },
  { value: "family", label: "Move with family/partner", description: "Family reunification or partner visa route", available: false },
];

interface Props {
  value: MoveGoal | "";
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepGoal({ value, onChange, onNext, onBack }: Props) {
  return (
    <div className="flex flex-col flex-1 gap-6 pt-4">
      <StepHeader
        step={2}
        title="What are you trying to do?"
        subtitle="We'll match you to the right path and city type."
      />

      <div className="flex flex-col gap-2">
        {GOALS.map((goal) => (
          <button
            key={goal.value}
            type="button"
            disabled={!goal.available}
            onClick={() => goal.available && onChange(goal.value)}
            className={`w-full text-left p-4 rounded-xl border transition-colors min-h-[64px] ${
              !goal.available
                ? "opacity-40 cursor-not-allowed bg-muted border-border"
                : value === goal.value
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:bg-muted"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{goal.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{goal.description}</div>
              </div>
              {!goal.available && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-2 shrink-0">
                  Soon
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 mt-auto pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-11">Back</Button>
        <Button onClick={onNext} disabled={!value} className="flex-1 h-11">Continue</Button>
      </div>
    </div>
  );
}
