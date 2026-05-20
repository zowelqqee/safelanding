"use client";

import { createClient } from "@/lib/supabase/client";

export type AnalyticsPayload = Record<string, unknown>;

export async function trackEvent(
  eventName: string,
  payload: AnalyticsPayload = {}
): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile, error: profileError } = await supabase
      .from("move_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      console.warn("[Soft Landing] analytics profile lookup failed:", profileError);
    }

    const { error } = await supabase.from("app_events").insert({
      user_id: user.id,
      move_profile_id: profile?.id ?? null,
      event_name: eventName,
      event_payload: payload,
    });

    if (error) {
      console.warn("[Soft Landing] analytics event failed:", error);
    }
  } catch (error) {
    console.warn("[Soft Landing] analytics event failed:", error);
  }
}
