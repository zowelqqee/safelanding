import { createClient } from "@/lib/supabase/server";
import type { PartnerReviewRequest } from "@/types";
import {
  normalizePartnerReviewRequest,
  PARTNER_REVIEW_TABLE,
} from "./partner-review-shared";

export async function getPartnerReviewRequestServer(
  userId: string,
  moveProfileId: string
): Promise<PartnerReviewRequest | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(PARTNER_REVIEW_TABLE)
    .select("*")
    .eq("user_id", userId)
    .eq("move_profile_id", moveProfileId)
    .limit(1);

  if (error) {
    console.error("[Soft Landing] getPartnerReviewRequestServer error:", error);
    return null;
  }

  return normalizePartnerReviewRequest(data?.[0]);
}
