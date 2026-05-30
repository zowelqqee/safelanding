import { cookies } from "next/headers";
import { isUiLanguage, resolveUiLanguage, LANGUAGE_COOKIE_NAME } from "./ui-language";
import type { UiLanguage } from "./onboarding";

export async function getServerLanguage(profileLanguage?: string | null): Promise<UiLanguage> {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;
  if (isUiLanguage(cookieLang)) return cookieLang;
  return resolveUiLanguage(profileLanguage);
}
