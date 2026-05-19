import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Clock3,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoadmapNode as RoadmapNodeData, RoadmapStatus } from "@/types";

function getStatusCopy(status: RoadmapStatus) {
  switch (status) {
    case "completed":
      return "Completed";
    case "active":
      return "Active";
    case "waiting":
      return "Queued";
    case "blocked":
      return "Blocked";
    default:
      return "Locked";
  }
}

function getStatusClasses(status: RoadmapStatus) {
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

function StatusIcon({ status }: { status: RoadmapStatus }) {
  if (status === "completed") {
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  }

  if (status === "active") {
    return <CircleDot className="h-4 w-4 text-sky-600" />;
  }

  if (status === "waiting") {
    return <Clock3 className="h-4 w-4 text-amber-600" />;
  }

  if (status === "blocked") {
    return <AlertTriangle className="h-4 w-4 text-rose-600" />;
  }

  return <Lock className="h-4 w-4 text-muted-foreground" />;
}

interface RoadmapNodeProps {
  node: RoadmapNodeData;
}

export function RoadmapNode({ node }: RoadmapNodeProps) {
  const isInteractive =
    (node.status === "active" || node.status === "completed") && Boolean(node.href);
  const content = (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 transition-colors",
        node.status === "active" && "border-sky-200 bg-sky-50/80 shadow-[0_0_0_1px_rgba(186,230,253,0.55)]",
        node.status === "completed" && "border-emerald-200 bg-emerald-50/80",
        node.status === "locked" && "border-dashed border-border bg-muted/35 opacity-80",
        node.status === "waiting" && "border-amber-200 bg-amber-50/80",
        isInteractive && "hover:border-sky-300 hover:bg-sky-50"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <StatusIcon status={node.status} />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-foreground">{node.title}</p>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                getStatusClasses(node.status)
              )}
            >
              {getStatusCopy(node.status)}
            </span>
          </div>
          {node.description && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {node.description}
            </p>
          )}
          {isInteractive && (
            <p className="text-xs font-medium text-sky-700">
              {node.status === "completed" ? "Review or edit" : "Open form"}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (isInteractive && node.href) {
    return (
      <Link href={node.href} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {content}
      </Link>
    );
  }

  return content;
}
