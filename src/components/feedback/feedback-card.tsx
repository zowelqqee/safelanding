"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { UiLanguage } from "@/lib/i18n/onboarding";
import { getExistingFeedback, saveFeedback } from "@/lib/analytics/feedback";

type FeedbackMode = "move_brief" | "partner_review_success";
type FeedbackOptionValue = "yes" | "partial" | "maybe" | "no";

const COPY = {
  en: {
    loading: "Loading feedback...",
    savedKicker: "Feedback saved",
    savedBody:
      "Thanks, your feedback is already saved. This helps us see where the MVP is truly useful and where it still feels unclear.",
    titleMoveBrief: "Did this make the move feel clearer?",
    titlePartner: "Does this feel like something you would actually do in real life?",
    usefulnessLabel: "How much more useful did this become?",
    realHelpLabel: "Would you submit this to a real relocation partner?",
    yourAnswer: "Your answer",
    commentLabelMoveBrief: "What felt weak or unclear?",
    commentLabelPartner: "What would stop you from submitting a real request?",
    submit: "Send feedback",
    submitting: "Sending...",
    usefulnessOptions: [
      { value: "yes", label: "Yes" },
      { value: "partial", label: "Partly" },
      { value: "no", label: "No" },
    ],
    realHelpOptions: [
      { value: "yes", label: "Yes" },
      { value: "maybe", label: "Maybe" },
      { value: "no", label: "No" },
    ],
  },
  ru: {
    loading: "Загружаем форму отзыва...",
    savedKicker: "Отзыв сохранён",
    savedBody:
      "Спасибо, отзыв уже сохранён. Это помогает понять, где MVP правда полезен, а где ещё остаётся неясность.",
    titleMoveBrief: "Стало понятнее, как может выглядеть переезд?",
    titlePartner:
      "Это похоже на действие, которое вы бы действительно сделали в реальной жизни?",
    usefulnessLabel: "Насколько это стало полезнее?",
    realHelpLabel: "Оставили бы такую заявку реальному исполнителю?",
    yourAnswer: "Ваш ответ",
    commentLabelMoveBrief: "Что показалось слабым или непонятным?",
    commentLabelPartner: "Что мешает оставить реальную заявку?",
    submit: "Отправить отзыв",
    submitting: "Отправляем...",
    usefulnessOptions: [
      { value: "yes", label: "Да" },
      { value: "partial", label: "Частично" },
      { value: "no", label: "Нет" },
    ],
    realHelpOptions: [
      { value: "yes", label: "Да" },
      { value: "maybe", label: "Возможно" },
      { value: "no", label: "Нет" },
    ],
  },
} satisfies Record<
  UiLanguage,
  {
    loading: string;
    savedKicker: string;
    savedBody: string;
    titleMoveBrief: string;
    titlePartner: string;
    usefulnessLabel: string;
    realHelpLabel: string;
    yourAnswer: string;
    commentLabelMoveBrief: string;
    commentLabelPartner: string;
    submit: string;
    submitting: string;
    usefulnessOptions: Array<{ value: FeedbackOptionValue; label: string }>;
    realHelpOptions: Array<{ value: FeedbackOptionValue; label: string }>;
  }
>;

export function FeedbackCard({
  moveProfileId,
  source,
  mode,
  language = "en",
}: {
  moveProfileId: string;
  source: string;
  mode: FeedbackMode;
  language?: UiLanguage;
}) {
  const copy = COPY[language];
  const [usefulness, setUsefulness] = useState<FeedbackOptionValue | "">("");
  const [wouldRequestRealHelp, setWouldRequestRealHelp] = useState<
    FeedbackOptionValue | ""
  >("");
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
      language,
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
        {copy.loading}
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
            <p className="city-section-kicker text-emerald-700">{copy.savedKicker}</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--city-muted-fg)]">
              {copy.savedBody}
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
          {isPartnerMode ? copy.titlePartner : copy.titleMoveBrief}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5">
        {!isPartnerMode && (
          <OptionGroup
            label={copy.usefulnessLabel}
            value={usefulness}
            options={copy.usefulnessOptions}
            onChange={setUsefulness}
          />
        )}

        <OptionGroup
          label={isPartnerMode ? copy.yourAnswer : copy.realHelpLabel}
          value={wouldRequestRealHelp}
          options={copy.realHelpOptions}
          onChange={setWouldRequestRealHelp}
        />

        <div className="space-y-1.5">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor={`${source}-feedback-comment`}
          >
            {isPartnerMode ? copy.commentLabelPartner : copy.commentLabelMoveBrief}
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

        <Button
          type="submit"
          disabled={!canSubmit || saving}
          className="h-11 w-full gap-2 rounded-full"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {copy.submitting}
            </>
          ) : (
            copy.submit
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
  value: FeedbackOptionValue | "";
  options: Array<{ value: FeedbackOptionValue; label: string }>;
  onChange: (value: FeedbackOptionValue) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-stone-800">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
              value === option.value
                ? "border-stone-800 bg-stone-900 text-white"
                : "border-[var(--city-border)] bg-[var(--city-card)] text-stone-700 hover:bg-[var(--city-warm-muted)]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
