"use client";

import { useEffect, useRef, type RefObject } from "react";
import { getModelCityIdForAppCityId } from "@/lib/scoring/city-model-adapter";
import { trackEvent } from "./trackEvent";

const SESSION_STORAGE_KEY = "soft_landing_analytics_session_id";
const MIN_VIEW_DURATION_MS = 1000;
const VISIBLE_RATIO_THRESHOLD = 0.45;
const DETAILS_SCROLL_RATIO = 0.7;

type CityCardViewInput = {
  cityId: string;
  position: number;
  durationMs: number;
  scrolledToDetails: boolean;
};

function createFallbackSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getAnalyticsSessionId() {
  if (typeof window === "undefined") {
    return createFallbackSessionId();
  }

  const sessionId = window.crypto?.randomUUID?.() ?? createFallbackSessionId();

  try {
    const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) {
      return existing;
    }

    window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  } catch {
    return sessionId;
  }

  return sessionId;
}

export function trackCityCardView({
  cityId,
  position,
  durationMs,
  scrolledToDetails,
}: CityCardViewInput) {
  const modelCityId = getModelCityIdForAppCityId(cityId);

  return trackEvent("city_card_view", {
    city_id: modelCityId ?? cityId,
    app_city_id: cityId,
    duration_ms: Math.max(0, Math.round(durationMs)),
    position,
    scrolled_to_details: scrolledToDetails,
    session_id: getAnalyticsSessionId(),
  });
}

export function useCityCardViewTracking({
  cityId,
  position,
  enabled = true,
}: {
  cityId: string;
  position: number;
  enabled?: boolean;
}): RefObject<HTMLDivElement | null> {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    const observedElement = cardRef.current;
    if (!observedElement) {
      return;
    }
    const element: HTMLDivElement = observedElement;

    let visibleSince: number | null = null;
    let accumulatedVisibleMs = 0;
    let scrolledToDetails = false;
    let sent = false;

    function now() {
      return window.performance?.now?.() ?? Date.now();
    }

    function getDurationMs() {
      return accumulatedVisibleMs + (visibleSince === null ? 0 : now() - visibleSince);
    }

    function setVisible(isVisible: boolean) {
      if (isVisible && visibleSince === null) {
        visibleSince = now();
      }

      if (!isVisible && visibleSince !== null) {
        accumulatedVisibleMs += now() - visibleSince;
        visibleSince = null;
      }
    }

    function markDetailsIfReached() {
      const rect = element.getBoundingClientRect();
      const detailsLine = rect.top + rect.height * DETAILS_SCROLL_RATIO;
      const isOnScreen = rect.bottom > 0 && rect.top < window.innerHeight;

      if (isOnScreen && detailsLine <= window.innerHeight) {
        scrolledToDetails = true;
      }
    }

    function flush() {
      if (sent) {
        return;
      }

      const durationMs = getDurationMs();
      if (durationMs < MIN_VIEW_DURATION_MS && !scrolledToDetails) {
        return;
      }

      sent = true;
      void trackCityCardView({
        cityId,
        position,
        durationMs,
        scrolledToDetails,
      });
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.intersectionRatio >= VISIBLE_RATIO_THRESHOLD;
        setVisible(isVisible);
        markDetailsIfReached();

        if (!isVisible) {
          flush();
        }
      },
      {
        threshold: [0, VISIBLE_RATIO_THRESHOLD, 0.7, 1],
      }
    );

    function handleScroll() {
      markDetailsIfReached();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        setVisible(false);
        flush();
      }
    }

    observer.observe(element);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    markDetailsIfReached();

    return () => {
      setVisible(false);
      flush();
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [cityId, enabled, position]);

  return cardRef;
}
