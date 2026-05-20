"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getExistingFeedback, saveFeedback } from "@/lib/analytics/feedback";

type FeedbackMode = "move_brief" | "partner_review_success";

const usefulnessOptions = ["Да", "Частично", "Нет"];
const realHelpOptions = ["Да", "Возможно", "Нет"];

export function FeedbackCard({
  moveProfileId,
  source,
  mode,
}: {
  moveProfileId: string;
  source: string;
  mode: FeedbackMode;
}) {
  const [usefulness, setUsefulness] = useState("");
  const [wouldRequestRealHelp, setWouldRequestRealHelp] = useState("");
  const [comment, setComment] = useState("");
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getExistingFeedback(moveProfileId, source)
      .then((feedback) => {
        if (!cancelled && feedback) {
          setSubmitted(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingExisting(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [moveProfileId, source]);

  const isPartnerMode = mode === "partner_review_success";
  const selectedUsefulness = isPartnerMode ? wouldRequestRealHelp : usefulness;
  const canSubmit = selectedUsefulness && (!isPartnerMode || wouldRequestRealHelp);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || saving) return;

    setSaving(true);
    setError(null);

    const result = await saveFeedback({
      moveProfileId,
      source,
      usefulness: selectedUsefulness,
      wouldRequestRealHelp: wouldRequestRealHelp || null,
      comment,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  }

  if (loadingExisting) {
    return (
      <section className="city-card rounded-[24px] px-5 py-5 text-sm text-[var(--city-muted-fg)]">
        Loading feedback...
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="city-card rounded-[24px] px-5 py-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <p className="city-section-kicker text-emerald-700">Feedback saved</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--city-muted-fg)]">
              Спасибо, отзыв уже сохранён. Это поможет понять, где MVP правда полезен, а где ещё мутно.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="city-card overflow-hidden rounded-[24px]">
      <div className="border-b border-[var(--city-border)] px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight text-stone-900">
          {isPartnerMode
            ? "Это похоже на действие, которое вы бы сделали в реальной жизни?"
            : "Стало понятнее, как может выглядеть переезд?"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5">
        {!isPartnerMode && (
          <OptionGroup
            label="Насколько это стало полезнее?"
            value={usefulness}
            options={usefulnessOptions}
            onChange={setUsefulness}
          />
        )}

        <OptionGroup
          label={isPartnerMode ? "Ваш ответ" : "Оставили бы заявку реальному исполнителю?"}
          value={wouldRequestRealHelp}
          options={realHelpOptions}
          onChange={setWouldRequestRealHelp}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-800" htmlFor={`${source}-feedback-comment`}>
            {isPartnerMode
              ? "Что мешает оставить реальную заявку?"
              : "Что было слабым или непонятным?"}
          </label>
          <Textarea
            id={`${source}-feedback-comment`}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className="min-h-28"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" disabled={!canSubmit || saving} className="h-11 w-full gap-2 rounded-full">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Отправляем...
            </>
          ) : (
            "Отправить отзыв"
          )}
        </Button>
      </form>
    </section>
  );
}

function OptionGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-stone-800">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
              value === option
                ? "border-stone-800 bg-stone-900 text-white"
                : "border-[var(--city-border)] bg-[var(--city-card)] text-stone-700 hover:bg-[var(--city-warm-muted)]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
