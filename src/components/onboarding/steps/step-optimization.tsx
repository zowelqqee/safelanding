"use client";

import { Button } from "@/components/ui/button";
import { StepHeader } from "../step-header";
import type { MoveOptimization } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  value: MoveOptimization | "";
  onChange: (v: MoveOptimization) => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS: { value: MoveOptimization; label: string; description: string; emoji: string }[] = [
  {
    value: "fastest_legal_path",
    label: "Fastest legal path",
    description: "Get legal status with the least bureaucracy",
    emoji: "⚡",
  },
  {
    value: "best_career",
    label: "Best career upside",
    description: "Access the strongest job markets and salaries",
    emoji: "📈",
  },
  {
    value: "lowest_cost",
    label: "Lowest cost",
    description: "Stretch your money as far as possible",
    emoji: "💰",
  },
  {
    value: "comfortable_life",
    label: "Most comfortable daily life",
    description: "Quality of life, safety, community, pace",
    emoji: "🌿",
  },
  {
    value: "best_study",
    label: "Best study route",
    description: "Access top universities and student life",
    emoji: "🎓",
  },
  {
    value: "safest_longterm",
    label: "Safest long-term option",
    description: "Stable residency, clear PR path, strong institutions",
    emoji: "🛡️",
  },
];

export function StepOptimization({ value, onChange, onNext, onBack }: Props) {
  return (
    <div className="flex flex-col flex-1 gap-5 pt-4">
      <StepHeader
        step={7}
        title="What are you optimizing for?"
        subtitle="Pick the one thing that matters most. This shapes your country ranking."
      />

      <div className="flex flex-col gap-2">
        {OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
                active
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              )}
            >
              <span className="text-xl shrink-0">{opt.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.description}</div>
              </div>
              <div
                className={cn(
                  "size-4 rounded-full border-2 shrink-0 transition-colors",
                  active ? "bg-primary border-primary" : "border-border"
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 pb-6">
        <Button onClick={onNext} disabled={!value}>
          Continue
        </Button>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
          ← Back
        </Button>
      </div>
    </div>
  );
}
