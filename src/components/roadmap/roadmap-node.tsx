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

type UiLang = "en" | "ru";

const NODE_COPY = {
  en: {
    status: {
      completed: "Completed",
      active:    "Active",
      waiting:   "Queued",
      blocked:   "Blocked",
      locked:    "Locked",
    },
    reviewOrUpdate: "Review or update",
    continue: "Continue",
  },
  ru: {
    status: {
      completed: "Готово",
      active:    "Активный",
      waiting:   "В очереди",
      blocked:   "Заблокирован",
      locked:    "Закрыт",
    },
    reviewOrUpdate: "Просмотреть или обновить",
    continue: "Продолжить",
  },
} as const;

function getStatusCopy(status: RoadmapStatus, lang: UiLang) {
  const s = NODE_COPY[lang].status;
  switch (status) {
    case "completed": return s.completed;
    case "active":    return s.active;
    case "waiting":   return s.waiting;
    case "blocked":   return s.blocked;
    default:          return s.locked;
  }
}

function getStatusClasses(status: RoadmapStatus) {
  switch (status) {
    case "completed": return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "active":    return "border-amber-200 bg-amber-50 text-amber-700";
    case "waiting":   return "border-amber-200 bg-amber-50 text-amber-700";
    case "blocked":   return "border-rose-200 bg-rose-50 text-rose-700";
    default:          return "border-[var(--city-border)] bg-[var(--city-warm-muted)] text-[var(--city-muted-fg)]";
  }
}

function StatusIcon({ status }: { status: RoadmapStatus }) {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (status === "active")    return <CircleDot    className="h-4 w-4 text-amber-600" />;
  if (status === "waiting")   return <Clock3       className="h-4 w-4 text-amber-600" />;
  if (status === "blocked")   return <AlertTriangle className="h-4 w-4 text-rose-600" />;
  return <Lock className="h-4 w-4 text-[var(--city-muted-fg)]" />;
}

interface RoadmapNodeProps {
  node: RoadmapNodeData;
  language?: UiLang;
}

export function RoadmapNode({ node, language = "en" }: RoadmapNodeProps) {
  const c = NODE_COPY[language];
  const isInteractive =
    (node.status === "active" || node.status === "completed") && Boolean(node.href);

  const content = (
    <div
      className={cn(
        "rounded-[22px] border px-4 py-3 transition-colors",
        node.status === "active"    && "border-amber-300/70 bg-amber-50/80",
        node.status === "completed" && "border-emerald-200 bg-emerald-50/60",
        node.status === "locked"    && "border-dashed border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 opacity-80",
        node.status === "waiting"   && "border-amber-200 bg-amber-50/60",
        isInteractive && "hover:border-amber-400 hover:bg-amber-50"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <StatusIcon status={node.status} />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-stone-900">{node.title}</p>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.12em]",
                getStatusClasses(node.status)
              )}
            >
              {getStatusCopy(node.status, language)}
            </span>
          </div>
          {node.description && (
            <p className="text-xs leading-relaxed text-[var(--city-muted-fg)]">
              {node.description}
            </p>
          )}
          {isInteractive && (
            <p className="text-xs font-medium text-amber-700">
              {node.status === "completed" ? c.reviewOrUpdate : c.continue}
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
