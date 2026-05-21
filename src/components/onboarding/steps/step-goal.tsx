"use client";

import { Button } from "@/components/ui/button";
import { StepHeader } from "../step-header";
import type { MoveGoal } from "@/types";
import { commonCopy, goalCopy, type UiLanguage } from "@/lib/i18n/onboarding";

interface Props {
  value: MoveGoal | "";
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  language: UiLanguage;
}

export function StepGoal({ value, onChange, onNext, onBack, language }: Props) {
  const copy = goalCopy[language];
  const common = commonCopy[language];

  return (
    <div className="flex flex-col flex-1 gap-6 pt-4">
      <StepHeader
        step={2}
        title={copy.title}
        subtitle={copy.subtitle}
        stepLabel={common.step}
        ofLabel={common.of}
      />

      <div className="flex flex-col gap-2">
        {copy.options.map((goal) => (
          <button
            key={goal.value}
            type="button"
            disabled={!goal.available}
            onClick={() => goal.available && onChange(goal.value)}
            className={`w-full text-left p-4 rounded-xl border transition-colors min-h-[64px] ${
              !goal.available
                ? "opacity-40 cursor-not-allowed border-[var(--city-border)] bg-[var(--city-warm-muted)]"
                : value === goal.value
                ? "border-stone-800 bg-stone-100"
                : "border-[var(--city-border)] bg-[var(--city-card)] hover:bg-[var(--city-warm-muted)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm text-stone-900">{goal.label}</div>
                <div className="text-xs text-[var(--city-muted-fg)] mt-0.5">{goal.description}</div>
              </div>
              {!goal.available && (
                <span className="text-xs text-[var(--city-muted-fg)] bg-[var(--city-warm-muted)] border border-[var(--city-border)] px-2 py-0.5 rounded-full ml-2 shrink-0">
                  {common.soon}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 mt-auto pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-11 rounded-full border-[var(--city-border)]">{common.back}</Button>
        <Button onClick={onNext} disabled={!value} className="flex-1 h-11 rounded-full">{common.continue}</Button>
      </div>
    </div>
  );
}
