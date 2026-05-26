import type {
  CountryProfile,
  CountryMatchResult,
  LifePreference,
  MoveGoal,
  IncomeRange,
  SavingsRange,
  IncomeType,
  MainFear,
  PathFinderAnswers,
  RegionPreference,
  MoveOptimization,
  CostTolerance,
  SafetyImportance,
  StudyPriority,
} from "@/types";
import { COUNTRIES } from "@/lib/data/countries";
import { getLegalPathById } from "@/lib/data/legal-paths";
import { scorePathsForCountry } from "./path-scorer";

const CONTINENT_BY_REGION: Record<RegionPreference, string[]> = {
  europe: ["Europe"],
  north_america: ["North America"],
  asia: ["Asia"],
  middle_east: ["Middle East"],
  latin_america: ["Latin America"],
  not_sure: [],
};

export type CountryMatchInput = {
  language?: "en" | "ru";
  citizenship?: string;
  currentCountry?: string;
  residenceCountry?: string;
  lifePreferences: LifePreference[];
  moveGoal: MoveGoal | "";
  monthlyIncome: IncomeRange | "";
  savingsRange?: SavingsRange | "";
  incomeType?: IncomeType | "";
  mainFear?: MainFear | "";
  regionPreferences?: RegionPreference[];
  moveOptimization?: MoveOptimization | "";
  safetyImportance?: SafetyImportance;
  costTolerance?: CostTolerance;
  studyPriority?: StudyPriority;
  pathAnswers?: Partial<PathFinderAnswers>;
};

type MatchLanguage = "en" | "ru";
type ReasonCandidate = { text: string; priority: number };

const PREFERENCE_WEIGHTS: Record<LifePreference, (c: CountryProfile) => number> = {
  warm_climate: (c) => c.climate_score * 5,
  lower_cost: (c) => (6 - c.cost_level) * 5,
  big_city: (c) => c.career_opportunities * 2,
  sea_nearby: (c) => (c.coastal ? 18 : 0),
  expat_community: (c) => c.expat_community * 4,
  english_friendly: (c) => c.english_friendliness * 5,
  family_friendly: (c) => c.family_fit * 4,
  career_opportunities: (c) => c.career_opportunities * 5,
  calm_lifestyle: (c) => c.calm_lifestyle * 4,
  student_life: (c) => c.study_fit * 4,
  public_transport: (c) => c.public_transport * 3,
};

