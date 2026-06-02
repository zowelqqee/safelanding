import Link from "next/link";
import { ArrowRight, ClipboardList, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentMoveProfileServer } from "@/lib/profile/profileServer";
import { generateRoadmap } from "@/lib/roadmap/roadmapGenerator";
import { getServerLanguage } from "@/lib/i18n/server";

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

  const language = await getServerLanguage(profile.preferred_language);
  const roadmap = generateRoadmap(profile, language);
  const currentLevel =
    roadmap.levels.find((level) => level.id === roadmap.currentLevelId) ?? roadmap.levels[0];
  const activeNode = currentLevel.nodes.find((node) => node.status === "active");
  const visibleNodes = currentLevel.nodes.filter(
    (node) => node.status === "active" || node.status === "waiting"
  );
  const TASKS_COPY = {
    en: {
      kicker: "Action layer",
      title: "Tasks",
      subtitle: "A lightweight view of what your roadmap says to do next.",
      nextTask: "Next task",
      currentLevel: "Current level",
      openStep: "Open current step",
      requestReview: "Request advisor review",
      activeNodes: "Active roadmap steps",
      nodeActive: "This is the next step in your roadmap.",
      nodeQueued: "Queued right after the current step clears.",
      openForm: "Open form",
      emptyNodes: "Your active roadmap tasks will show up here once a stage opens.",
    },
    ru: {
      kicker: "Действия",
      title: "Задачи",
      subtitle: "Краткий обзор того, что ваш план предлагает сделать следующим.",
      nextTask: "Следующий шаг",
      currentLevel: "Текущий этап",
      openStep: "Открыть текущий шаг",
      requestReview: "Консультация советника",
      activeNodes: "Активные шаги плана",
      nodeActive: "Это следующий шаг в вашем плане.",
      nodeQueued: "В очереди сразу после текущего шага.",
      openForm: "Открыть форму",
      emptyNodes: "Активные шаги появятся здесь, как только откроется следующий этап.",
    },
  } as const;

  const tc = TASKS_COPY[language];
  const shouldShowAdvisorLink = roadmap.levels.find(
    (l) => l.id === "prepare-documents" && l.status === "active"
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
      <div className="space-y-0.5">
        <p className="city-section-kicker mb-1">{tc.kicker}</p>
        <h1 className="font-serif text-2xl font-medium text-stone-900">{tc.title}</h1>
        <p className="text-sm text-[var(--city-muted-fg)]">{tc.subtitle}</p>
      </div>

      <div className="city-card rounded-[22px] p-5">
        <div className="flex items-center gap-2 city-section-kicker mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          {tc.nextTask}
        </div>
        <h2 className="text-base font-semibold tracking-tight text-stone-900">{roadmap.nextTaskLabel}</h2>
        <p className="mt-1 text-sm text-[var(--city-muted-fg)]">
          {tc.currentLevel}: {currentLevel.title}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {activeNode?.href && (
            <Link href={activeNode.href}>
              <Button size="sm" className="gap-2 rounded-full">
                {tc.openStep}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
          {shouldShowAdvisorLink && (
            <Link href="/app/partner-review">
              <Button size="sm" variant="outline" className="gap-2 rounded-full border-[var(--city-border)]">
                {tc.requestReview}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-[var(--city-muted-fg)]" />
          <span className="text-sm font-semibold text-stone-900">{tc.activeNodes}</span>
        </div>

        {visibleNodes.length > 0 ? (
          <div className="space-y-2.5">
            {visibleNodes.map((node) => (
              <div key={node.id} className="city-card rounded-2xl px-4 py-3.5">
                <p className="text-sm font-medium text-stone-900">{node.title}</p>
                <p className="mt-1 text-xs text-[var(--city-muted-fg)]">
                  {node.status === "active" ? tc.nodeActive : tc.nodeQueued}
                </p>
                {node.status === "active" && node.href && (
                  <Link href={node.href} className="mt-3 inline-flex">
                    <Button size="sm" variant="outline" className="gap-2 rounded-full border-[var(--city-border)]">
                      {tc.openForm}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--city-border)] px-4 py-6 text-center text-sm text-[var(--city-muted-fg)]">
            {tc.emptyNodes}
          </div>
        )}
      </section>
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
