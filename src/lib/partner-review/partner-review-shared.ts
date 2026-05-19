import type { PartnerReviewRequest } from "@/types";

export const PARTNER_REVIEW_TABLE = "partner_review_requests";

export function normalizePartnerReviewRequest(
  row: Record<string, unknown> | null | undefined
): PartnerReviewRequest | null {
  if (!row) return null;
  return row as PartnerReviewRequest;
}
