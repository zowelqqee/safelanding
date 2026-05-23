import type { UiLanguage } from "@/lib/i18n/onboarding";

export function resolveUiLanguage(
  value: string | null | undefined
): UiLanguage {
  return value === "ru" ? "ru" : "en";
}

export function getIntlLanguageTag(language: UiLanguage) {
  return language === "ru" ? "ru-RU" : "en";
}
