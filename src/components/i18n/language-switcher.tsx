"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateMoveProfile } from "@/lib/profile/profileService";
import type { UiLanguage } from "@/lib/i18n/onboarding";
import {
  LANGUAGE_CHANGE_EVENT,
  getStoredUiLanguage,
  notifyUiLanguageChanged,
  setStoredUiLanguage,
} from "@/lib/i18n/ui-language";
import { cn } from "@/lib/utils";

const LANGUAGE_OPTIONS: { value: UiLanguage; label: string; title: string }[] = [
  { value: "en", label: "EN", title: "English" },
  { value: "ru", label: "RU", title: "Русский" },
];

type LanguageSwitcherProps = {
  initialLanguage?: UiLanguage;
  display?: "compact" | "full";
  className?: string;
};

export function LanguageSwitcher({
  initialLanguage = "en",
  display = "compact",
  className,
}: LanguageSwitcherProps) {
  const language = useSyncExternalStore(
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
  const router = useRouter();
  const label = language === "ru" ? "Язык" : "Language";

  useEffect(() => {
    document.documentElement.lang = language === "ru" ? "ru-RU" : "en";
  }, [language]);

  const changeLanguage = (nextLanguage: UiLanguage) => {
    if (nextLanguage === language) {
      return;
    }

    setStoredUiLanguage(nextLanguage);
    notifyUiLanguageChanged(nextLanguage);

    updateMoveProfile({ preferred_language: nextLanguage })
      .catch(console.error)
      .finally(() => {
        router.refresh();
      });
  };

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        display === "full" && "justify-between",
        className
      )}
    >
      {display === "full" && (
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-stone-800">
          <Languages className="h-4 w-4 shrink-0 text-[var(--city-muted-fg)]" />
          <span className="truncate">{label}</span>
        </div>
      )}

      <div
        className="inline-flex h-9 shrink-0 items-center rounded-full border border-[var(--city-border)] bg-[var(--city-card)] p-1"
        role="group"
        aria-label={label}
      >
        {display === "compact" && (
          <Languages
            className="ml-2 mr-1 h-3.5 w-3.5 text-[var(--city-muted-fg)]"
            aria-hidden="true"
          />
        )}

        {LANGUAGE_OPTIONS.map((option) => {
          const active = language === option.value;

          return (
            <button
              key={option.value}
              type="button"
              title={option.title}
              aria-pressed={active}
              onClick={() => changeLanguage(option.value)}
              className={cn(
                "h-7 rounded-full px-2.5 text-[11px] font-semibold transition-colors",
                active
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-[var(--city-muted-fg)] hover:bg-[var(--city-warm-muted)] hover:text-stone-900",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
