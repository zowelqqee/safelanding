"use client";

import { createClient } from "@/lib/supabase/client";
import type { UserFeedback } from "@/types";

export type SaveFeedbackInput = {
  moveProfileId: string;
  source: string;
  usefulness: string;
  wouldRequestRealHelp?: string | null;
  comment?: string | null;
};

export async function getExistingFeedback(
  moveProfileId: string,
  source: string
): Promise<UserFeedback | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("user_feedback")
      .select("*")
      .eq("user_id", user.id)
      .eq("move_profile_id", moveProfileId)
      .eq("source", source)
      .maybeSingle();

    if (error) {
      console.warn("[Soft Landing] feedback lookup failed:", error);
      return null;
    }

    return data as UserFeedback | null;
  } catch (error) {
    console.warn("[Soft Landing] feedback lookup failed:", error);
    return null;
  }
}

export async function saveFeedback(
  input: SaveFeedbackInput
): Promise<{ feedback: UserFeedback | null; error: string | null }> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { feedback: null, error: "You need to sign in to leave feedback." };
    }

    const { data, error } = await supabase
      .from("user_feedback")
      .insert({
        user_id: user.id,
        move_profile_id: input.moveProfileId,
        source: input.source,
        usefulness: input.usefulness,
        would_request_real_help: input.wouldRequestRealHelp ?? null,
        comment: input.comment?.trim() || null,
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        const existing = await getExistingFeedback(input.moveProfileId, input.source);
        return { feedback: existing, error: null };
      }

      console.warn("[Soft Landing] feedback save failed:", error);
      return { feedback: null, error: "Не получилось отправить отзыв. Попробуйте ещё раз." };
    }

    return { feedback: data as UserFeedback, error: null };
  } catch (error) {
    console.warn("[Soft Landing] feedback save failed:", error);
    return { feedback: null, error: "Не получилось отправить отзыв. Попробуйте ещё раз." };
  }
}
