"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ClipboardList, Shield, Globe, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiLanguage } from "@/hooks/useUiLanguage";

const NAV_COPY = {
  en: ["Plan", "Tasks", "Docs", "Countries", "Profile"],
  ru: ["Мой план", "Задачи", "Документы", "Страны", "Профиль"],
} as const;

const NAV_HREFS = [
  "/app/roadmap",
  "/app/tasks",
  "/app/vault",
  "/app/explore",
  "/app/profile",
] as const;

const NAV_ICONS = [Compass, ClipboardList, Shield, Globe, User] as const;

export function AppBottomNav() {
  const pathname = usePathname();
  const language = useUiLanguage();
  const labels = NAV_COPY[language];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[var(--city-border)] bg-[var(--city-card)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch">
        {NAV_HREFS.map((href, i) => {
          const Icon = NAV_ICONS[i];
          const label = labels[i];
          const isActive = pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[56px] px-2 pt-2 pb-1 text-[11px] font-medium transition-colors",
                isActive
                  ? "text-stone-900"
                  : "text-[var(--city-muted-fg)] hover:text-stone-800"
              )}
            >
              <Icon
                className="size-5 shrink-0"
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
