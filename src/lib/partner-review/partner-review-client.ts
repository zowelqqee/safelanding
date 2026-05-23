import { createClient } from "@/lib/supabase/client";
import type { UiLanguage } from "@/lib/i18n/onboarding";
import type { PartnerReviewRequest } from "@/types";
import {
  normalizePartnerReviewRequest,
  PARTNER_REVIEW_TABLE,
} from "./partner-review-shared";

type SavePartnerReviewRequestInput = {
  moveProfileId: string;
  selectedCountryId: string | null;
  selectedCityId: string | null;
  selectedLegalPathId: string | null;
  email: string;
  message: string;
  consentGiven: boolean;
  language?: UiLanguage;
};

const ERROR_COPY = {
  en: {
    signIn: "You need to sign in to request a partner review.",
    save: "We couldn't save your review request. Please try again.",
  },
  ru: {
    signIn: "Нужно войти, чтобы отправить запрос на partner review.",
    save: "Не получилось сохранить запрос. Попробуйте ещё раз.",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

export async function savePartnerReviewRequest(
  input: SavePartnerReviewRequestInput
): Promise<{ request: PartnerReviewRequest | null; error: string | null }> {
  const language = input.language ?? "en";
  const copy = ERROR_COPY[language];

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { request: null, error: copy.signIn };
    }

    const { data: existingRows, error: selectError } = await supabase
      .from(PARTNER_REVIEW_TABLE)
      .select("*")
      .eq("user_id", user.id)
      .eq("move_profile_id", input.moveProfileId)
      .limit(1);

    if (selectError) {
      throw selectError;
    }

    const existing = normalizePartnerReviewRequest(existingRows?.[0]);

    if (existing) {
      const { data: updatedRows, error: updateError } = await supabase
        .from(PARTNER_REVIEW_TABLE)
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
        request: normalizePartnerReviewRequest(updatedRows?.[0]) ?? existing,
        error: null,
      };
    }

    const { data: insertedRows, error: insertError } = await supabase
      .from(PARTNER_REVIEW_TABLE)
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
      request: normalizePartnerReviewRequest(insertedRows?.[0]),
      error: null,
    };
  } catch (error) {
    console.error("[Soft Landing] savePartnerReviewRequest error:", error);
    return {
      request: null,
      error: copy.save,
    };
  }
}
