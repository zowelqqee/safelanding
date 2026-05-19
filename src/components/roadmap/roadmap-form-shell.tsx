"use client";

import type { FormEventHandler, ReactNode } from "react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RoadmapFormShell({
  title,
  description,
  onBack,
  onSubmit,
  children,
  submitLabel,
  savingLabel,
  saving,
  canSubmit,
  error,
}: {
  title: string;
  description: string;
  onBack: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  submitLabel: string;
  savingLabel: string;
  saving: boolean;
  canSubmit: boolean;
  error?: string;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:py-8">
      <div className="rounded-[28px] border bg-card shadow-sm">
        <div className="border-b px-5 py-5">
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to roadmap
          </button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 px-5 py-5">
          {children}

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              disabled={!canSubmit || saving}
              className="h-12 gap-2 text-base"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {savingLabel}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {submitLabel}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="h-11 text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ChoiceGrid({
  value,
  onChange,
  options,
  columns = "grid-cols-1",
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; description?: string }>;
  columns?: string;
}) {
  return (
    <div className={cn("grid gap-2", columns)}>
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-xl border p-3 text-left transition-colors min-h-[60px]",
              isActive
                ? "border-primary bg-primary/10"
                : "border-border bg-background hover:bg-muted"
            )}
          >
            <div className="text-sm font-medium text-foreground">{option.label}</div>
            {option.description && (
              <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {option.description}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function BooleanChoice({
  value,
  onChange,
  trueLabel = "Yes",
  falseLabel = "No",
  nullLabel = "Not sure",
}: {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  trueLabel?: string;
  falseLabel?: string;
  nullLabel?: string;
}) {
  const options = [
    { label: trueLabel, value: true },
    { label: falseLabel, value: false },
    { label: nullLabel, value: null },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "h-11 rounded-xl border text-sm font-medium transition-colors",
              isActive
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
