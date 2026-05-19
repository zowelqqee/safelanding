"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StepHeader } from "../step-header";

interface Props {
  citizenship: string;
  currentCountry: string;
  residenceCountry: string;
  language: "ru" | "en";
  onChange: (v: Partial<{ citizenship: string; currentCountry: string; residenceCountry: string; language: "ru" | "en" }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepBase({ citizenship, currentCountry, language, onChange, onNext, onBack }: Props) {
  const canContinue = citizenship.trim().length > 0;

  return (
    <div className="flex flex-col flex-1 gap-6 pt-4">
      <StepHeader
        step={1}
        title="Where are you from?"
        subtitle="This helps us match you with the right legal path."
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="citizenship">Citizenship *</Label>
          <Input
            id="citizenship"
            placeholder="e.g. Russia, Ukraine, Germany"
            value={citizenship}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ citizenship: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="currentCountry">Current country</Label>
          <Input
            id="currentCountry"
            placeholder="Where do you live now?"
            value={currentCountry}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ currentCountry: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Preferred language</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["en", "ru"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onChange({ language: lang })}
                className={`h-11 rounded-lg border text-sm font-medium transition-colors ${
                  language === lang
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {lang === "en" ? "English" : "Русский"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-auto pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-11">
          Back
        </Button>
        <Button onClick={onNext} disabled={!canContinue} className="flex-1 h-11">
          Continue
        </Button>
      </div>
    </div>
  );
}
