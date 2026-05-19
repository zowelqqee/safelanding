import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerReviewForm } from "@/components/partner-review/partner-review-form";
import { getCurrentUserWithMoveProfile } from "@/lib/profile/profileServer";
import { getPartnerReviewRequestServer } from "@/lib/partner-review/partner-review";
import { buildMoveBrief } from "@/lib/move-brief/build-move-brief";

export const metadata = {
  title: "Request Partner Review — Soft Landing",
};

export default async function PartnerReviewPage() {
  const { user, profile } = await getCurrentUserWithMoveProfile();

  if (!user || !profile) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="rounded-[28px] border bg-card p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Build your Move Brief first
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Choose your destination, legal path, and roadmap details first, then you can save a partner review request here.
          </p>
          <Link href="/app/roadmap" className="mt-6 inline-flex">
            <Button size="lg" className="gap-2">
              Open roadmap
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const existingRequest = await getPartnerReviewRequestServer(user.id, profile.id);
  const brief = buildMoveBrief(profile);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
      <div className="space-y-5">
        <section className="overflow-hidden rounded-[30px] border bg-card shadow-sm">
          <div className="border-b bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] px-5 py-6 text-white md:px-7">
            <Link
              href="/app/move-brief"
              className="inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Move Brief
            </Link>

            <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/80">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Partner review
                </span>
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    Request partner review
                  </h1>
                  <p className="max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
                    We&apos;ll use your Move Brief to help a verified relocation partner understand your situation faster.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">
                  Move brief
                </p>
                <p className="mt-1 text-lg font-semibold">{brief.headline}</p>
                <p className="text-xs text-white/75">{brief.destination.legalPath}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 px-5 py-5 md:grid-cols-2 md:px-7">
            <SummaryCard label="Current stage" value={brief.destination.currentStage} />
            <SummaryCard label="Move goal" value={brief.destination.moveGoal} />
          </div>
        </section>

        <PartnerReviewForm
          moveProfileId={profile.id}
          selectedCountryId={profile.selected_country_id}
          selectedCityId={profile.selected_city_id}
          selectedLegalPathId={profile.selected_legal_path_id}
          initialEmail={existingRequest?.email ?? user.email ?? ""}
          initialMessage={existingRequest?.message ?? ""}
          initialConsent={existingRequest?.consent_given ?? false}
          existingRequest={existingRequest}
        />

        <div className="rounded-2xl border border-dashed px-4 py-4 text-sm text-muted-foreground">
          This request saves contact context only. No document checklist, file upload, payment, or real partner integration is active yet.
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-background px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">{value}</p>
    </div>
  );
}
