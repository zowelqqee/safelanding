import type { UiLanguage } from "@/lib/i18n/onboarding";

export type ExplanationKind = "reason" | "risk" | "blocker";

export type LocalizedCopy = {
  en: string;
  ru: string;
};

export type ExplanationEntry<TId extends string = string> = {
  id: TId;
  kind: ExplanationKind;
  copy: LocalizedCopy;
};

export const MODEL_REASON_IDS = [
  "warm_climate_fit",
  "coastal_lifestyle_fit",
  "remote_work_fit",
  "lower_cost_fit",
  "english_friendly_fit",
  "family_friendly_fit",
  "career_upside_fit",
  "student_life_fit",
  "calm_lifestyle_fit",
  "public_transport_fit",
  "expat_community_fit",
  "legal_clarity_fit",
  "first_landing_ease",
  "regional_preference_fit",
  "safety_fit",
  "budget_buffer_fit",
] as const;

export const MODEL_RISK_IDS = [
  "housing_pressure",
  "high_cost_pressure",
  "weak_local_job_market",
  "language_barrier",
  "bureaucracy_friction",
  "legal_path_uncertainty",
  "isolation_risk",
  "safety_tradeoff",
  "climate_mismatch",
  "career_ceiling",
  "transport_friction",
  "family_support_gap",
  "student_budget_pressure",
  "income_verification_risk",
  "tourism_pressure",
  "first_90_days_complexity",
] as const;

export const MODEL_BLOCKER_IDS = [
  "budget_too_low",
  "unclear_legal_route",
  "housing_too_competitive",
  "income_source_weak",
  "career_market_mismatch",
  "language_gap",
  "family_constraints",
  "study_route_unclear",
  "safety_concern",
  "region_mismatch",
  "timeline_too_aggressive",
  "no_major_blocker",
] as const;

export type ReasonId = (typeof MODEL_REASON_IDS)[number];
export type RiskId = (typeof MODEL_RISK_IDS)[number];
export type BlockerId = (typeof MODEL_BLOCKER_IDS)[number];
export type ExplanationId = ReasonId | RiskId | BlockerId;

export const REASON_COPY = {
  warm_climate_fit: {
    en: "The climate matches your preference for a warmer everyday life.",
    ru: "Климат совпадает с вашим запросом на более теплую повседневную жизнь.",
  },
  coastal_lifestyle_fit: {
    en: "The city supports the coastal lifestyle you marked as important.",
    ru: "Город поддерживает формат жизни у моря, который вы отметили как важный.",
  },
  remote_work_fit: {
    en: "The city is a practical fit for a remote-work setup.",
    ru: "Город практично подходит под сценарий удаленной работы.",
  },
  lower_cost_fit: {
    en: "The cost profile is more forgiving than in larger high-pressure hubs.",
    ru: "Профиль расходов мягче, чем в крупных городах с высоким давлением.",
  },
  english_friendly_fit: {
    en: "English should be usable in more day-to-day situations than average.",
    ru: "Английский должен помогать в большем числе повседневных ситуаций, чем в среднем.",
  },
  family_friendly_fit: {
    en: "The city has signals that fit a family-oriented move.",
    ru: "У города есть признаки, которые подходят для переезда с семейным фокусом.",
  },
  career_upside_fit: {
    en: "The local market has stronger career upside for your goal.",
    ru: "Локальный рынок дает больше карьерного потенциала под вашу цель.",
  },
  student_life_fit: {
    en: "The city fits a study-oriented move better than many alternatives.",
    ru: "Город лучше многих альтернатив подходит под учебный сценарий переезда.",
  },
  calm_lifestyle_fit: {
    en: "The pace is closer to the calmer lifestyle you described.",
    ru: "Темп жизни ближе к спокойному формату, который вы описали.",
  },
  public_transport_fit: {
    en: "Public transport can reduce your early relocation friction.",
    ru: "Общественный транспорт может снизить трение в первые месяцы переезда.",
  },
  expat_community_fit: {
    en: "An existing international community can make the first months less isolating.",
    ru: "Международное сообщество может сделать первые месяцы менее изолированными.",
  },
  legal_clarity_fit: {
    en: "The route looks clearer at a high level than more ambiguous options.",
    ru: "Маршрут на верхнем уровне выглядит понятнее, чем более неоднозначные варианты.",
  },
  first_landing_ease: {
    en: "The city looks easier for the first landing phase.",
    ru: "Город выглядит проще для первого этапа адаптации.",
  },
  regional_preference_fit: {
    en: "The destination matches the region you are open to exploring.",
    ru: "Направление совпадает с регионом, который вы готовы рассматривать.",
  },
  safety_fit: {
    en: "The safety profile aligns with the importance you placed on stability.",
    ru: "Профиль безопасности совпадает с тем, насколько для вас важна стабильность.",
  },
  budget_buffer_fit: {
    en: "Your budget has more room here than in stricter-cost destinations.",
    ru: "Здесь у вашего бюджета больше запаса, чем в направлениях с жесткими расходами.",
  },
} satisfies Record<ReasonId, LocalizedCopy>;

