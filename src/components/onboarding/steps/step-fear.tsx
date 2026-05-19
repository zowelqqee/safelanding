"use client";

import { Button } from "@/components/ui/button";
import { StepHeader } from "../step-header";
import type { MainFear } from "@/types";

const FEARS: { value: MainFear; label: string; description: string }[] = [
  { value: "documents", label: "Documents", description: "Paperwork, apostilles, translations" },
  { value: "money", label: "Money", description: "Will I have enough to get through the process?" },
  { value: "housing", label: "Housing", description: "Finding somewhere to live" },
  { value: "language", label: "Language", description: "Not speaking the local language" },
  { value: "finding_work", label: "Finding work", description: "Income stability after moving" },
  { value: "being_alone", label: "Being alone", description: "Social life and connections" },
  { value: "choosing_wrong_place", label: "Choosing wrong place", description: "What if it doesn't fit?" },
  { value: "legal_status", label: "Legal status", description: "Visa denial or unclear status" },
];

interface Props {
  value: MainFear | "";
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepFear({ value, onChange, onNext, onBack }: Props) {
  return (
    <div className="flex flex-col flex-1 gap-6 pt-4">
      <StepHeader
        step={5}
        title="What worries you most?"
        subtitle="We'll make sure to address this throughout your journey."
      />

      <div className="flex flex-col gap-2">
        {FEARS.map((fear) => (
          <button
            key={fear.value}
            type="button"
            onClick={() => onChange(fear.value)}
            className={`w-full text-left p-4 rounded-xl border transition-colors ${
              value === fear.value
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:bg-muted"
            }`}
          >
            <div className="font-medium text-sm">{fear.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{fear.description}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 mt-auto pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-11">Back</Button>
        <Button onClick={onNext} className="flex-1 h-11">
          {value ? "See my results" : "Skip & see results"}
        </Button>
      </div>
    </div>
  );
}
