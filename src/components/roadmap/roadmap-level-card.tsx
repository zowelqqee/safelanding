import Link from "next/link";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RoadmapLevel, RoadmapStatus } from "@/types";
import { RoadmapNode } from "./roadmap-node";

function getLevelStatusCopy(status: RoadmapStatus) {
  switch (status) {
    case "completed":
      return "Completed";
    case "active":
      return "In progress";
    case "waiting":
      return "Waiting";
    case "blocked":
      return "Blocked";
    default:
      return "Locked";
  }
}

function getLevelStatusClasses(status: RoadmapStatus) {
  switch (status) {
    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "active":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "waiting":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "blocked":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-border bg-muted text-muted-foreground";
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
      ? `This level is complete. Your next focus is ${currentLevelTitle}.`
      : level.id === "prepare-documents" && level.status === "active"
        ? "Verified document guidance comes later. This stage unlocks with partner-reviewed support."
      : level.status === "active"
        ? "Complete the current step to keep your move progressing."
        : "This stage unlocks after your move profile is complete.";

  return (
    <section className="relative pl-6">
      {index > 0 && (
        <div className="absolute bottom-full left-[11px] top-[-20px] w-px bg-[linear-gradient(180deg,rgba(148,163,184,0.15),rgba(148,163,184,0.7),rgba(148,163,184,0.15))]" />
      )}

      <div
        className={cn(
          "route-dot absolute left-0 top-6 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold",
          level.status === "completed" && "border-emerald-300 bg-[linear-gradient(180deg,#ecfdf5,#d1fae5)] text-emerald-700",
          level.status === "active" && "border-sky-300 bg-[linear-gradient(180deg,#f0f9ff,#e0f2fe)] text-sky-700",
          level.status === "locked" && "border-border bg-background text-muted-foreground",
          level.status === "waiting" && "border-amber-200 bg-[linear-gradient(180deg,#fffbeb,#fef3c7)] text-amber-700",
          level.status === "blocked" && "border-rose-200 bg-rose-50 text-rose-700"
        )}
      >
        {index + 1}
      </div>

      <div
        className={cn(
          "surface-card rounded-[26px] p-5 transition-colors",
          isCurrent && "border-sky-200 shadow-[0_0_0_1px_rgba(125,211,252,0.22),0_16px_36px_rgba(15,23,42,0.05)]",
          isLocked && "opacity-95"
        )}
      >
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                {level.title}
              </h2>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-[0.12em] uppercase",
                  getLevelStatusClasses(level.status)
                )}
              >
                {getLevelStatusCopy(level.status)}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {level.description}
            </p>
          </div>

          {isCurrent && (
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700">
              <Sparkles className="h-3.5 w-3.5" />
              Active now
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-medium text-foreground">{level.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                level.status === "completed" && "bg-emerald-500",
                level.status === "active" && "bg-sky-500",
                level.status === "locked" && "bg-border",
                level.status === "waiting" && "bg-amber-500",
                level.status === "blocked" && "bg-rose-500"
              )}
              style={{ width: `${level.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {level.nodes.map((node) => (
            <RoadmapNode key={node.id} node={node} />
          ))}
        </div>

        {level.ctaLabel && level.status === "active" && (
          <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50/70 px-4 py-4">
            {level.ctaDescription && (
              <p className="text-sm leading-relaxed text-sky-800">{level.ctaDescription}</p>
            )}
            <Button disabled className="mt-3 h-11 w-full md:w-auto">
              {level.ctaLabel}
            </Button>
          </div>
        )}

        {level.id === "prepare-documents" && level.status === "active" && (
          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <Link href="/app/partner-review" className="inline-flex">
              <Button className="h-11 w-full md:w-auto">
                Request partner review
              </Button>
            </Link>
            <Link href="/app/move-brief" className="inline-flex">
              <Button variant="outline" className="h-11 w-full md:w-auto">
                View Move Brief
              </Button>
            </Link>
          </div>
        )}

        <div
          className={cn(
            "mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs",
            level.status === "completed" && "border border-emerald-200 bg-emerald-50 text-emerald-700",
            level.status === "active" && "border border-sky-200 bg-sky-50 text-sky-700",
            level.status !== "completed" &&
              level.status !== "active" &&
              "border border-dashed border-border bg-background text-muted-foreground"
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
