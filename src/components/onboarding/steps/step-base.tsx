"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StepHeader } from "../step-header";
import { baseCopy, commonCopy, type UiLanguage } from "@/lib/i18n/onboarding";

interface Props {
  citizenship: string;
  currentCountry: string;
  residenceCountry: string;
  language: UiLanguage;
  onChange: (v: Partial<{ citizenship: string; currentCountry: string; residenceCountry: string; language: UiLanguage }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepBase({ citizenship, currentCountry, language, onChange, onNext, onBack }: Props) {
  const canContinue = citizenship.trim().length > 0;
  const copy = baseCopy[language];
  const common = commonCopy[language];

  return (
    <div className="flex flex-col flex-1 gap-6 pt-4">
      <StepHeader
        step={1}
        title={copy.title}
        subtitle={copy.subtitle}
        stepLabel={common.step}
        ofLabel={common.of}
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="citizenship">{copy.citizenship}</Label>
          <Input
            id="citizenship"
            placeholder={copy.citizenshipPlaceholder}
            value={citizenship}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ citizenship: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="currentCountry">{copy.currentCountry}</Label>
          <Input
            id="currentCountry"
            placeholder={copy.currentCountryPlaceholder}
            value={currentCountry}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ currentCountry: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>{copy.preferredLanguage}</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["en", "ru"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onChange({ language: lang })}
                className={`h-11 rounded-lg border text-sm font-medium transition-colors ${
                  language === lang
                    ? "border-stone-800 bg-stone-100 text-stone-900"
                    : "border-[var(--city-border)] bg-[var(--city-card)] text-[var(--city-muted-fg)] hover:bg-[var(--city-warm-muted)]"
                }`}
              >
                {lang === "en" ? copy.english : copy.russian}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-auto pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-11 rounded-full border-[var(--city-border)]">
          {common.back}
        </Button>
        <Button onClick={onNext} disabled={!canContinue} className="flex-1 h-11 rounded-full">
          {common.continue}
        </Button>
      </div>
    </div>
  );
}