function clamp(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function goalBonus(country: CountryProfile, goal: MoveGoal | ""): number {
  switch (goal) {
    case "remote_work":
      return country.remote_work_fit * 6;
    case "study":
      return country.study_fit * 6;
    case "explore_first":
      return country.english_friendliness * 3 + country.expat_community * 2;
    case "family":
      return country.family_fit * 6;
    case "find_job":
      return country.career_opportunities * 6;
    case "not_sure":
      return country.expat_community * 3;
    default:
      return 0;
  }
}

function incomeBonus(country: CountryProfile, income: IncomeRange | ""): number {
  if (income === "under_1000" || income === "1000_2000") {
    return (6 - country.cost_level) * 5;
  }

  if (income === "5000_plus") {
    return country.career_opportunities * 2;
  }

  return 0;
}

function optimizationBonus(country: CountryProfile, opt: MoveOptimization | ""): number {
  switch (opt) {
    case "fastest_legal_path":
      return (6 - country.bureaucracy_level) * 5 + (6 - country.housing_difficulty) * 2;
    case "best_career":
      return country.career_opportunities * 8;
    case "lowest_cost":
      return (6 - country.cost_level) * 8;
    case "comfortable_life":
      return country.calm_lifestyle * 5 + country.expat_community * 3;
    case "best_study":
      return country.study_fit * 8;
    case "safest_longterm":
      return country.long_term_stability * 6 + country.family_fit * 3;
    default:
      return 0;
  }
}

function regionPenalty(country: CountryProfile, regions: RegionPreference[]) {
  if (!regions.length || regions.includes("not_sure")) return 0;
  const allowedRegions = regions.flatMap((region) => CONTINENT_BY_REGION[region]);
  return allowedRegions.includes(country.region) ? 0 : -40;
}

function language(input: CountryMatchInput): MatchLanguage {
  return input.language === "ru" ? "ru" : "en";
}

function addUnique(items: ReasonCandidate[], text: string, priority: number) {
  if (!items.some((item) => item.text === text)) {
    items.push({ text, priority });
  }
}

function sortedTexts(items: ReasonCandidate[], limit: number) {
  return items
    .sort((a, b) => b.priority - a.priority)
    .map((item) => item.text)
    .slice(0, limit);
}

function hasLowIncome(income: IncomeRange | "") {
  return income === "under_1000" || income === "1000_2000";
}

function hasLimitedSavings(savings?: SavingsRange | "") {
  return savings === "under_3000" || savings === "3000_7000";
}

function hasRegionMatch(country: CountryProfile, regions: RegionPreference[]) {
  if (!regions.length || regions.includes("not_sure")) return false;
  return regions.flatMap((region) => CONTINENT_BY_REGION[region]).includes(country.region);
}

function buildPathAnswers(input: CountryMatchInput): PathFinderAnswers {
  return {
    worksRemotely:
      input.pathAnswers?.worksRemotely ??
      (input.moveGoal === "remote_work" ? true : input.moveGoal === "study" ? false : null),
    foreignIncome:
      input.pathAnswers?.foreignIncome ??
      (input.moveGoal === "remote_work" ? true : null),
    monthlyIncome: input.monthlyIncome,
    hasSavings: input.pathAnswers?.hasSavings ?? null,
    readyToStudy:
      input.pathAnswers?.readyToStudy ?? (input.moveGoal === "study" ? true : null),
    hasAdmission: input.pathAnswers?.hasAdmission ?? null,
    hasJobOffer: input.pathAnswers?.hasJobOffer ?? null,
    hasSchoolAdmission: input.pathAnswers?.hasSchoolAdmission ?? null,
    hasExtraordinaryProfile: input.pathAnswers?.hasExtraordinaryProfile ?? null,
    hasCapital: input.pathAnswers?.hasCapital ?? null,
    moveSoon: input.pathAnswers?.moveSoon ?? (input.moveGoal === "explore_first" ? false : null),
    movingWithFamily:
      input.pathAnswers?.movingWithFamily ?? (input.moveGoal === "family" ? true : null),
  };
}

function buildReasons(
  country: CountryProfile,
  input: CountryMatchInput,
  legalFit: number,
  topPathName?: string
): string[] {
  const lang = language(input);
  const preferences = input.lifePreferences;
  const regions = input.regionPreferences ?? [];
  const opt = input.moveOptimization ?? "";
  const reasons: ReasonCandidate[] = [];

  if (hasRegionMatch(country, regions)) {
    addUnique(
      reasons,
      lang === "ru"
        ? `${country.name} попадает в выбранный вами регион, поэтому это не компромисс по географии.`
        : `${country.name} sits inside your selected region, so geography is not the compromise here.`,
      82
    );
  }

  if (legalFit >= 65 && topPathName) {
    addUnique(
      reasons,
      lang === "ru"
        ? `${topPathName} выглядит одним из более реалистичных легальных сценариев для вашего профиля.`
        : `${topPathName} looks like one of the more realistic legal routes for your profile.`,
      96
    );
  }

  if (input.moveGoal === "remote_work" && country.remote_work_fit >= 4) {
    const hasRemoteIncomeShape =
      input.incomeType === "remote_employment" ||
      input.incomeType === "freelance" ||
      input.incomeType === "business_owner";
    addUnique(
      reasons,
      hasRemoteIncomeShape
        ? lang === "ru"
          ? "Ваш формат дохода хорошо ложится на удаленный сценарий, если подтвердить контракты и поступления."
          : "Your income setup fits a remote-work route well if contracts and deposits are documented cleanly."
        : lang === "ru"
          ? "Для удаленной работы здесь сильная связка: понятная экспат-среда, быт и инфраструктура."
          : "For remote work, the mix of infrastructure, daily life, and expat support is genuinely strong.",
      94
    );
  }

  if (input.moveGoal === "study" && country.study_fit >= 4) {
    const text = input.studyPriority === "post_study_work" && country.career_opportunities >= 4
      ? lang === "ru"
        ? "Для учебы плюс не только в университетах: после выпуска есть более понятный карьерный рынок."
        : "For study, the upside is not just universities: the post-study job market is more credible."
      : lang === "ru"
        ? "Учебная инфраструктура здесь сильная, особенно если вы готовы заранее собрать admission-пакет."
        : "Study infrastructure is a real strength, especially if you prepare the admission package early.";
    addUnique(reasons, text, 94);
  }

  if (input.moveGoal === "find_job" && country.career_opportunities >= 4) {
    addUnique(
      reasons,
      lang === "ru"
        ? "Для поиска работы это один из более сильных рынков в списке, но он потребует локальной упаковки резюме."
        : "For job search, this is one of the stronger markets in the list, though your CV will need local positioning.",
      94
    );
  }

  if (input.moveGoal === "family" && country.family_fit >= 4 && country.long_term_stability >= 4) {
    addUnique(
      reasons,
      lang === "ru"
        ? "Для семейного переезда сильны безопасность, предсказуемость быта и долгосрочная стабильность."
        : "For a family move, safety, predictable daily life, and long-term stability are meaningful positives.",
      94
    );
  }

  if (input.mainFear === "being_alone" && country.expat_community >= 4) {
    addUnique(
      reasons,
      lang === "ru"
        ? "Если страшно оказаться одному, здесь легче найти русско- или англоязычные сообщества в первые месяцы."
        : "If isolation is the worry, the existing expat community makes the first months less lonely.",
      90
    );
  }

  if (input.mainFear === "language" && country.english_friendliness >= 4) {
    addUnique(
      reasons,
      lang === "ru"
        ? "С английским здесь проще закрывать первые бытовые задачи, пока вы входите в местный язык."
        : "English can cover more first-month errands here while you build local-language confidence.",
      90
    );
  }

  if (input.costTolerance === "strict" && country.cost_level <= 2) {
    addUnique(
      reasons,
      lang === "ru"
        ? "При строгом бюджете это один из вариантов, где повседневные расходы оставляют больше запаса."
        : "With a strict budget, this is one of the options where daily costs leave more breathing room.",
      90
    );
  }

  if (hasLowIncome(input.monthlyIncome) && country.cost_level <= 2) {
    addUnique(
      reasons,
      lang === "ru"
        ? "Ваш диапазон дохода здесь выглядит реалистичнее, чем в дорогих западноевропейских направлениях."
        : "Your income range is more realistic here than in expensive Western European destinations.",
      88
    );
  }

  if (preferences.includes("lower_cost") && country.cost_level <= 3) {
    addUnique(
      reasons,
      lang === "ru"
        ? "Запрос на более низкую стоимость жизни совпадает с реальным профилем расходов страны."
        : "Your lower-cost preference matches the country's actual cost profile better than many peers.",
      84
    );
  }
  if (preferences.includes("warm_climate") && country.climate_score >= 4) {
    addUnique(
      reasons,
      lang === "ru"
        ? "Теплый климат здесь влияет на повседневную жизнь, а не только на туристическую картинку."
        : "The warm climate affects daily life here, not just the tourist image.",
      82
    );
  }
  if (preferences.includes("sea_nearby") && country.coastal) {
    addUnique(
      reasons,
      lang === "ru"
        ? "Доступ к побережью встроен в обычный быт, а не требует отдельного отпуска."
        : "Coastal access can be part of normal life rather than a separate vacation plan.",
      82
    );
  }
  if (preferences.includes("public_transport") && country.public_transport >= 4) {
    addUnique(
      reasons,
      lang === "ru"
        ? "Общественный транспорт снижает зависимость от машины и упрощает первые месяцы."
        : "Public transport reduces car dependence and makes the first months easier.",
      82
    );
  }
  if (preferences.includes("calm_lifestyle") && country.calm_lifestyle >= 4) {
    addUnique(
      reasons,
      lang === "ru"
        ? "Темп жизни лучше подходит под спокойный, устойчивый переезд, а не только под быстрый старт."
        : "The pace of life fits a calmer, sustainable move rather than only a fast start.",
      82
    );
  }
  if (preferences.includes("career_opportunities") && country.career_opportunities >= 4) {
    addUnique(
      reasons,
      lang === "ru"
        ? "Карьерный потенциал здесь реальный, особенно если заранее адаптировать профиль под локальный рынок."
        : "Career upside is real here, especially if you localize your profile before applying.",
      82
    );
  }
  if (opt === "safest_longterm" && country.long_term_stability >= 4) {
    addUnique(
      reasons,
      lang === "ru"
        ? "Если главный критерий - безопасная долгосрочная база, страна хорошо проходит этот фильтр."
        : "If the priority is a safe long-term base, this country passes that filter well.",
      86
    );
  }
  if (input.safetyImportance === "high" && country.long_term_stability >= 4 && country.family_fit >= 4) {
    addUnique(
      reasons,
      lang === "ru"
        ? "Высокий приоритет безопасности совпадает с сильной долгосрочной стабильностью и спокойным бытом."
        : "Your high safety priority lines up with strong long-term stability and calmer daily life.",
      86
    );
  }

  if (reasons.length === 0) {
    addUnique(
      reasons,
      lang === "ru"
        ? "Страна может подойти, но совпадение держится на общем балансе факторов, а не на одном очевидном плюсе."
        : country.best_for[0] ?? country.summary,
      50
    );
  }

  return sortedTexts(reasons, 3);
}

function buildChallenges(
  country: CountryProfile,
  input: CountryMatchInput,
  legalFit: number
): string[] {
  const lang = language(input);
  const preferences = input.lifePreferences;
  const challenges: ReasonCandidate[] = [];

  if ((input.mainFear === "documents" || input.mainFear === "legal_status") && country.bureaucracy_level >= 4) {
    addUnique(
      challenges,
      lang === "ru"
        ? "Ваш главный страх связан с документами, а здесь бюрократия часто требует запас времени и локальной проверки."
        : "Your main worry is paperwork, and bureaucracy here often needs extra time and local verification.",
      98
    );
  }

  if (legalFit < 55) {
    addUnique(
      challenges,
      lang === "ru"
        ? "Легальный сценарий слабее лайфстайл-матча: перед выбором нужно отдельно проверить требования, сроки и доказательства."
        : country.main_legal_blocker,
      96
    );
  }

  if ((input.mainFear === "housing" || country.housing_difficulty >= 5) && country.housing_difficulty >= 4) {
    addUnique(
      challenges,
      lang === "ru"
        ? "Жилье лучше считать отдельным проектом: конкуренция и депозиты могут съесть первый месяц переезда."
        : "Treat housing as its own project: competition and deposits can consume the first month of the move.",
      94
    );
  }

  if ((input.mainFear === "money" || input.costTolerance === "strict") && country.cost_level >= 4) {
    addUnique(
      challenges,
      lang === "ru"
        ? "При вашем бюджете страна может оказаться дорогой: нужен запас на аренду, страховку и стартовые платежи."
        : "For your budget, this country can be expensive: rent, insurance, and setup costs need a buffer.",
      94
    );
  }

  if (hasLimitedSavings(input.savingsRange) && (country.cost_level >= 4 || country.housing_difficulty >= 4)) {
    addUnique(
      challenges,
      lang === "ru"
        ? "С текущим уровнем накоплений риск не в перелете, а в депозитах, временном жилье и ожидании документов."
        : "With your savings level, the risk is not the flight; it is deposits, temporary housing, and document waits.",
      92
    );
  }

  if ((input.mainFear === "language" || preferences.includes("english_friendly")) && country.english_friendliness <= 3) {
    addUnique(
      challenges,
      lang === "ru"
        ? "Английский не закроет все бытовые и административные задачи; местный язык быстро станет практической необходимостью."
        : "English will not cover every daily and admin task; the local language becomes practical quickly.",
      90
    );
  }

  if (input.moveGoal === "find_job" && country.career_opportunities <= 3) {
    addUnique(
      challenges,
      lang === "ru"
        ? "Для поиска работы рынок может быть узким: без оффера или локальной сети срок переезда становится менее предсказуемым."
        : "For job search, the market can be narrow: without an offer or local network, timing gets less predictable.",
      90
    );
  }

  if (input.moveGoal === "study" && country.study_fit <= 3) {
    addUnique(
      challenges,
      lang === "ru"
        ? "Для учебного сценария это не самый сильный вариант: проверьте admission, стоимость программы и право на работу."
        : "For a study move, this is not the strongest option: verify admission, program cost, and work rights.",
      90
    );
  }

  if (input.moveGoal === "remote_work" && legalFit < 65) {
    addUnique(
      challenges,
      lang === "ru"
        ? "Удаленный доход сам по себе не гарантирует путь: важны формат контрактов, источник дохода и требования консульства."
        : "Remote income alone does not guarantee a route: contract format, income source, and consular rules matter.",
      90
    );
  }
  if (
    input.moveGoal === "remote_work" &&
    (input.incomeType === "savings_only" || input.incomeType === "no_stable_income")
  ) {
    addUnique(
      challenges,
      lang === "ru"
        ? "Для удаленного сценария накопления без стабильного дохода обычно слабее, чем регулярные контракты или зарплата."
        : "For a remote-work route, savings without stable income are usually weaker than recurring contracts or salary.",
      90
    );
  }

  if (input.moveGoal === "family" && (country.housing_difficulty >= 4 || country.family_fit <= 3)) {
    addUnique(
      challenges,
      lang === "ru"
        ? "Для семьи заранее проверьте районы, школы, медицину и размер жилья: ошибки здесь дороже, чем при соло-переезде."
        : "For a family, check neighborhoods, schools, healthcare, and housing size early; mistakes cost more than for a solo move.",
      90
    );
  }

  if (preferences.includes("sea_nearby") && !country.coastal) {
    addUnique(
      challenges,
      lang === "ru"
        ? "Запрос на море здесь не совпадает со страной: для такого образа жизни придется смотреть другие направления."
        : "Your sea-nearby preference does not match this country; that lifestyle points elsewhere.",
      84
    );
  }
  if (preferences.includes("warm_climate") && country.climate_score <= 2) {
    addUnique(
      challenges,
      lang === "ru"
        ? "Если тепло важно для качества жизни, климат может стать ежедневным минусом, а не мелкой деталью."
        : "If warmth matters to your quality of life, the climate may become a daily downside rather than a small detail.",
      84
    );
  }
  if (preferences.includes("lower_cost") && country.cost_level >= 4) {
    addUnique(
      challenges,
      lang === "ru"
        ? "Запрос на низкую стоимость жизни конфликтует с реальными расходами в этой стране."
        : "Your lower-cost preference conflicts with the real expense profile of this country.",
      84
    );
  }
  if (preferences.includes("public_transport") && country.public_transport <= 2) {
    addUnique(
      challenges,
      lang === "ru"
        ? "Без машины часть повседневной логистики может быть неудобной, особенно вне главных городов."
        : "Without a car, daily logistics can be awkward, especially outside the main cities.",
      82
    );
  }

  addUnique(
    challenges,
    lang === "ru"
      ? input.mainFear === "choosing_wrong_place"
        ? "Главный риск - выбрать страну по образу, а не по первым 90 дням: жилью, документам, бюджету и району."
        : "Даже при хорошем совпадении первые месяцы потребуют запаса на жилье, документы и бытовую настройку."
      : input.mainFear === "choosing_wrong_place"
        ? country.what_people_underestimate
        : country.main_lifestyle_blocker,
    58
  );

  return sortedTexts(challenges, 3);
}

export function matchCountries(input: CountryMatchInput): CountryMatchResult[] {
  const regions = input.regionPreferences ?? [];
  const opt = input.moveOptimization ?? "";
  const pathAnswers = buildPathAnswers(input);

  return COUNTRIES.map((country) => {
    let rawLifestyleScore = 0;
    const maxPossible = input.lifePreferences.length * 25 + 30 + 25 + 40;

    for (const preference of input.lifePreferences) {
      rawLifestyleScore += PREFERENCE_WEIGHTS[preference](country);
    }

    rawLifestyleScore += goalBonus(country, input.moveGoal);
    rawLifestyleScore += incomeBonus(country, input.monthlyIncome);
    rawLifestyleScore += optimizationBonus(country, opt);
    rawLifestyleScore += regionPenalty(country, regions);

    const lifestyleFit = clamp(
      5,
      Math.round(40 + (rawLifestyleScore / Math.max(maxPossible, 1)) * 55),
      99
    );

    const pathScores = scorePathsForCountry(country.id, pathAnswers);
    const topNonExploration = pathScores.find((result) => {
      const path = getLegalPathById(result.pathId);
      return path?.scenario !== "exploration";
    });
    const topExploration = pathScores.find((result) => {
      const path = getLegalPathById(result.pathId);
      return path?.scenario === "exploration";
    });
    const legalFit = topNonExploration
      ? clamp(10, Math.round(topNonExploration.score * 0.95), 95)
      : clamp(10, Math.min(topExploration?.score ?? 25, 35), 95);

    const overallFit = clamp(
      5,
      Math.round(lifestyleFit * 0.6 + legalFit * 0.4),
      99
    );
    const topPathName = topNonExploration
      ? getLegalPathById(topNonExploration.pathId)?.name
      : undefined;
    const challenges = buildChallenges(country, input, legalFit);
    const mainBlocker = challenges[0] ??
      (legalFit < 55 || legalFit < lifestyleFit - 12
        ? country.main_legal_blocker
        : country.main_lifestyle_blocker);

    return {
      countryId: country.id,
      score: overallFit,
      overallFit,
      lifestyleFit,
      legalFit,
      mainBlocker,
      reasons: buildReasons(country, input, legalFit, topPathName),
      challenges,
      topPathId: topNonExploration?.pathId,
    };
  }).sort((a, b) => b.overallFit - a.overallFit);
}
