"use client";

import { Button } from "@/components/ui/button";
import { StepHeader } from "../step-header";
import type { LifePreference } from "@/types";
import { commonCopy, preferenceCopy, type UiLanguage } from "@/lib/i18n/onboarding";

const MAX_SELECT = 5;

interface Props {
  selected: LifePreference[];
  onChange: (v: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  language: UiLanguage;
}

export function StepPreferences({ selected, onChange, onNext, onBack, language }: Props) {
  const copy = preferenceCopy[language];
  const common = commonCopy[language];

  const toggle = (v: LifePreference) => {
    if (selected.includes(v)) {
      onChange(selected.filter((s) => s !== v));
    } else if (selected.length < MAX_SELECT) {
      onChange([...selected, v]);
    }
  };

  return (
    <div className="flex flex-col flex-1 gap-6 pt-4">
      <StepHeader
        step={4}
        title={copy.title}
        subtitle={copy.subtitle}
        stepLabel={common.step}
        ofLabel={common.of}
      />

      <div className="grid grid-cols-2 gap-2">
        {copy.options.map((pref) => {
          const isSelected = selected.includes(pref.value);
          const isDisabled = !isSelected && selected.length >= MAX_SELECT;
          return (
            <button
              key={pref.value}
              type="button"
              disabled={isDisabled}
              onClick={() => toggle(pref.value)}
              className={`h-12 rounded-xl border text-sm font-medium transition-colors flex items-center gap-2 px-3 ${
                isSelected
                  ? "border-stone-800 bg-stone-100 text-stone-900"
                  : isDisabled
                  ? "opacity-40 cursor-not-allowed border-[var(--city-border)] bg-[var(--city-card)]"
                  : "border-[var(--city-border)] bg-[var(--city-card)] text-stone-700 hover:bg-[var(--city-warm-muted)]"
              }`}
            >
              <span>{pref.emoji}</span>
              <span>{pref.label}</span>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-[var(--city-muted-fg)] text-center">
          {selected.length} {common.of} {MAX_SELECT} {copy.selected}
        </p>
      )}

      <div className="flex gap-3 mt-auto pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-11 rounded-full border-[var(--city-border)]">{common.back}</Button>
        <Button onClick={onNext} disabled={selected.length === 0} className="flex-1 h-11 rounded-full">{common.continue}</Button>
      </div>
    </div>
  );
}
