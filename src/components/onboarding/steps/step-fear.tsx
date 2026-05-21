"use client";

import { Button } from "@/components/ui/button";
import { StepHeader } from "../step-header";
import type { MainFear } from "@/types";
import { commonCopy, fearCopy, type UiLanguage } from "@/lib/i18n/onboarding";

interface Props {
  value: MainFear | "";
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  language: UiLanguage;
}

export function StepFear({ value, onChange, onNext, onBack, language }: Props) {
  const copy = fearCopy[language];
  const common = commonCopy[language];

  return (
    <div className="flex flex-col flex-1 gap-6 pt-4">
      <StepHeader
        step={5}
        title={copy.title}
        subtitle={copy.subtitle}
        stepLabel={common.step}
        ofLabel={common.of}
      />

      <div className="flex flex-col gap-2">
        {copy.options.map((fear) => (
          <button
            key={fear.value}
            type="button"
            onClick={() => onChange(fear.value)}
            className={`w-full text-left p-4 rounded-xl border transition-colors ${
              value === fear.value
                ? "border-stone-800 bg-stone-100"
                : "border-[var(--city-border)] bg-[var(--city-card)] hover:bg-[var(--city-warm-muted)]"
            }`}
          >
            <div className="font-medium text-sm text-stone-900">{fear.label}</div>
            <div className="text-xs text-[var(--city-muted-fg)] mt-0.5">{fear.description}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 mt-auto pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-11 rounded-full border-[var(--city-border)]">{common.back}</Button>
        <Button onClick={onNext} className="flex-1 h-11 rounded-full">
          {value ? copy.seeResults : copy.skipResults}
        </Button>
      </div>
    </div>
  );
}
