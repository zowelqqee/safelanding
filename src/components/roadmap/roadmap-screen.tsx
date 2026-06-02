import Link from "next/link";
import { Route, Sparkles, Target } from "lucide-react";
import { getMovePreparationLabel } from "@/lib/roadmap/roadmapGenerator";
import type { Roadmap } from "@/types";
import { Button } from "@/components/ui/button";
import { RoadmapLevelCard } from "./roadmap-level-card";

const SCREEN_COPY = {
  en: {
    kicker: "Relocation roadmap",
    movePreparation: "Move preparation",
    currentLevel: "Current level",
    nextTask: "Next task",
    status: "Status",
    levelsDone: (done: number, total: number) => `${done} of ${total} levels done`,
    viewMoveBrief: "View Move Brief",
  },
  ru: {
    kicker: "План переезда",
    movePreparation: "Готовность к переезду",
    currentLevel: "Текущий этап",
    nextTask: "Следующий шаг",
    status: "Статус",
    levelsDone: (done: number, total: number) => `${done} из ${total} этапов пройдено`,
    viewMoveBrief: "Открыть сводку",
  },
} as const;

interface RoadmapScreenProps {
  roadmap: Roadmap;
}

export function RoadmapScreen({ roadmap }: RoadmapScreenProps) {
  const lang = roadmap.language ?? "en";
  const copy = SCREEN_COPY[lang];

  const currentLevel =
    roadmap.levels.find((level) => level.id === roadmap.currentLevelId) ?? roadmap.levels[0];
  const hasSelectedLegalPath = roadmap.levels.some(
    (level) => level.id === "choose-legal-path" && level.status === "completed"
  );
  const readinessLabel = getMovePreparationLabel(
    roadmap.readinessPercent,
    hasSelectedLegalPath,
    lang
  );
  const doneCount = roadmap.levels.filter((l) => l.status === "completed").length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
      <div className="space-y-5">
        {/* Header card */}
        <section className="city-card overflow-hidden rounded-[28px]">
          <div className="border-b border-[var(--city-border)] bg-[var(--city-warm-muted)] px-5 py-6 md:px-7">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="min-w-0 space-y-2">
                <p className="city-section-kicker">{copy.kicker}</p>
                <div>
                  <h1 className="font-serif text-2xl font-medium tracking-tight text-stone-900 md:text-3xl">
                    {roadmap.title}
                  </h1>
                  <p className="mt-1 text-sm text-[var(--city-muted-fg)] md:text-base">{roadmap.subtitle}</p>
                </div>
                <Link href="/app/move-brief" className="inline-flex pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-[var(--city-border)] text-stone-700 bg-transparent hover:bg-[var(--city-card)]"
                  >
                    {copy.viewMoveBrief}
                  </Button>
                </Link>
              </div>

              <div className="city-card rounded-2xl px-5 py-4 text-right">
                <p className="city-section-kicker mb-1">{copy.movePreparation}</p>
                <p className="font-serif text-4xl font-medium text-stone-900">{roadmap.readinessPercent}%</p>
                <p className="text-xs text-[var(--city-muted-fg)] mt-0.5">{readinessLabel}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 px-5 py-5 md:grid-cols-3 md:px-7">
            <SummaryCard icon={Sparkles} label={copy.currentLevel} value={currentLevel.title} />
            <SummaryCard icon={Target} label={copy.nextTask} value={roadmap.nextTaskLabel} />
            <SummaryCard
              icon={Route}
              label={copy.status}
              value={copy.levelsDone(doneCount, roadmap.levels.length)}
            />
          </div>
        </section>

        {/* Level list */}
        <section className="space-y-4">
          {roadmap.levels.map((level, index) => (
            <RoadmapLevelCard
              key={level.id}
              level={level}
              index={index}
              isCurrent={level.id === roadmap.currentLevelId}
              currentLevelTitle={currentLevel.title}
              language={lang}
            />
          ))}
        </section>
      </div>
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
    <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-card)] px-4 py-4">
      <div className="flex items-center gap-2 city-section-kicker mb-2">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-sm font-medium leading-snug text-stone-900">{value}</p>
    </div>
  );
}
