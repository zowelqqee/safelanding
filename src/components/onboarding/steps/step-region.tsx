"use client";

import { Button } from "@/components/ui/button";
import { StepHeader } from "../step-header";
import type { RegionPreference } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  selected: RegionPreference[];
  onChange: (v: RegionPreference[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const REGIONS: { value: RegionPreference; label: string; emoji: string; note?: string }[] = [
  { value: "europe", label: "Europe", emoji: "🌍", note: "Schengen travel, EU residency" },
  { value: "north_america", label: "North America", emoji: "🌎", note: "US, Canada" },
  { value: "asia", label: "Asia", emoji: "🌏", note: "SE Asia, Japan, South Korea" },
  { value: "middle_east", label: "Middle East", emoji: "🏙️", note: "UAE, Qatar, Saudi Arabia" },
  { value: "latin_america", label: "Latin America", emoji: "🌴", note: "Mexico, Colombia, Argentina" },
  { value: "not_sure", label: "Open to anything", emoji: "🌐", note: "Show me all options" },
];

function toggle(current: RegionPreference[], value: RegionPreference): RegionPreference[] {
  if (value === "not_sure") return current.includes("not_sure") ? [] : ["not_sure"];
  const without = current.filter((v) => v !== "not_sure");
  return without.includes(value)
    ? without.filter((v) => v !== value)
    : [...without, value];
}

export function StepRegion({ selected, onChange, onNext, onBack }: Props) {
  const canContinue = selected.length > 0;

  return (
    <div className="flex flex-col flex-1 gap-5 pt-4">
      <StepHeader
        step={6}
        title="Which regions are you open to?"
        subtitle="Select all that interest you. We'll prioritize those in your shortlist."
      />

      <div className="flex flex-col gap-2">
        {REGIONS.map(({ value, label, emoji, note }) => {
          const active = selected.includes(value);
          return (
            <button
              key={value}
              onClick={() => onChange(toggle(selected, value))}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
                active
                  ? "border-stone-800 bg-stone-100"
                  : "border-[var(--city-border)] bg-[var(--city-card)] hover:bg-[var(--city-warm-muted)]"
              )}
            >
              <span className="text-xl shrink-0">{emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-900">{label}</div>
                {note && <div className="text-xs text-[var(--city-muted-fg)]">{note}</div>}
              </div>
              <div
                className={cn(
                  "size-4 rounded-sm border-2 shrink-0 transition-colors",
                  active ? "bg-stone-800 border-stone-800" : "border-[var(--city-border)]"
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 pb-6">
        <Button onClick={onNext} disabled={!canContinue} className="rounded-full">
          Continue
        </Button>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-[var(--city-muted-fg)]">
          ← Back
        </Button>
      </div>
    </div>
  );
}
