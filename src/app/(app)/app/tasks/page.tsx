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
          description="Once you choose your destination and path, we&apos;ll surface the active tasks here."
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
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          A lightweight view of what your roadmap says to do next.
        </p>
      </div>

      <div className="rounded-[26px] border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Next task
        </div>
        <h2 className="mt-3 text-lg font-semibold tracking-tight">{roadmap.nextTaskLabel}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Current level: {currentLevel.title}
        </p>
        {activeNode?.href && (
          <Link href={activeNode.href} className="mt-4 inline-flex">
            <Button size="sm" className="gap-2">
              Open current step
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
        {shouldShowMoveBriefLink && (
          <Link href="/app/partner-review" className="mt-3 inline-flex">
            <Button size="sm" variant="outline" className="gap-2">
              Request partner review
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Compass className="h-4 w-4 text-primary" />
          Active roadmap nodes
        </div>

        {visibleNodes.length > 0 ? (
          <div className="space-y-2">
            {visibleNodes.map((node) => (
              <div
                key={node.id}
                className="rounded-2xl border bg-card px-4 py-3"
              >
                <p className="text-sm font-medium text-foreground">{node.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {node.status === "active"
                    ? "This is the next thing to tackle in your roadmap."
                    : "Queued right after the current step clears."}
                </p>
                {node.status === "active" && node.href && (
                  <Link href={node.href} className="mt-3 inline-flex">
                    <Button size="sm" variant="outline" className="gap-2">
                      Open form
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            Your active roadmap tasks will show up here as soon as a level opens.
          </div>
        )}
      </section>

      <div className="rounded-2xl border border-dashed px-4 py-4 text-sm text-muted-foreground">
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
    <div className="rounded-[28px] border bg-card p-6 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <Link href={href} className="mt-6 inline-flex">
        <Button size="lg" className="gap-2">
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
