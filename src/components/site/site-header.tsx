"use client";

import { useSyncExternalStore, type ComponentType } from "react";
import Link from "next/link";
import { Compass, Globe, LayoutGrid, LogIn, Menu, Shield, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeaderActions } from "@/components/landing/landing-header-actions";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { HeaderUser } from "@/app/(app)/header-user";
import { SignOutButton } from "@/components/auth/sign-out-button";
import type { UiLanguage } from "@/lib/i18n/onboarding";
import {
  LANGUAGE_CHANGE_EVENT,
  getStoredUiLanguage,
} from "@/lib/i18n/ui-language";
import { cn } from "@/lib/utils";

type HeaderVariant = "public" | "app";
type HeaderAction = "default" | "landing" | "sign-in" | "sign-up" | "none";

type NavItem = {
  href: string;
  label: string;
};

const HEADER_COPY = {
  en: {
    publicNavItems: [
      { href: "/explore", label: "Explore" },
      { href: "/compare", label: "Compare" },
      { href: "/start", label: "Start" },
    ],
    appNavItems: [
      { href: "/app/roadmap", label: "Roadmap" },
      { href: "/app/tasks", label: "Tasks" },
      { href: "/app/vault", label: "Vault" },
      { href: "/app/explore", label: "Explore" },
      { href: "/compare", label: "Compare" },
      { href: "/app/profile", label: "Profile" },
    ],
    mobileSiteItems: [
      { href: "/", label: "Home" },
      { href: "/explore", label: "Explore destinations" },
      { href: "/compare", label: "Compare destinations" },
      { href: "/start", label: "Start planning" },
    ],
    mobileAppItems: [
      { href: "/app/roadmap", label: "Roadmap" },
      { href: "/app/tasks", label: "Tasks" },
      { href: "/app/vault", label: "Vault" },
      { href: "/app/explore", label: "Saved explore" },
      { href: "/app/profile", label: "Profile" },
    ],
    account: "Account",
    browseSite: "Browse site",
    createProfile: "Create profile",
    mainNavigation: "Main navigation",
    menu: "Menu",
    open: "Open",
    openApp: "Open app",
    openRoadmap: "Open roadmap",
    quickAction: "Quick action",
    signIn: "Sign in",
    signOut: "Sign out",
    signingOut: "Signing out...",
    startMyMove: "Start my move",
    yourApp: "Your app",
  },
  ru: {
    publicNavItems: [
      { href: "/explore", label: "Страны" },
      { href: "/compare", label: "Сравнить" },
      { href: "/start", label: "Начать" },
    ],
    appNavItems: [
      { href: "/app/roadmap", label: "Роадмап" },
      { href: "/app/tasks", label: "Задачи" },
      { href: "/app/vault", label: "Документы" },
      { href: "/app/explore", label: "Страны" },
      { href: "/compare", label: "Сравнить" },
      { href: "/app/profile", label: "Профиль" },
    ],
    mobileSiteItems: [
      { href: "/", label: "Главная" },
      { href: "/explore", label: "Смотреть направления" },
      { href: "/compare", label: "Сравнить направления" },
      { href: "/start", label: "Начать планирование" },
    ],
    mobileAppItems: [
      { href: "/app/roadmap", label: "Роадмап" },
      { href: "/app/tasks", label: "Задачи" },
      { href: "/app/vault", label: "Документы" },
      { href: "/app/explore", label: "Сохраненные страны" },
      { href: "/app/profile", label: "Профиль" },
    ],
    account: "Аккаунт",
    browseSite: "Разделы сайта",
    createProfile: "Создать профиль",
    mainNavigation: "Навигация",
    menu: "Меню",
    open: "Открыть",
    openApp: "Открыть app",
    openRoadmap: "Открыть роадмап",
    quickAction: "Быстрое действие",
    signIn: "Войти",
    signOut: "Выйти",
    signingOut: "Выходим...",
    startMyMove: "Начать переезд",
    yourApp: "Ваш app",
  },
} satisfies Record<UiLanguage, {
  publicNavItems: NavItem[];
  appNavItems: NavItem[];
  mobileSiteItems: NavItem[];
  mobileAppItems: NavItem[];
  account: string;
  browseSite: string;
  createProfile: string;
  mainNavigation: string;
  menu: string;
  open: string;
  openApp: string;
  openRoadmap: string;
  quickAction: string;
  signIn: string;
  signOut: string;
  signingOut: string;
  startMyMove: string;
  yourApp: string;
}>;

function useHeaderLanguage(initialLanguage: UiLanguage) {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
      window.addEventListener("storage", onStoreChange);

      return () => {
        window.removeEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    () => getStoredUiLanguage(initialLanguage),
    () => initialLanguage
  );
}

