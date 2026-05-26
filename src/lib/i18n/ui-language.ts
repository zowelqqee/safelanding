import type { UiLanguage } from "@/lib/i18n/onboarding";

export const LANGUAGE_STORAGE_KEY = "sl_language";
export const LANGUAGE_COOKIE_NAME = "sl_language";
export const LANGUAGE_CHANGE_EVENT = "sl-language-change";

export function isUiLanguage(value: unknown): value is UiLanguage {
  return value === "en" || value === "ru";
}

export function resolveUiLanguage(
  value: string | null | undefined
): UiLanguage {
  return value === "ru" ? "ru" : "en";
}

export function getIntlLanguageTag(language: UiLanguage) {
  return language === "ru" ? "ru-RU" : "en";
}

export function getStoredUiLanguage(fallback: UiLanguage = "en"): UiLanguage {
  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isUiLanguage(stored)) {
    return stored;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${LANGUAGE_COOKIE_NAME}=`))
    ?.split("=")[1];

  return isUiLanguage(cookieValue) ? cookieValue : fallback;
}

export function setStoredUiLanguage(language: UiLanguage) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
  document.documentElement.lang = getIntlLanguageTag(language);
}

export function notifyUiLanguageChanged(language: UiLanguage) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: { language } })
  );
}
