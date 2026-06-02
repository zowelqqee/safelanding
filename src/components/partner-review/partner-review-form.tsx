"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, ShieldCheck } from "lucide-react";
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
    existingRequest: "Request saved",
    reviewRequestSaved: "Your request has been saved",
    partnerReviewStatus: "Advisor review request",
    status: "Status",
    disclaimer:
      "This is not a legal submission. We'll use your Move Brief details when advisor matching becomes available.",
    savedNextSteps: "In the meantime — review your roadmap or compare another destination.",
    updateRequest: "Update request",
    requestDetails: "Request details",
    requestContext:
      "We'll save this with your current Move Brief context. No document checklist appears here.",
    email: "Email",
    message: "Message",
    messagePlaceholder:
      "Anything an advisor should know about your timing, blockers, or situation?",
    consent:
      "I agree that Soft Landing may use my Move Brief to prepare context for an advisor review.",
    saving: "Saving...",
    submit: "Request advisor review",
    viewMoveBrief: "View Move Brief",
    reviewRoadmap: "Review roadmap",
  },
  ru: {
    existingRequest: "Запрос сохранён",
    reviewRequestSaved: "Ваш запрос сохранён",
    partnerReviewStatus: "Запрос на консультацию советника",
    status: "Статус",
    disclaimer:
      "Это не юридическая подача. Мы используем вашу сводку переезда, когда подбор советников станет доступен.",
    savedNextSteps: "Пока можно посмотреть план или сравнить другое направление.",
    updateRequest: "Обновить запрос",
    requestDetails: "Детали запроса",
    requestContext:
      "Мы сохраним это вместе с текущей сводкой переезда. Списка документов здесь пока нет.",
    email: "Email",
    message: "Сообщение",
    messagePlaceholder:
      "Что советнику важно знать о ваших сроках, рисках или ситуации?",
    consent:
      "Я согласен, что Soft Landing может использовать мою сводку переезда для подготовки запроса на консультацию.",
    saving: "Сохраняем...",
    submit: "Отправить запрос",
    viewMoveBrief: "Открыть сводку",
    reviewRoadmap: "Открыть план",
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
        <section className="city-card rounded-[26px] p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="city-section-kicker text-emerald-700 mb-1">
                {copy.existingRequest}
              </p>
              <h2 className="text-base font-semibold tracking-tight text-stone-900">
                {saved ? copy.reviewRequestSaved : copy.partnerReviewStatus}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--city-muted-fg)]">
                {copy.disclaimer}
              </p>
              {saved && (
                <p className="mt-2 text-sm leading-relaxed text-[var(--city-muted-fg)]">
                  {copy.savedNextSteps}
                </p>
              )}
            </div>
          </div>
          {saved && (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link href="/app/move-brief" className="flex-1">
                <Button variant="outline" size="sm" className="w-full gap-2 rounded-full border-[var(--city-border)] text-stone-700">
                  {copy.viewMoveBrief}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/app/roadmap" className="flex-1">
                <Button variant="outline" size="sm" className="w-full gap-2 rounded-full border-[var(--city-border)] text-stone-700">
                  {copy.reviewRoadmap}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}
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
