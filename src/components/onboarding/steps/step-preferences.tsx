"use client";

import { Button } from "@/components/ui/button";
import { StepHeader } from "../step-header";
import type { LifePreference } from "@/types";

const PREFERENCES: { value: LifePreference; label: string; emoji: string }[] = [
  { value: "warm_climate", label: "Warm climate", emoji: "☀️" },
  { value: "lower_cost", label: "Lower cost", emoji: "💰" },
  { value: "big_city", label: "Big city", emoji: "🏙️" },
  { value: "sea_nearby", label: "Sea nearby", emoji: "🌊" },
  { value: "expat_community", label: "Expat community", emoji: "🌍" },
  { value: "english_friendly", label: "English-friendly", emoji: "🇬🇧" },
  { value: "family_friendly", label: "Family-friendly", emoji: "👨‍👩‍👧" },
  { value: "career_opportunities", label: "Career opps", emoji: "💼" },
  { value: "calm_lifestyle", label: "Calm lifestyle", emoji: "🧘" },
  { value: "student_life", label: "Student life", emoji: "🎓" },
  { value: "public_transport", label: "Good transport", emoji: "🚇" },
];

const MAX_SELECT = 5;

interface Props {
  selected: LifePreference[];
  onChange: (v: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepPreferences({ selected, onChange, onNext, onBack }: Props) {
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
        title="What should your new place feel like?"
        subtitle={`Choose up to ${MAX_SELECT} priorities.`}
      />

      <div className="grid grid-cols-2 gap-2">
        {PREFERENCES.map((pref) => {
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
                  ? "border-primary bg-primary/10 text-primary"
                  : isDisabled
                  ? "opacity-40 cursor-not-allowed border-border bg-card"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <span>{pref.emoji}</span>
              <span>{pref.label}</span>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {selected.length} of {MAX_SELECT} selected
        </p>
      )}

      <div className="flex gap-3 mt-auto pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-11">Back</Button>
        <Button onClick={onNext} disabled={selected.length === 0} className="flex-1 h-11">Continue</Button>
      </div>
    </div>
  );
}
