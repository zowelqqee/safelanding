import { createClient } from "@/lib/supabase/server";
import type { MoveProfile } from "@/types";

const TABLE = "move_profiles";

export async function getCurrentUserWithMoveProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return {
      user,
      profile: data ? (data as MoveProfile) : null,
    };
  } catch (err) {
    console.error("[Soft Landing] getCurrentUserWithMoveProfile error:", err);
    return { user, profile: null };
  }
}

export async function getCurrentMoveProfileServer() {
  const { profile } = await getCurrentUserWithMoveProfile();
  return profile;
}