function DesktopActions({
  action,
  variant,
  userEmail,
  copy,
}: {
  action: HeaderAction;
  variant: HeaderVariant;
  userEmail?: string;
  copy: typeof HEADER_COPY[UiLanguage];
}) {
  if (variant === "app") {
    return userEmail ? (
      <HeaderUser
        email={userEmail}
        signOutLabel={copy.signOut}
        signOutPendingLabel={copy.signingOut}
      />
    ) : null;
  }

  switch (action) {
    case "landing":
      return <LandingHeaderActions languageCopy={copy} />;
    case "sign-in":
      return (
        <Link href="/auth/sign-up">
          <Button size="sm" className="rounded-full">{copy.createProfile}</Button>
        </Link>
      );
    case "sign-up":
      return (
        <Link href="/auth/sign-in">
          <Button size="sm" variant="outline" className="rounded-full border-[var(--city-border)]">
            {copy.signIn}
          </Button>
        </Link>
      );
    case "none":
      return null;
    case "default":
    default:
      return (
        <Link href="/start">
          <Button size="sm" className="rounded-full">{copy.startMyMove}</Button>
        </Link>
      );
  }
}

function MobileMenuGroup({
  title,
  items,
  icon: Icon,
  openLabel,
}: {
  title: string;
  items: NavItem[];
  icon: ComponentType<{ className?: string }>;
  openLabel: string;
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
            <span className="text-xs text-[var(--city-muted-fg)]">{openLabel}</span>
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
  initialLanguage = "en",
  className,
}: {
  variant?: HeaderVariant;
  action?: HeaderAction;
  userEmail?: string;
  initialLanguage?: UiLanguage;
  className?: string;
}) {
  const language = useHeaderLanguage(initialLanguage);
  const copy = HEADER_COPY[language];
  const desktopItems = variant === "app" ? copy.appNavItems : copy.publicNavItems;

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
          <LanguageSwitcher initialLanguage={initialLanguage} />
          <DesktopActions
            action={action}
            variant={variant}
            userEmail={userEmail}
            copy={copy}
          />
        </div>

        <div className="ml-auto md:hidden">
          <details className="group relative">
            <summary className="flex list-none items-center gap-2 rounded-full border border-[var(--city-border)] bg-[var(--city-card)] px-3 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-[var(--city-warm-muted)]">
              <Menu className="h-4 w-4" />
              {copy.menu}
            </summary>
            <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(24rem,calc(100vw-2rem))] rounded-[24px] border border-[var(--city-border)] bg-[var(--city-bg)] p-4 shadow-[0_18px_60px_rgba(55,44,34,0.14)]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-card)] px-4 py-3">
                  <LanguageSwitcher
                    initialLanguage={initialLanguage}
                    display="full"
                  />
                </div>

                {variant === "app" && (
                  <MobileMenuGroup
                    title={copy.yourApp}
                    items={copy.mobileAppItems}
                    icon={LayoutGrid}
                    openLabel={copy.open}
                  />
                )}

                <MobileMenuGroup
                  title={variant === "app" ? copy.browseSite : copy.mainNavigation}
                  items={copy.mobileSiteItems}
                  icon={variant === "app" ? Globe : Compass}
                  openLabel={copy.open}
                />

                <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-card)] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--city-muted-fg)]">
                    {copy.quickAction}
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {variant === "app" ? (
                      <>
                        <Link href="/app/roadmap">
                          <Button className="h-11 w-full justify-center gap-2 rounded-full">
                            <Sparkles className="h-4 w-4" />
                            {copy.openRoadmap}
                          </Button>
                        </Link>
                        <SignOutButton
                          variant="outline"
                          className="h-11 rounded-full border-[var(--city-border)]"
                          label={copy.signOut}
                          pendingLabel={copy.signingOut}
                        />
                      </>
                    ) : action === "sign-in" ? (
                      <Link href="/auth/sign-up">
                        <Button className="h-11 w-full justify-center gap-2 rounded-full">
                          <User className="h-4 w-4" />
                          {copy.createProfile}
                        </Button>
                      </Link>
                    ) : action === "sign-up" ? (
                      <Link href="/auth/sign-in">
                        <Button variant="outline" className="h-11 w-full justify-center gap-2 rounded-full border-[var(--city-border)]">
                          <LogIn className="h-4 w-4" />
                          {copy.signIn}
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/start">
                        <Button className="h-11 w-full justify-center gap-2 rounded-full">
                          <Sparkles className="h-4 w-4" />
                          {copy.startMyMove}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                {variant === "app" && userEmail && (
                  <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-card)] px-4 py-3">
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--city-muted-fg)]">
                      <Shield className="h-3.5 w-3.5" />
                      {copy.account}
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
