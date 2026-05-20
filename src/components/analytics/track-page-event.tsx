"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsPayload } from "@/lib/analytics/trackEvent";

export function TrackPageEvent({
  eventName,
  payload,
}: {
  eventName: string;
  payload?: AnalyticsPayload;
}) {
  useEffect(() => {
    void trackEvent(eventName, payload);
  }, [eventName, payload]);

  return null;
}
