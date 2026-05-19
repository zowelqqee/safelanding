import { Compass, Route, Sparkles, Target } from "lucide-react";
import { getMovePreparationLabel } from "@/lib/roadmap/roadmapGenerator";
import type { Roadmap } from "@/types";
import { RoadmapLevelCard } from "./roadmap-level-card";

interface RoadmapScreenProps {
  roadmap: Roadmap;
}

export function RoadmapScreen({ roadmap }: RoadmapScreenProps) {
  const currentLevel =
    roadmap.levels.find((level) => level.id === roadmap.currentLevelId) ?? roadmap.levels[0];
  const hasSelectedLegalPath = roadmap.levels.some(
    (level) => level.id === "choose-legal-path" && level.status === "completed"
  );
  const readinessLabel = getMovePreparationLabel(
    roadmap.readinessPercent,
    hasSelectedLegalPath
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[30px] border bg-card shadow-sm">
          <div className="border-b bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] px-5 py-6 text-white md:px-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/80">
                  <Compass className="h-3.5 w-3.5" />
                  Roadmap
                </span>
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {roadmap.title}
                  </h1>
                  <p className="text-sm text-white/75 md:text-base">{roadmap.subtitle}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">
                  Move preparation
                </p>
                <p className="mt-1 text-3xl font-semibold">{roadmap.readinessPercent}%</p>
                <p className="text-xs text-white/75">{readinessLabel}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 px-5 py-5 md:grid-cols-3 md:px-7">
            <SummaryCard
              icon={Sparkles}
              label="Current level"
              value={currentLevel.title}
            />
            <SummaryCard
              icon={Target}
              label="Next task"
              value={roadmap.nextTaskLabel}
            />
            <SummaryCard
              icon={Route}
              label="Status"
              value={`${roadmap.levels.filter((level) => level.status === "completed").length} of ${roadmap.levels.length} levels completed`}
            />
          </div>
        </section>

        <section className="space-y-4">
          {roadmap.levels.map((level, index) => (
            <RoadmapLevelCard
              key={level.id}
              level={level}
              index={index}
              isCurrent={level.id === roadmap.currentLevelId}
              currentLevelTitle={currentLevel.title}
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
    <div className="rounded-2xl border bg-background px-4 py-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">{value}</p>
    </div>
  );
}
