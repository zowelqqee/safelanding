import type { UiLanguage } from "@/lib/i18n/onboarding";

const ERROR_MAP: Record<string, Record<UiLanguage, string>> = {
  "Invalid login credentials": {
    en: "Incorrect email or password.",
    ru: "Неверный email или пароль.",
  },
  "Email not confirmed": {
    en: "Email not confirmed. Check your inbox and click the link.",
    ru: "Email не подтверждён. Найдите письмо и перейдите по ссылке.",
  },
  "User already registered": {
    en: "An account with this email already exists.",
    ru: "Аккаунт с таким email уже существует.",
  },
  "Password should be at least 6 characters": {
    en: "Password must be at least 8 characters.",
    ru: "Пароль должен содержать минимум 8 символов.",
  },
  "Email rate limit exceeded": {
    en: "Too many attempts. Please try again later.",
    ru: "Слишком много попыток. Попробуйте позже.",
  },
  "For security purposes, you can only request this after": {
    en: "Too many requests. Please wait before trying again.",
    ru: "Слишком много запросов. Подождите немного.",
  },
};

export function translateAuthError(message: string, language: UiLanguage): string {
  for (const [key, translations] of Object.entries(ERROR_MAP)) {
    if (message.includes(key)) {
      return translations[language];
    }
  }
  return message;
}
