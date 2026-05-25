"use client";

import { Button } from "@/components/ui/button";
import { StepHeader } from "../step-header";
import type { CostTolerance, MoveGoal, MoveOptimization, SafetyImportance, StudyPriority } from "@/types";
import { cn } from "@/lib/utils";
import { commonCopy, optimizationCopy, type UiLanguage } from "@/lib/i18n/onboarding";

interface Props {
  value: MoveOptimization | "";
  moveGoal: MoveGoal | "";
  safetyImportance: SafetyImportance;
  costTolerance: CostTolerance;
  studyPriority: StudyPriority;
  onChange: (v: Partial<{
    moveOptimization: MoveOptimization;
    safetyImportance: SafetyImportance;
    costTolerance: CostTolerance;
    studyPriority: StudyPriority;
  }>) => void;
  onNext: () => void;
  onBack: () => void;
  language: UiLanguage;
}

function ChoiceGroup<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { value: T; label: string; description: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="city-section-kicker">{title}</div>
      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-left transition-colors",
                active
                  ? "border-stone-800 bg-stone-100"
                  : "border-[var(--city-border)] bg-[var(--city-card)] hover:bg-[var(--city-warm-muted)]"
              )}
            >
              <div className="text-sm font-medium text-stone-900">{option.label}</div>
              <div className="text-xs text-[var(--city-muted-fg)]">{option.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StepOptimization({
  value,
  moveGoal,
  safetyImportance,
  costTolerance,
  studyPriority,
  onChange,
  onNext,
  onBack,
  language,
}: Props) {
  const copy = optimizationCopy[language];
  const common = commonCopy[language];
  const showStudyPriority = moveGoal === "study" || value === "best_study";

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
              onClick={() => onChange({ moveOptimization: opt.value })}
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

      <ChoiceGroup
        title={copy.safetyTitle}
        options={copy.safetyOptions}
        value={safetyImportance}
        onChange={(nextValue) => onChange({ safetyImportance: nextValue })}
      />

      <ChoiceGroup
        title={copy.costTitle}
        options={copy.costOptions}
        value={costTolerance}
        onChange={(nextValue) => onChange({ costTolerance: nextValue })}
      />

      {showStudyPriority && (
        <ChoiceGroup
          title={copy.studyTitle}
          options={copy.studyOptions}
          value={studyPriority}
          onChange={(nextValue) => onChange({ studyPriority: nextValue })}
        />
      )}

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