export const RISK_COPY = {
  housing_pressure: {
    en: "Housing may be competitive enough to affect your first 90 days.",
    ru: "Рынок жилья может быть настолько конкурентным, что повлияет на первые 90 дней.",
  },
  high_cost_pressure: {
    en: "Daily costs may put pressure on your stated budget.",
    ru: "Повседневные расходы могут давить на указанный бюджет.",
  },
  weak_local_job_market: {
    en: "The local job market may be thin for your goal.",
    ru: "Локальный рынок работы может быть узким под вашу цель.",
  },
  language_barrier: {
    en: "Language friction may show up in housing, documents, and local services.",
    ru: "Языковой барьер может проявиться в жилье, документах и локальных сервисах.",
  },
  bureaucracy_friction: {
    en: "Bureaucracy may take more time and attention than expected.",
    ru: "Бюрократия может потребовать больше времени и внимания, чем ожидается.",
  },
  legal_path_uncertainty: {
    en: "The legal route needs expert verification before you rely on it.",
    ru: "Юридический маршрут нужно проверить с экспертом, прежде чем на него опираться.",
  },
  isolation_risk: {
    en: "The first months may feel socially narrow without a support plan.",
    ru: "Первые месяцы могут ощущаться социально узкими без плана поддержки.",
  },
  safety_tradeoff: {
    en: "There may be safety or stability tradeoffs to review carefully.",
    ru: "Могут быть компромиссы по безопасности или стабильности, которые стоит проверить.",
  },
  climate_mismatch: {
    en: "The climate may not match the lifestyle you said you want.",
    ru: "Климат может не совпасть с образом жизни, который вы хотите.",
  },
  career_ceiling: {
    en: "Career growth may be more limited than in larger economic hubs.",
    ru: "Карьерный рост может быть более ограниченным, чем в крупных экономических хабах.",
  },
  transport_friction: {
    en: "Getting around may be harder without a car or local routine.",
    ru: "Передвижение может быть сложнее без машины или понятной локальной рутины.",
  },
  family_support_gap: {
    en: "Family logistics may need more planning than the city first suggests.",
    ru: "Семейная логистика может требовать больше планирования, чем кажется сначала.",
  },
  student_budget_pressure: {
    en: "Study plans may depend heavily on tuition, housing, and grant availability.",
    ru: "Учебный сценарий может сильно зависеть от стоимости, жилья и доступности грантов.",
  },
  income_verification_risk: {
    en: "Your income source may need stronger documentation for practical or legal steps.",
    ru: "Источник дохода может потребовать более сильного документального подтверждения.",
  },
  tourism_pressure: {
    en: "Tourism pressure may affect housing, prices, and daily comfort.",
    ru: "Туристическая нагрузка может влиять на жилье, цены и повседневный комфорт.",
  },
  first_90_days_complexity: {
    en: "The first 90 days may be operationally heavier than the match score suggests.",
    ru: "Первые 90 дней могут быть организационно тяжелее, чем кажется по совпадению.",
  },
} satisfies Record<RiskId, LocalizedCopy>;

export const BLOCKER_COPY = {
  budget_too_low: {
    en: "Budget is the main constraint to validate before going deeper.",
    ru: "Бюджет — главное ограничение, которое стоит проверить до следующих шагов.",
  },
  unclear_legal_route: {
    en: "The legal route is not clear enough yet to treat this as a plan.",
    ru: "Юридический маршрут пока недостаточно понятен, чтобы считать это планом.",
  },
  housing_too_competitive: {
    en: "Housing competition is likely the first serious blocker.",
    ru: "Конкуренция за жилье, вероятно, станет первым серьезным блокером.",
  },
  income_source_weak: {
    en: "The income source may be too weak or informal for the next step.",
    ru: "Источник дохода может быть слишком слабым или неформальным для следующего шага.",
  },
  career_market_mismatch: {
    en: "The career market may not match what you need from the move.",
    ru: "Карьерный рынок может не совпасть с тем, что вам нужно от переезда.",
  },
  language_gap: {
    en: "Language readiness may be the biggest practical blocker.",
    ru: "Языковая готовность может быть главным практическим блокером.",
  },
  family_constraints: {
    en: "Family needs may constrain the destination more than lifestyle fit does.",
    ru: "Семейные потребности могут ограничивать выбор сильнее, чем лайфстайл-фит.",
  },
  study_route_unclear: {
    en: "The study route needs more clarity on admissions, cost, and post-study options.",
    ru: "Учебному маршруту нужна ясность по поступлению, стоимости и опциям после учебы.",
  },
  safety_concern: {
    en: "Safety or stability concerns should be reviewed before committing.",
    ru: "Вопросы безопасности или стабильности стоит проверить до серьезного решения.",
  },
  region_mismatch: {
    en: "The destination may not fit the region you are actually open to.",
    ru: "Направление может не совпадать с регионом, который вы реально готовы рассматривать.",
  },
  timeline_too_aggressive: {
    en: "The timeline may be too aggressive for documents, housing, or savings.",
    ru: "Сроки могут быть слишком агрессивными для документов, жилья или накоплений.",
  },
  no_major_blocker: {
    en: "No single blocker stands out yet; the next step is verification.",
    ru: "Один главный блокер пока не выделяется; следующий шаг — проверка деталей.",
  },
} satisfies Record<BlockerId, LocalizedCopy>;

export const EXPLANATION_COPY = {
  ...REASON_COPY,
  ...RISK_COPY,
  ...BLOCKER_COPY,
} satisfies Record<ExplanationId, LocalizedCopy>;

export function getExplanationText(
  id: ExplanationId,
  language: UiLanguage = "en"
) {
  return EXPLANATION_COPY[id][language];
}

export function reasonIdFromIndex(index: number): ReasonId | null {
  return MODEL_REASON_IDS[index] ?? null;
}

export function riskIdFromIndex(index: number): RiskId | null {
  return MODEL_RISK_IDS[index] ?? null;
}

export function blockerIdFromIndex(index: number): BlockerId | null {
  return MODEL_BLOCKER_IDS[index] ?? null;
}

export function reasonIndex(id: ReasonId) {
  return MODEL_REASON_IDS.indexOf(id);
}

export function riskIndex(id: RiskId) {
  return MODEL_RISK_IDS.indexOf(id);
}

export function blockerIndex(id: BlockerId) {
  return MODEL_BLOCKER_IDS.indexOf(id);
}
