"use client";

import { Button } from "@/components/ui/button";
import { StepHeader } from "../step-header";
import type { IncomeRange, SavingsRange, IncomeType } from "@/types";
import { commonCopy, moneyCopy, type UiLanguage } from "@/lib/i18n/onboarding";

const INCOME_RANGES: { value: IncomeRange; label: string }[] = [
  { value: "under_1000", label: "< €1,000 / mo" },
  { value: "1000_2000", label: "€1,000 – 2,000" },
  { value: "2000_3000", label: "€2,000 – 3,000" },
  { value: "3000_5000", label: "€3,000 – 5,000" },
  { value: "5000_plus", label: "€5,000+" },
];

const SAVINGS_RANGES: { value: SavingsRange; label: string }[] = [
  { value: "under_3000", label: "< €3,000" },
  { value: "3000_7000", label: "€3,000 – 7,000" },
  { value: "7000_15000", label: "€7,000 – 15,000" },
  { value: "15000_30000", label: "€15,000 – 30,000" },
  { value: "30000_plus", label: "€30,000+" },
];

interface Props {
  monthlyIncome: IncomeRange | "";
  savingsRange: SavingsRange | "";
  incomeType: IncomeType | "";
  onChange: (v: Partial<{ monthlyIncome: IncomeRange | ""; savingsRange: SavingsRange | ""; incomeType: IncomeType | "" }>) => void;
  onNext: () => void;
  onBack: () => void;
  language: UiLanguage;
}

function OptionGrid<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: { value: T; label: string }[];
  selected: T | "";
  onSelect: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt.value)}
          className={`h-11 rounded-lg border text-sm font-medium transition-colors ${
            selected === opt.value
              ? "border-stone-800 bg-stone-100 text-stone-900"
              : "border-[var(--city-border)] bg-[var(--city-card)] text-stone-700 hover:bg-[var(--city-warm-muted)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function StepMoney({ monthlyIncome, savingsRange, incomeType, onChange, onNext, onBack, language }: Props) {
  const canContinue = monthlyIncome !== "" || savingsRange !== "";
  const copy = moneyCopy[language];
  const common = commonCopy[language];

  return (
    <div className="flex flex-col flex-1 gap-6 pt-4">
      <StepHeader
        step={3}
        title={copy.title}
        subtitle={copy.subtitle}
        stepLabel={common.step}
        ofLabel={common.of}
      />

      <div className="flex flex-col gap-5">
        <div>
          <div className="text-sm font-medium mb-2">{copy.monthlyIncome}</div>
          <OptionGrid
            options={INCOME_RANGES}
            selected={monthlyIncome}
            onSelect={(v) => onChange({ monthlyIncome: v })}
          />
        </div>

        <div>
          <div className="text-sm font-medium mb-2">{copy.savingsAvailable}</div>
          <OptionGrid
            options={SAVINGS_RANGES}
            selected={savingsRange}
            onSelect={(v) => onChange({ savingsRange: v })}
          />
        </div>

        <div>
          <div className="text-sm font-medium mb-2">{copy.incomeType}</div>
          <OptionGrid
            options={copy.incomeTypes}
            selected={incomeType}
            onSelect={(v) => onChange({ incomeType: v })}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-auto pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-11 rounded-full border-[var(--city-border)]">{common.back}</Button>
        <Button onClick={onNext} disabled={!canContinue} className="flex-1 h-11 rounded-full">{common.continue}</Button>
      </div>
    </div>
  );
}
