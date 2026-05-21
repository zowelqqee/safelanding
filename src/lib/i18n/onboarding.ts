import type {
  IncomeType,
  LifePreference,
  MainFear,
  MoveGoal,
  MoveOptimization,
  RegionPreference,
} from "@/types";

export type UiLanguage = "en" | "ru";

export const commonCopy = {
  en: {
    back: "Back",
    backArrow: "← Back",
    continue: "Continue",
    explore: "Explore",
    open: "Open",
    soon: "Soon",
    fit: "fit",
    step: "Step",
    of: "of",
  },
  ru: {
    back: "Назад",
    backArrow: "← Назад",
    continue: "Продолжить",
    explore: "Смотреть",
    open: "Открыть",
    soon: "Скоро",
    fit: "подходит",
    step: "Шаг",
    of: "из",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

export const welcomeCopy = {
  en: {
    title: "Your move, step by step.",
    description:
      "Soft Landing helps you choose where to move, understand realistic legal paths, build your move profile, and follow a clear roadmap.",
    time: "Takes about 3 minutes. No account required to see your results.",
    roadmapKicker: "Continue your roadmap",
    roadmapText: "Your destination and legal path are already selected.",
    roadmapButton: "Continue your roadmap",
    onboardingInstead: "Open onboarding instead",
    resumeKicker: "Continue your move",
    stoppedAt: "You stopped at:",
    resumeButton: "Continue",
    startOver: "Start over instead",
    startButton: "Start my move",
    disclaimer:
      "Soft Landing does not provide legal advice. For legal decisions, consult a qualified immigration professional.",
  },
  ru: {
    title: "Переезд, разложенный по шагам.",
    description:
      "Soft Landing помогает выбрать страну и город, понять реалистичные легальные пути, собрать профиль переезда и двигаться по понятному роадмапу.",
    time: "Займёт около 3 минут. Результаты можно посмотреть без аккаунта.",
    roadmapKicker: "Продолжить роадмап",
    roadmapText: "Город и легальный путь уже выбраны.",
    roadmapButton: "Продолжить роадмап",
    onboardingInstead: "Открыть онбординг",
    resumeKicker: "Продолжить переезд",
    stoppedAt: "Вы остановились на:",
    resumeButton: "Продолжить",
    startOver: "Начать заново",
    startButton: "Начать план переезда",
    disclaimer:
      "Soft Landing не является юридической консультацией. Для решений по визам и статусу обращайтесь к квалифицированному специалисту.",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

export const baseCopy = {
  en: {
    title: "Where are you from?",
    subtitle: "This helps us match you with the right legal path.",
    citizenship: "Citizenship *",
    citizenshipPlaceholder: "e.g. Russia, Ukraine, Germany",
    currentCountry: "Current country",
    currentCountryPlaceholder: "Where do you live now?",
    preferredLanguage: "Preferred language",
    english: "English",
    russian: "Русский",
  },
  ru: {
    title: "Откуда вы?",
    subtitle: "Это помогает подобрать реалистичный легальный путь.",
    citizenship: "Гражданство *",
    citizenshipPlaceholder: "например: Россия, Украина, Германия",
    currentCountry: "Текущая страна",
    currentCountryPlaceholder: "Где вы живёте сейчас?",
    preferredLanguage: "Язык интерфейса",
    english: "English",
    russian: "Русский",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

export const goalCopy = {
  en: {
    title: "What are you trying to do?",
    subtitle: "We'll match you to the right path and city type.",
    options: [
      { value: "remote_work", label: "Move for remote work", description: "I work remotely and want to base myself abroad", available: true },
      { value: "study", label: "Move for study", description: "I want to study abroad — university or language school", available: true },
      { value: "explore_first", label: "Explore first, decide later", description: "I want to visit and figure things out on the ground", available: true },
      { value: "not_sure", label: "Not sure yet", description: "Help me understand my options", available: true },
      { value: "find_job", label: "Find a job abroad", description: "Looking for employment in another country", available: true },
      { value: "family", label: "Move with family/partner", description: "Family reunification or partner visa route", available: false },
    ],
  },
  ru: {
    title: "Что вы хотите сделать?",
    subtitle: "Подберём подходящий тип города и легальный путь.",
    options: [
      { value: "remote_work", label: "Переехать с удалённой работой", description: "Я работаю удалённо и хочу жить за границей", available: true },
      { value: "study", label: "Переехать на учёбу", description: "Университет, магистратура или языковая школа", available: true },
      { value: "explore_first", label: "Сначала разведать", description: "Хочу приехать, посмотреть на месте и потом решить", available: true },
      { value: "not_sure", label: "Пока не уверен", description: "Помогите понять варианты", available: true },
      { value: "find_job", label: "Найти работу за границей", description: "Ищу трудоустройство в другой стране", available: true },
      { value: "family", label: "Переезд с семьёй/партнёром", description: "Воссоединение семьи или партнёрский путь", available: false },
    ],
  },
} satisfies Record<UiLanguage, {
  title: string;
  subtitle: string;
  options: { value: MoveGoal; label: string; description: string; available: boolean }[];
}>;

export const moneyCopy = {
  en: {
    title: "Money reality",
    subtitle: "We use ranges, not exact numbers. This helps match you to realistic paths.",
    monthlyIncome: "Monthly income",
    savingsAvailable: "Savings available",
    incomeType: "Income type",
    incomeTypes: [
      { value: "remote_employment", label: "Remote employment" },
      { value: "freelance", label: "Freelance / clients" },
      { value: "business_owner", label: "Business owner" },
      { value: "savings_only", label: "Savings only" },
      { value: "student_family", label: "Student / family support" },
      { value: "no_stable_income", label: "No stable income yet" },
    ],
  },
  ru: {
    title: "Финансовая реальность",
    subtitle: "Нужны диапазоны, не точные цифры. Так мы отсеиваем нереалистичные сценарии.",
    monthlyIncome: "Доход в месяц",
    savingsAvailable: "Накопления",
    incomeType: "Тип дохода",
    incomeTypes: [
      { value: "remote_employment", label: "Удалённая работа" },
      { value: "freelance", label: "Фриланс / клиенты" },
      { value: "business_owner", label: "Свой бизнес" },
      { value: "savings_only", label: "Только накопления" },
      { value: "student_family", label: "Учёба / поддержка семьи" },
      { value: "no_stable_income", label: "Пока нет стабильного дохода" },
    ],
  },
} satisfies Record<UiLanguage, {
  title: string;
  subtitle: string;
  monthlyIncome: string;
  savingsAvailable: string;
  incomeType: string;
  incomeTypes: { value: IncomeType; label: string }[];
}>;

export const preferenceCopy = {
  en: {
    title: "What should your new place feel like?",
    subtitle: "Choose up to 5 priorities.",
    selected: "selected",
    options: [
      { value: "warm_climate", label: "Warm climate", emoji: "☀️" },
      { value: "lower_cost", label: "Lower cost", emoji: "💰" },
      { value: "big_city", label: "Big city", emoji: "🏙️" },
      { value: "sea_nearby", label: "Sea nearby", emoji: "🌊" },
      { value: "expat_community", label: "Expat community", emoji: "🌍" },
      { value: "english_friendly", label: "English-friendly", emoji: "🇬🇧" },
      { value: "family_friendly", label: "Family-friendly", emoji: "👨‍👩‍👧" },
      { value: "career_opportunities", label: "Career opps", emoji: "💼" },
      { value: "calm_lifestyle", label: "Calm lifestyle", emoji: "🧘" },
      { value: "student_life", label: "Student life", emoji: "🎓" },
      { value: "public_transport", label: "Good transport", emoji: "🚇" },
    ],
  },
  ru: {
    title: "Каким должен ощущаться новый город?",
    subtitle: "Выберите до 5 приоритетов.",
    selected: "выбрано",
    options: [
      { value: "warm_climate", label: "Тёплый климат", emoji: "☀️" },
      { value: "lower_cost", label: "Ниже расходы", emoji: "💰" },
      { value: "big_city", label: "Большой город", emoji: "🏙️" },
      { value: "sea_nearby", label: "Море рядом", emoji: "🌊" },
      { value: "expat_community", label: "Комьюнити экспатов", emoji: "🌍" },
      { value: "english_friendly", label: "Можно с английским", emoji: "🇬🇧" },
      { value: "family_friendly", label: "Удобно с семьёй", emoji: "👨‍👩‍👧" },
      { value: "career_opportunities", label: "Карьера", emoji: "💼" },
      { value: "calm_lifestyle", label: "Спокойный ритм", emoji: "🧘" },
      { value: "student_life", label: "Студенческая жизнь", emoji: "🎓" },
      { value: "public_transport", label: "Хороший транспорт", emoji: "🚇" },
    ],
  },
} satisfies Record<UiLanguage, {
  title: string;
  subtitle: string;
  selected: string;
  options: { value: LifePreference; label: string; emoji: string }[];
}>;

export const fearCopy = {
  en: {
    title: "What worries you most?",
    subtitle: "We'll make sure to address this throughout your journey.",
    seeResults: "See my results",
    skipResults: "Skip & see results",
    options: [
      { value: "documents", label: "Documents", description: "Paperwork, apostilles, translations" },
      { value: "money", label: "Money", description: "Will I have enough to get through the process?" },
      { value: "housing", label: "Housing", description: "Finding somewhere to live" },
      { value: "language", label: "Language", description: "Not speaking the local language" },
      { value: "finding_work", label: "Finding work", description: "Income stability after moving" },
      { value: "being_alone", label: "Being alone", description: "Social life and connections" },
      { value: "choosing_wrong_place", label: "Choosing wrong place", description: "What if it doesn't fit?" },
      { value: "legal_status", label: "Legal status", description: "Visa denial or unclear status" },
    ],
  },
  ru: {
    title: "Что больше всего тревожит?",
    subtitle: "Мы будем учитывать это в рекомендациях и следующих шагах.",
    seeResults: "Показать результаты",
    skipResults: "Пропустить и показать результаты",
    options: [
      { value: "documents", label: "Документы", description: "Бумаги, апостили, переводы" },
      { value: "money", label: "Деньги", description: "Хватит ли бюджета пройти весь процесс?" },
      { value: "housing", label: "Жильё", description: "Найти, снять и не переплатить" },
      { value: "language", label: "Язык", description: "Не говорить на местном языке" },
      { value: "finding_work", label: "Работа", description: "Стабильный доход после переезда" },
      { value: "being_alone", label: "Одиночество", description: "Социальная жизнь и связи" },
      { value: "choosing_wrong_place", label: "Ошибиться с местом", description: "А вдруг город не подойдёт?" },
      { value: "legal_status", label: "Легальный статус", description: "Отказ по визе или мутные правила" },
    ],
  },
} satisfies Record<UiLanguage, {
  title: string;
  subtitle: string;
  seeResults: string;
  skipResults: string;
  options: { value: MainFear; label: string; description: string }[];
}>;

export const regionCopy = {
  en: {
    title: "Which regions are you open to?",
    subtitle: "Select all that interest you. We'll prioritize those in your shortlist.",
    options: [
      { value: "europe", label: "Europe", emoji: "🌍", note: "Schengen travel, EU residency" },
      { value: "north_america", label: "North America", emoji: "🌎", note: "US, Canada" },
      { value: "asia", label: "Asia", emoji: "🌏", note: "SE Asia, Japan, South Korea" },
      { value: "middle_east", label: "Middle East", emoji: "🏙️", note: "UAE, Qatar, Saudi Arabia" },
      { value: "latin_america", label: "Latin America", emoji: "🌴", note: "Mexico, Colombia, Argentina" },
      { value: "not_sure", label: "Open to anything", emoji: "🌐", note: "Show me all options" },
    ],
  },
  ru: {
    title: "Какие регионы вы рассматриваете?",
    subtitle: "Выберите всё, что интересно. Мы поднимем эти варианты выше в подборке.",
    options: [
      { value: "europe", label: "Европа", emoji: "🌍", note: "Шенген, ВНЖ в ЕС" },
      { value: "north_america", label: "Северная Америка", emoji: "🌎", note: "США, Канада" },
      { value: "asia", label: "Азия", emoji: "🌏", note: "ЮВА, Япония, Южная Корея" },
      { value: "middle_east", label: "Ближний Восток", emoji: "🏙️", note: "ОАЭ, Катар, Саудовская Аравия" },
      { value: "latin_america", label: "Латинская Америка", emoji: "🌴", note: "Мексика, Колумбия, Аргентина" },
      { value: "not_sure", label: "Открыт ко всему", emoji: "🌐", note: "Покажите все варианты" },
    ],
  },
} satisfies Record<UiLanguage, {
  title: string;
  subtitle: string;
  options: { value: RegionPreference; label: string; emoji: string; note?: string }[];
}>;

export const optimizationCopy = {
  en: {
    title: "What are you optimizing for?",
    subtitle: "Pick the one thing that matters most. This shapes your country ranking.",
    options: [
      { value: "fastest_legal_path", label: "Fastest legal path", description: "Get legal status with the least bureaucracy", emoji: "⚡" },
      { value: "best_career", label: "Best career upside", description: "Access the strongest job markets and salaries", emoji: "📈" },
      { value: "lowest_cost", label: "Lowest cost", description: "Stretch your money as far as possible", emoji: "💰" },
      { value: "comfortable_life", label: "Most comfortable daily life", description: "Quality of life, safety, community, pace", emoji: "🌿" },
      { value: "best_study", label: "Best study route", description: "Access top universities and student life", emoji: "🎓" },
      { value: "safest_longterm", label: "Safest long-term option", description: "Stable residency, clear PR path, strong institutions", emoji: "🛡️" },
    ],
  },
  ru: {
    title: "Что важнее всего оптимизировать?",
    subtitle: "Выберите главный приоритет. Он влияет на ранжирование стран.",
    options: [
      { value: "fastest_legal_path", label: "Самый быстрый легальный путь", description: "Получить статус с минимумом бюрократии", emoji: "⚡" },
      { value: "best_career", label: "Лучший карьерный потенциал", description: "Доступ к сильным рынкам и зарплатам", emoji: "📈" },
      { value: "lowest_cost", label: "Минимальные расходы", description: "Растянуть бюджет как можно дальше", emoji: "💰" },
      { value: "comfortable_life", label: "Комфортная повседневность", description: "Качество жизни, безопасность, комьюнити, ритм", emoji: "🌿" },
      { value: "best_study", label: "Лучший учебный путь", description: "Университеты и студенческая среда", emoji: "🎓" },
      { value: "safest_longterm", label: "Самый надёжный долгосрок", description: "Стабильный статус, понятный PR/ПМЖ, институты", emoji: "🛡️" },
    ],
  },
} satisfies Record<UiLanguage, {
  title: string;
  subtitle: string;
  options: { value: MoveOptimization; label: string; description: string; emoji: string }[];
}>;

