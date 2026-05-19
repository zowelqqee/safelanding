import { createClient } from "@/lib/supabase/client";
import type { MoveProfile, MoveProfilePatch } from "@/types";

const TABLE = "move_profiles";
type BrowserSupabaseClient = ReturnType<typeof createClient>;

function db(client: BrowserSupabaseClient = createClient()) {
  return client.from(TABLE);
}

export async function getCurrentMoveProfile(): Promise<MoveProfile | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await db()
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;
    return data ? (data as MoveProfile) : null;
  } catch (err) {
    console.error("[Soft Landing] getCurrentMoveProfile error:", err);
    return null;
  }
}

export async function getOrCreateMoveProfile(): Promise<MoveProfile | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: existing, error: selectError } = await db()
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (selectError) throw selectError;
    if (existing) return existing as MoveProfile;

    const { data: created, error: insertError } = await db()
      .insert({ user_id: user.id })
      .select("*")
      .single();

    if (insertError) throw insertError;
    return created as MoveProfile;
  } catch (err) {
    console.error("[Soft Landing] getOrCreateMoveProfile error:", err);
    return null;
  }
}

export async function updateMoveProfile(patch: MoveProfilePatch): Promise<MoveProfile | null> {
  try {
    const profile = await getOrCreateMoveProfile();
    if (!profile?.user_id) return null;

    // Ensure the row exists first, then apply a true partial update so
    // later onboarding writes do not reset unrelated columns to defaults.
    const { data, error } = await db()
      .update(patch)
      .eq("user_id", profile.user_id)
      .select("*")
      .single();

    if (error) throw error;
    return data as MoveProfile;
  } catch (err) {
    console.error("[Soft Landing] updateMoveProfile error:", err);
    return null;
  }
}
