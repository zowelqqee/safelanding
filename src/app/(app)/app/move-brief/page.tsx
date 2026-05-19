import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Globe,
  MapPin,
  Route,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentMoveProfileServer } from "@/lib/profile/profileServer";
import { buildMoveBrief } from "@/lib/move-brief/build-move-brief";

export const metadata = {
  title: "Move Brief — Soft Landing",
};

export default async function MoveBriefPage() {
  const profile = await getCurrentMoveProfileServer();

  if (!profile) {
    return (
      <div className="mx-auto flex max-w-xl px-4 py-8">
        <EmptyState />
      </div>
    );
  }

  const brief = buildMoveBrief(profile);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
      <div className="space-y-5">
        <section className="overflow-hidden rounded-[30px] border bg-card shadow-sm">
          <div className="border-b bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] px-5 py-6 text-white md:px-7">
            <Link
              href="/app/roadmap"
              className="inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to roadmap
            </Link>

            <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/80">
                  <FileText className="h-3.5 w-3.5" />
                  Move brief
                </span>
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    Your Move Brief
                  </h1>
                  <p className="max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
                    A clear summary of your destination, legal path, blockers, and next step.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">
                  Current stage
                </p>
                <p className="mt-1 text-lg font-semibold">{brief.destination.currentStage}</p>
                <p className="text-xs text-white/75">{brief.destination.legalPath}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 px-5 py-5 md:grid-cols-2 md:px-7">
            <SummaryCard
              icon={MapPin}
              label="Destination"
              value={`${brief.headline}`}
            />
            <SummaryCard
              icon={Route}
              label="Move goal"
              value={brief.destination.moveGoal}
            />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <Card>
              <CardHeader
                title="Destination summary"
                subtitle="Where you are planning to go and what route you are currently building around."
              />
              <div className="space-y-4 px-5 py-5">
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    {brief.headline}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {brief.destination.legalPath}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailCard label="Country" value={brief.destination.country} />
                  <DetailCard label="City" value={brief.destination.city} />
                  <DetailCard label="Legal path" value={brief.destination.legalPath} />
                  <DetailCard label="Current stage" value={brief.destination.currentStage} />
                </div>

                <div className="rounded-2xl border bg-muted/35 px-4 py-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Goal
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {brief.destination.moveGoal}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="User profile summary"
                subtitle="The current facts your roadmap and fit logic are using."
              />
              <div className="divide-y">
                {brief.profileSummary.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 px-5 py-4"
                  >
                    <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Main blockers"
                subtitle="Pressure points to verify before this plan becomes document-ready."
              />
              <div className="space-y-3 px-5 py-5">
                {brief.blockers.map((blocker) => (
                  <div
                    key={blocker}
                    className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                      <p className="text-sm leading-relaxed text-amber-950">{blocker}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader
                title="Fit summary"
                subtitle="A high-level fit view based on your current profile and selection."
              />
              <div className="space-y-3 px-5 py-5">
                <FitCard label="Overall fit" fit={brief.fit.overall} />
                <FitCard label="Lifestyle fit" fit={brief.fit.lifestyle} />
                <FitCard label="Legal fit" fit={brief.fit.legal} />
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Recommended next step"
                subtitle="The safest next move before any document-level work exists in product."
              />
              <div className="space-y-4 px-5 py-5">
                <div className="rounded-2xl border border-sky-200 bg-sky-50/80 px-4 py-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-sky-700">
                    Primary next step
                  </p>
                  <p className="mt-2 text-sm font-medium text-sky-950">
                    Request partner-reviewed document guidance
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-sky-900">
                    Use this brief to prepare a cleaner handoff before document guidance is unlocked.
                  </p>
                </div>

                <div className="space-y-2">
                  <Link href="/app/partner-review" className="block">
                    <Button className="h-11 w-full justify-between gap-2">
                      Request partner review
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/app/explore" className="block">
                    <Button variant="outline" className="h-11 w-full justify-between gap-2">
                      Compare another destination
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/app/roadmap" className="block">
                    <Button variant="outline" className="h-11 w-full justify-between gap-2">
                      Review roadmap
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/app/profile" className="block">
                    <Button variant="outline" className="h-11 w-full justify-between gap-2">
                      Edit move profile
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Prepared for partner review"
                subtitle="A placeholder handoff state for the partner-reviewed layer that comes later."
              />
              <div id="partner-review" className="space-y-4 px-5 py-5 scroll-mt-24">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  This brief can later be shared with a verified relocation partner or agency so they can understand your situation faster.
                </p>

                <div className="rounded-2xl border border-dashed bg-muted/35 px-4 py-4">
                  <p className="text-sm leading-relaxed text-foreground">
                    No submission, payment, upload, or external integration is active yet.
                  </p>
                </div>

                <Link href="/app/partner-review" className="block">
                  <Button className="h-11 w-full gap-2">
                    Request partner review
                  </Button>
                </Link>
              </div>
            </Card>

            <div className="rounded-2xl border border-dashed px-4 py-4 text-sm text-muted-foreground">
              This brief is a planning summary, not legal advice. Requirements vary and should be verified before applying.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="overflow-hidden rounded-[26px] border bg-card shadow-sm">{children}</section>;
}

function CardHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="border-b px-5 py-4">
      <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-background px-4 py-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">{value}</p>
    </div>
  );
}

function DetailCard({
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

function FitCard({
  label,
  fit,
}: {
  label: string;
  fit: { label: "Strong" | "Medium" | "Weak"; score?: number };
}) {
  return (
    <div className="rounded-2xl border bg-background px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{fit.label}</span>
        {typeof fit.score === "number" && (
          <span className="inline-flex items-center rounded-full border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
            {fit.score}%
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full rounded-[28px] border bg-card p-6 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <CheckCircle2 className="h-6 w-6 text-primary" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">Build your move brief</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Start onboarding or finish your roadmap selections first, then we&apos;ll summarize your destination, path, blockers, and next step here.
      </p>
      <Link href="/app/roadmap" className="mt-6 inline-flex">
        <Button size="lg" className="gap-2">
          Open roadmap
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
      <Link href="/start" className="mt-3 inline-flex">
        <Button variant="outline" size="lg" className="gap-2">
          Start onboarding
          <Globe className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
