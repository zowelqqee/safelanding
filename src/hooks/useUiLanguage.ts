"use client";

import { useSyncExternalStore } from "react";
import { LANGUAGE_CHANGE_EVENT, getStoredUiLanguage } from "@/lib/i18n/ui-language";
import type { UiLanguage } from "@/lib/i18n/onboarding";

export function useUiLanguage(initialLanguage: UiLanguage = "en"): UiLanguage {
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
