"use client";

import { useState } from "react";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackCard } from "@/components/feedback/feedback-card";
import type { UiLanguage } from "@/lib/i18n/onboarding";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { savePartnerReviewRequest } from "@/lib/partner-review/partner-review-client";
import type { PartnerReviewRequest } from "@/types";

const COPY = {
  en: {
    existingRequest: "Existing request",
    reviewRequestSaved: "Review request saved",
    partnerReviewStatus: "Partner review status",
    status: "Status",
    disclaimer:
      "This is not a legal submission. A verified partner layer will be added later.",
    updateRequest: "Update request",
    requestDetails: "Request details",
    requestContext:
      "We'll save this with your current Move Brief context. No document checklist appears here.",
    email: "Email",
    message: "Message",
    messagePlaceholder:
      "Anything you want the future partner-reviewed layer to know about your timing, blockers, or situation?",
    consent:
      "I agree that Soft Landing may use my Move Brief to prepare a partner review request.",
    saving: "Saving...",
    submit: "Request partner review",
  },
  ru: {
    existingRequest: "Текущий запрос",
    reviewRequestSaved: "Запрос сохранён",
    partnerReviewStatus: "Статус partner review",
    status: "Статус",
    disclaimer:
      "Это не юридическая подача. Слой с проверенным партнёром появится позже.",
    updateRequest: "Обновить запрос",
    requestDetails: "Детали запроса",
    requestContext:
      "Мы сохраним это вместе с текущим контекстом Move Brief. Чеклиста по документам здесь пока нет.",
    email: "Email",
    message: "Сообщение",
    messagePlaceholder:
      "Что важно передать будущему партнёрскому review о ваших сроках, блокерах или ситуации?",
    consent:
      "Я согласен, что Soft Landing может использовать мой Move Brief для подготовки partner review запроса.",
    saving: "Сохраняем...",
    submit: "Отправить на partner review",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

interface PartnerReviewFormProps {
  moveProfileId: string;
  selectedCountryId: string | null;
  selectedCityId: string | null;
  selectedLegalPathId: string | null;
  initialEmail: string;
  initialMessage: string;
  initialConsent: boolean;
  existingRequest: PartnerReviewRequest | null;
  language?: UiLanguage;
}

function formatStatus(status: string) {
  if (status === "requested") return "Requested";
  return status
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function PartnerReviewForm({
  moveProfileId,
  selectedCountryId,
  selectedCityId,
  selectedLegalPathId,
  initialEmail,
  initialMessage,
  initialConsent,
  existingRequest,
  language = "en",
}: PartnerReviewFormProps) {
  const copy = COPY[language];
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState(initialMessage);
  const [consentGiven, setConsentGiven] = useState(initialConsent);
  const [request, setRequest] = useState<PartnerReviewRequest | null>(
    existingRequest
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const canSubmit = email.trim().length > 0 && consentGiven;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    const result = await savePartnerReviewRequest({
      moveProfileId,
      selectedCountryId,
      selectedCityId,
      selectedLegalPathId,
      email,
      message,
      consentGiven,
      language,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setRequest(result.request);
    setSaved(true);
    void trackEvent("partner_review_requested", {
      moveProfileId,
      selectedCountryId,
      selectedCityId,
      selectedLegalPathId,
      status: result.request?.status ?? "requested",
    });
  }

  return (
    <div className="space-y-4">
      {request && (
        <section className="surface-card rounded-[26px] p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="editorial-kicker text-emerald-700">
                {copy.existingRequest}
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                {saved ? copy.reviewRequestSaved : copy.partnerReviewStatus}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {copy.status}: {formatStatus(request.status)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {copy.disclaimer}
              </p>
            </div>
          </div>
        </section>
      )}

      {request && (
        <FeedbackCard
          moveProfileId={moveProfileId}
          source="partner_review_success"
          mode="partner_review_success"
          language={language}
        />
      )}

      <section className="surface-card overflow-hidden rounded-[26px]">
        <div className="paper-divider border-b px-5 py-4">
          <h2 className="text-base font-semibold tracking-tight">
            {request ? copy.updateRequest : copy.requestDetails}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {copy.requestContext}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5">
          <div className="space-y-1.5">
            <Label htmlFor="partner-review-email">{copy.email}</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="partner-review-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-9"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="partner-review-message">{copy.message}</Label>
            <Textarea
              id="partner-review-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={copy.messagePlaceholder}
              className="min-h-32"
            />
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-border/80 bg-muted/35 px-4 py-4">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(event) => setConsentGiven(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border"
            />
            <span className="text-sm leading-relaxed text-foreground">
              {copy.consent}
            </span>
          </label>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={!canSubmit || saving}
            className="h-12 w-full gap-2 text-base"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {copy.saving}
              </>
            ) : (
              copy.submit
            )}
          </Button>
        </form>
      </section>
    </div>
  );
}
