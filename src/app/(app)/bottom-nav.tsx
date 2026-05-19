"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ClipboardList, Shield, Globe, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/app/roadmap", label: "Roadmap", Icon: Compass },
  { href: "/app/tasks", label: "Tasks", Icon: ClipboardList },
  { href: "/app/vault", label: "Vault", Icon: Shield },
  { href: "/app/explore", label: "Explore", Icon: Globe },
  { href: "/app/profile", label: "Profile", Icon: User },
] as const;

export function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[56px] px-2 pt-2 pb-1 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
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
