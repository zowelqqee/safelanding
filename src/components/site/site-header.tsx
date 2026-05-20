import type { ComponentType } from "react";
import Link from "next/link";
import { Compass, Globe, LayoutGrid, LogIn, Menu, Shield, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeaderActions } from "@/components/landing/landing-header-actions";
import { HeaderUser } from "@/app/(app)/header-user";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

type HeaderVariant = "public" | "app";
type HeaderAction = "default" | "landing" | "sign-in" | "sign-up" | "none";

type NavItem = {
  href: string;
  label: string;
};

const PUBLIC_NAV_ITEMS: NavItem[] = [
  { href: "/explore", label: "Explore" },
  { href: "/compare", label: "Compare" },
  { href: "/start", label: "Start" },
];

const APP_NAV_ITEMS: NavItem[] = [
  { href: "/app/roadmap", label: "Roadmap" },
  { href: "/app/tasks", label: "Tasks" },
  { href: "/app/vault", label: "Vault" },
  { href: "/app/explore", label: "Explore" },
  { href: "/compare", label: "Compare" },
  { href: "/app/profile", label: "Profile" },
];

function DesktopActions({
  action,
  variant,
  userEmail,
}: {
  action: HeaderAction;
  variant: HeaderVariant;
  userEmail?: string;
}) {
  if (variant === "app") {
    return userEmail ? <HeaderUser email={userEmail} /> : null;
  }

  switch (action) {
    case "landing":
      return <LandingHeaderActions />;
    case "sign-in":
      return (
        <Link href="/auth/sign-up">
          <Button size="sm" className="rounded-full">Create profile</Button>
        </Link>
      );
    case "sign-up":
      return (
        <Link href="/auth/sign-in">
          <Button size="sm" variant="outline" className="rounded-full border-[var(--city-border)]">
            Sign in
          </Button>
        </Link>
      );
    case "none":
      return null;
    case "default":
    default:
      return (
        <Link href="/start">
          <Button size="sm" className="rounded-full">Start my move</Button>
        </Link>
      );
  }
}

function MobileMenuGroup({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: NavItem[];
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--city-muted-fg)]">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between rounded-2xl border border-[var(--city-border)] bg-[var(--city-card)] px-4 py-3 text-sm font-medium text-stone-800 transition-colors hover:bg-[var(--city-warm-muted)]"
          >
            <span>{item.label}</span>
            <span className="text-xs text-[var(--city-muted-fg)]">Open</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader({
  variant = "public",
  action = "default",
  userEmail,
  className,
}: {
  variant?: HeaderVariant;
  action?: HeaderAction;
  userEmail?: string;
  className?: string;
}) {
  const desktopItems = variant === "app" ? APP_NAV_ITEMS : PUBLIC_NAV_ITEMS;
  const mobileSiteItems: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore destinations" },
    { href: "/compare", label: "Compare destinations" },
    { href: "/start", label: "Start planning" },
  ];
  const mobileAppItems: NavItem[] = [
    { href: "/app/roadmap", label: "Roadmap" },
    { href: "/app/tasks", label: "Tasks" },
    { href: "/app/vault", label: "Vault" },
    { href: "/app/explore", label: "Saved explore" },
    { href: "/app/profile", label: "Profile" },
  ];

  return (
    <header className={cn("sticky top-0 z-50 border-b border-[var(--city-border)] bg-[var(--city-bg)]/95 backdrop-blur", className)}>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 font-semibold tracking-tight text-stone-900 transition-opacity hover:opacity-70"
        >
          Soft Landing
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {desktopItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--city-muted-fg)] transition-colors hover:bg-[var(--city-warm-muted)] hover:text-stone-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden md:flex items-center gap-2">
          <DesktopActions action={action} variant={variant} userEmail={userEmail} />
        </div>

        <div className="ml-auto md:hidden">
          <details className="group relative">
            <summary className="flex list-none items-center gap-2 rounded-full border border-[var(--city-border)] bg-[var(--city-card)] px-3 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-[var(--city-warm-muted)]">
              <Menu className="h-4 w-4" />
              Menu
            </summary>
            <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(24rem,calc(100vw-2rem))] rounded-[24px] border border-[var(--city-border)] bg-[var(--city-bg)] p-4 shadow-[0_18px_60px_rgba(55,44,34,0.14)]">
              <div className="space-y-4">
                {variant === "app" && (
                  <MobileMenuGroup title="Your app" items={mobileAppItems} icon={LayoutGrid} />
                )}

                <MobileMenuGroup
                  title={variant === "app" ? "Browse site" : "Main navigation"}
                  items={mobileSiteItems}
                  icon={variant === "app" ? Globe : Compass}
                />

                <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-card)] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--city-muted-fg)]">
                    Quick action
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {variant === "app" ? (
                      <>
                        <Link href="/app/roadmap">
                          <Button className="h-11 w-full justify-center gap-2 rounded-full">
                            <Sparkles className="h-4 w-4" />
                            Open roadmap
                          </Button>
                        </Link>
                        <SignOutButton variant="outline" className="h-11 rounded-full border-[var(--city-border)]" />
                      </>
                    ) : action === "sign-in" ? (
                      <Link href="/auth/sign-up">
                        <Button className="h-11 w-full justify-center gap-2 rounded-full">
                          <User className="h-4 w-4" />
                          Create profile
                        </Button>
                      </Link>
                    ) : action === "sign-up" ? (
                      <Link href="/auth/sign-in">
                        <Button variant="outline" className="h-11 w-full justify-center gap-2 rounded-full border-[var(--city-border)]">
                          <LogIn className="h-4 w-4" />
                          Sign in
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/start">
                        <Button className="h-11 w-full justify-center gap-2 rounded-full">
                          <Sparkles className="h-4 w-4" />
                          Start my move
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                {variant === "app" && userEmail && (
                  <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-card)] px-4 py-3">
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--city-muted-fg)]">
                      <Shield className="h-3.5 w-3.5" />
                      Account
                    </div>
                    <p className="mt-2 text-sm text-stone-800 break-all">{userEmail}</p>
                  </div>
                )}
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
