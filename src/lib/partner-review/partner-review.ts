import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { PartnerReviewRequest } from "@/types";

const TABLE = "partner_review_requests";

type SavePartnerReviewRequestInput = {
  moveProfileId: string;
  selectedCountryId: string | null;
  selectedCityId: string | null;
  selectedLegalPathId: string | null;
  email: string;
  message: string;
  consentGiven: boolean;
};

function normalizeRequest(
  row: Record<string, unknown> | null | undefined
): PartnerReviewRequest | null {
  if (!row) return null;
  return row as PartnerReviewRequest;
}

export async function getPartnerReviewRequestServer(
  userId: string,
  moveProfileId: string
): Promise<PartnerReviewRequest | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .eq("move_profile_id", moveProfileId)
    .limit(1);

  if (error) {
    console.error("[Soft Landing] getPartnerReviewRequestServer error:", error);
    return null;
  }

  return normalizeRequest(data?.[0]);
}

export async function savePartnerReviewRequest(
  input: SavePartnerReviewRequestInput
): Promise<{ request: PartnerReviewRequest | null; error: string | null }> {
  try {
    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { request: null, error: "You need to sign in to request a partner review." };
    }

    const { data: existingRows, error: selectError } = await supabase
      .from(TABLE)
      .select("*")
      .eq("user_id", user.id)
      .eq("move_profile_id", input.moveProfileId)
      .limit(1);

    if (selectError) {
      throw selectError;
    }

    const existing = normalizeRequest(existingRows?.[0]);

    if (existing) {
      const { data: updatedRows, error: updateError } = await supabase
        .from(TABLE)
        .update({
          selected_country_id: input.selectedCountryId,
          selected_city_id: input.selectedCityId,
          selected_legal_path_id: input.selectedLegalPathId,
          email: input.email.trim(),
          message: input.message.trim() || null,
          consent_given: input.consentGiven,
        })
        .eq("user_id", user.id)
        .eq("move_profile_id", input.moveProfileId)
        .select("*")
        .limit(1);

      if (updateError) {
        throw updateError;
      }

      return {
        request: normalizeRequest(updatedRows?.[0]) ?? existing,
        error: null,
      };
    }

    const { data: insertedRows, error: insertError } = await supabase
      .from(TABLE)
      .insert({
        user_id: user.id,
        move_profile_id: input.moveProfileId,
        selected_country_id: input.selectedCountryId,
        selected_city_id: input.selectedCityId,
        selected_legal_path_id: input.selectedLegalPathId,
        email: input.email.trim(),
        message: input.message.trim() || null,
        consent_given: input.consentGiven,
        status: "requested",
      })
      .select("*")
      .limit(1);

    if (insertError) {
      throw insertError;
    }

    return {
      request: normalizeRequest(insertedRows?.[0]),
      error: null,
    };
  } catch (error) {
    console.error("[Soft Landing] savePartnerReviewRequest error:", error);
    return {
      request: null,
      error: "We couldn't save your review request. Please try again.",
    };
  }
}
