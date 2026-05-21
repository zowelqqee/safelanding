"use client";

import { Button } from "@/components/ui/button";
import { StepHeader } from "../step-header";
import type { MoveOptimization } from "@/types";
import { cn } from "@/lib/utils";
import { commonCopy, optimizationCopy, type UiLanguage } from "@/lib/i18n/onboarding";

interface Props {
  value: MoveOptimization | "";
  onChange: (v: MoveOptimization) => void;
  onNext: () => void;
  onBack: () => void;
  language: UiLanguage;
}

export function StepOptimization({ value, onChange, onNext, onBack, language }: Props) {
  const copy = optimizationCopy[language];
  const common = commonCopy[language];

  return (
    <div className="flex flex-col flex-1 gap-5 pt-4">
      <StepHeader
        step={7}
        title={copy.title}
        subtitle={copy.subtitle}
        stepLabel={common.step}
        ofLabel={common.of}
      />

      <div className="flex flex-col gap-2">
        {copy.options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
                active
                  ? "border-stone-800 bg-stone-100"
                  : "border-[var(--city-border)] bg-[var(--city-card)] hover:bg-[var(--city-warm-muted)]"
              )}
            >
              <span className="text-xl shrink-0">{opt.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-900">{opt.label}</div>
                <div className="text-xs text-[var(--city-muted-fg)]">{opt.description}</div>
              </div>
              <div
                className={cn(
                  "size-4 rounded-full border-2 shrink-0 transition-colors",
                  active ? "bg-stone-800 border-stone-800" : "border-[var(--city-border)]"
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 pb-6">
        <Button onClick={onNext} disabled={!value} className="rounded-full">
          {common.continue}
        </Button>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-[var(--city-muted-fg)]">
          {common.backArrow}
        </Button>
      </div>
    </div>
  );
}
