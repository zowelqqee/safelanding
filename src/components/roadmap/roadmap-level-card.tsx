import Link from "next/link";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RoadmapLevel, RoadmapStatus } from "@/types";
import { RoadmapNode } from "./roadmap-node";

function getLevelStatusCopy(status: RoadmapStatus) {
  switch (status) {
    case "completed": return "Completed";
    case "active": return "In progress";
    case "waiting": return "Waiting";
    case "blocked": return "Blocked";
    default: return "Locked";
  }
}

function getLevelStatusClasses(status: RoadmapStatus) {
  switch (status) {
    case "completed": return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "active": return "border-amber-200 bg-amber-50 text-amber-800";
    case "waiting": return "border-stone-200 bg-stone-50 text-stone-600";
    case "blocked": return "border-rose-200 bg-rose-50 text-rose-700";
    default: return "border-[var(--city-border)] bg-[var(--city-warm-muted)] text-[var(--city-muted-fg)]";
  }
}

function getProgressBarClass(status: RoadmapStatus) {
  switch (status) {
    case "completed": return "bg-emerald-500";
    case "active": return "bg-amber-500";
    case "waiting": return "bg-stone-400";
    case "blocked": return "bg-rose-500";
    default: return "bg-[var(--city-border)]";
  }
}

interface RoadmapLevelCardProps {
  level: RoadmapLevel;
  index: number;
  isCurrent: boolean;
  currentLevelTitle: string;
}

export function RoadmapLevelCard({
  level,
  index,
  isCurrent,
  currentLevelTitle,
}: RoadmapLevelCardProps) {
  const isLocked = level.status === "locked";
  const footerCopy =
    level.status === "completed"
      ? `Complete. Next focus: ${currentLevelTitle}.`
      : level.id === "prepare-documents" && level.status === "active"
        ? "Verified document guidance comes after partner-reviewed support is unlocked."
        : level.status === "active"
          ? "Complete this step to keep your move progressing."
          : "Unlocks after your move profile is further along.";

  return (
    <section className="relative pl-6">
      {index > 0 && (
        <div className="absolute bottom-full left-[11px] top-[-20px] w-px bg-[linear-gradient(180deg,rgba(180,160,120,0.1),rgba(180,160,120,0.5),rgba(180,160,120,0.1))]" />
      )}

      {/* Level dot */}
      <div
        className={cn(
          "route-dot absolute left-0 top-6 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold",
          level.status === "completed" && "border-emerald-300 bg-emerald-50 text-emerald-700",
          level.status === "active" && "border-amber-300 bg-amber-50 text-amber-700",
          level.status === "locked" && "border-[var(--city-border)] bg-[var(--city-warm-muted)] text-[var(--city-muted-fg)]",
          level.status === "waiting" && "border-stone-300 bg-stone-50 text-stone-600",
          level.status === "blocked" && "border-rose-200 bg-rose-50 text-rose-700"
        )}
      >
        {index + 1}
      </div>

      <div
        className={cn(
          "city-card rounded-[24px] p-5 transition-colors",
          isCurrent && "border-amber-300/60 shadow-[0_0_0_1px_rgba(217,119,6,0.12),0_12px_28px_rgba(120,80,20,0.07)]",
          isLocked && "opacity-80"
        )}
      >
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight text-stone-900">
                {level.title}
              </h2>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-[0.10em] uppercase",
                  getLevelStatusClasses(level.status)
                )}
              >
                {getLevelStatusCopy(level.status)}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--city-muted-fg)]">
              {level.description}
            </p>
          </div>

          {isCurrent && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800">
              <Sparkles className="h-3.5 w-3.5" />
              Active now
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[var(--city-muted-fg)]">
            <span>Progress</span>
            <span className="font-medium text-stone-800">{level.progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--city-warm-muted)]">
            <div
              className={cn("h-full rounded-full transition-all duration-500", getProgressBarClass(level.status))}
              style={{ width: `${level.progress}%` }}
            />
          </div>
        </div>

        {/* Nodes */}
        <div className="mt-5 space-y-2.5">
          {level.nodes.map((node) => (
            <RoadmapNode key={node.id} node={node} />
          ))}
        </div>

        {/* CTA */}
        {level.ctaLabel && level.status === "active" && (
          <div className="mt-4 rounded-2xl border border-amber-200/60 bg-amber-50/50 px-4 py-4">
            {level.ctaDescription && (
              <p className="text-sm leading-relaxed text-amber-900">{level.ctaDescription}</p>
            )}
            <Button disabled className="mt-3 h-10 w-full rounded-full md:w-auto">
              {level.ctaLabel}
            </Button>
          </div>
        )}

        {level.id === "prepare-documents" && level.status === "active" && (
          <div className="mt-4 flex flex-col gap-2.5 md:flex-row">
            <Link href="/app/partner-review" className="inline-flex">
              <Button className="h-10 w-full rounded-full md:w-auto">
                Request partner review
              </Button>
            </Link>
            <Link href="/app/move-brief" className="inline-flex">
              <Button variant="outline" className="h-10 w-full rounded-full md:w-auto border-[var(--city-border)]">
                View Move Brief
              </Button>
            </Link>
          </div>
        )}

        {/* Footer note */}
        <div
          className={cn(
            "mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs",
            level.status === "completed" && "border border-emerald-200/60 bg-emerald-50/60 text-emerald-800",
            level.status === "active" && "border border-amber-200/60 bg-amber-50/50 text-amber-900",
            level.status !== "completed" &&
              level.status !== "active" &&
              "border border-dashed border-[var(--city-border)] bg-[var(--city-warm-muted)]/50 text-[var(--city-muted-fg)]"
          )}
        >
          {level.status === "completed" ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          ) : level.status === "active" ? (
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <Lock className="h-3.5 w-3.5 shrink-0" />
          )}
          <span className="flex-1">{footerCopy}</span>
        </div>
      </div>
    </section>
  );
}
