import Link from "next/link";
import { ArrowRight, ClipboardList, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentMoveProfileServer } from "@/lib/profile/profileServer";
import { generateRoadmap } from "@/lib/roadmap/roadmapGenerator";

export default async function TasksPage() {
  const profile = await getCurrentMoveProfileServer();

  if (!profile) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <EmptyState
          icon={ClipboardList}
          title="Your task list starts with onboarding"
          description="Once you choose your destination and path, we'll surface the active tasks here."
          href="/start"
          ctaLabel="Start your move"
        />
      </div>
    );
  }

  const roadmap = generateRoadmap(profile);
  const currentLevel =
    roadmap.levels.find((level) => level.id === roadmap.currentLevelId) ?? roadmap.levels[0];
  const activeNode = currentLevel.nodes.find((node) => node.status === "active");
  const visibleNodes = currentLevel.nodes.filter(
    (node) => node.status === "active" || node.status === "waiting"
  );
  const shouldShowMoveBriefLink = roadmap.nextTaskLabel === "Request partner review";

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
      <div className="space-y-0.5">
        <p className="city-section-kicker mb-1">Action layer</p>
        <h1 className="font-serif text-2xl font-medium text-stone-900">Tasks</h1>
        <p className="text-sm text-[var(--city-muted-fg)]">
          A lightweight view of what your roadmap says to do next.
        </p>
      </div>

      <div className="city-card rounded-[22px] p-5">
        <div className="flex items-center gap-2 city-section-kicker mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          Next task
        </div>
        <h2 className="text-base font-semibold tracking-tight text-stone-900">{roadmap.nextTaskLabel}</h2>
        <p className="mt-1 text-sm text-[var(--city-muted-fg)]">
          Current level: {currentLevel.title}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {activeNode?.href && (
            <Link href={activeNode.href}>
              <Button size="sm" className="gap-2 rounded-full">
                Open current step
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
          {shouldShowMoveBriefLink && (
            <Link href="/app/partner-review">
              <Button size="sm" variant="outline" className="gap-2 rounded-full border-[var(--city-border)]">
                Request partner review
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-[var(--city-muted-fg)]" />
          <span className="text-sm font-semibold text-stone-900">Active roadmap nodes</span>
        </div>

        {visibleNodes.length > 0 ? (
          <div className="space-y-2.5">
            {visibleNodes.map((node) => (
              <div
                key={node.id}
                className="city-card rounded-2xl px-4 py-3.5"
              >
                <p className="text-sm font-medium text-stone-900">{node.title}</p>
                <p className="mt-1 text-xs text-[var(--city-muted-fg)]">
                  {node.status === "active"
                    ? "This is the next thing to tackle in your roadmap."
                    : "Queued right after the current step clears."}
                </p>
                {node.status === "active" && node.href && (
                  <Link href={node.href} className="mt-3 inline-flex">
                    <Button size="sm" variant="outline" className="gap-2 rounded-full border-[var(--city-border)]">
                      Open form
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--city-border)] px-4 py-6 text-center text-sm text-[var(--city-muted-fg)]">
            Your active roadmap tasks will show up here as soon as a level opens.
          </div>
        )}
      </section>

      <div className="rounded-2xl border border-dashed border-[var(--city-border)] px-4 py-4 text-sm text-[var(--city-muted-fg)]">
        Full task tracking is coming next. For now, this page mirrors the active parts of your roadmap.
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  href,
  ctaLabel,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
}) {
  return (
    <div className="city-card rounded-[28px] p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]">
        <Icon className="h-6 w-6 text-stone-600" />
      </div>
      <h1 className="mt-5 font-serif text-2xl font-medium text-stone-900">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--city-muted-fg)]">{description}</p>
      <Link href={href} className="mt-6 inline-flex">
        <Button size="lg" className="gap-2 rounded-full">
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
