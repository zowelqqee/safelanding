import type { CityProfile } from "@/types";
import type { UiLanguage } from "./onboarding";

type CityDisplayTranslation = {
  name: string;
  summary?: string;
  mainLifestyleBlocker?: string;
  watchOut?: string[];
  bestFor?: string[];
  first90DaysPreview?: string[];
  whatPeopleUnderestimate?: string;
};

const RU_CITY_TRANSLATIONS: Record<string, CityDisplayTranslation> = {
  valencia: { name: "Валенсия" },
  barcelona: { name: "Барселона" },
  madrid: { name: "Мадрид" },
  alicante: { name: "Аликанте" },
  lisbon: { name: "Лиссабон" },
  porto: { name: "Порту" },
  madeira: { name: "Мадейра" },
  algarve: { name: "Алгарве" },
  berlin: { name: "Берлин" },
  munich: { name: "Мюнхен" },
  hamburg: { name: "Гамбург" },
  frankfurt: { name: "Франкфурт" },
  amsterdam: { name: "Амстердам" },
  rotterdam: { name: "Роттердам" },
  utrecht: { name: "Утрехт" },
  eindhoven: { name: "Эйндховен" },
  london: { name: "Лондон" },
  manchester: { name: "Манчестер" },
  edinburgh: { name: "Эдинбург" },
  birmingham: { name: "Бирмингем" },
  toronto: {
    name: "Торонто",
    summary:
      "Самая универсальная городская точка входа в Канаду: много возможностей, но и сильное давление по жилью.",
    bestFor: [
      "Специалисты, которым важен широкий рынок работы",
      "Студенты",
      "Те, кому нужна максимальная плотность контактов",
    ],
    watchOut: [
      "Жильё очень дорогое",
      "Большой город быстро добавляет расходы и время в дороге",
      "На старт нужен серьёзный бюджет",
    ],
    mainLifestyleBlocker:
      "Даже хороший доход быстро сжимается из-за высокой стоимости жизни.",
    whatPeopleUnderestimate:
      "Насколько выбор района меняет весь опыт жизни в Канаде.",
    first90DaysPreview: [
      "Сразу заложить высокий бюджет на первый цикл поиска жилья",
      "Сузить районы по транспорту и рабочей или учебной опоре",
      "Быть готовым, что первые месяцы займут документы, жильё и контроль расходов",
    ],
  },
  vancouver: {
    name: "Ванкувер",
    summary:
      "Очень красивый и узнаваемый город с сильной природой вокруг, но за это приходится платить высокой стоимостью жизни.",
    bestFor: [
      "Специалисты, которым важны природа и активная жизнь",
      "Студенты",
      "Те, кто ставит климат выше стоимости",
    ],
    watchOut: [
      "Жильё одно из самых дорогих в Канаде",
      "В некоторых сферах карьерный потолок ниже, чем в Торонто",
      "Со временем город может финансово выматывать",
    ],
    mainLifestyleBlocker:
      "Красота города стоит дорого и постоянно давит на бюджет.",
    whatPeopleUnderestimate:
      "Насколько дорогим город ощущается даже после самого переезда.",
    first90DaysPreview: [
      "Строить переезд вокруг реального бюджета, а не только красивой картинки",
      "Искать жильё вдоль транспортных линий, чтобы повысить шансы",
      "Проверить, правда ли природа компенсирует для вас высокую стоимость жизни",
    ],
  },
  calgary: {
    name: "Калгари",
    summary:
      "Практичный канадский город с более разумной стоимостью и сильной карьерной логикой в отдельных сферах, если вам подходит климат.",
    bestFor: [
      "Специалисты, которым важна стоимость",
      "Семьи",
      "Те, кому нужно больше пространства за те же деньги",
    ],
    watchOut: [
      "Зима может стать серьёзным испытанием",
      "Городская жизнь менее плотная и часто завязана на машину",
      "Не лучший вариант, если хочется мягкий и пеший большой город",
    ],
    mainLifestyleBlocker:
      "Холод и автомобильный ритм подходят не всем.",
  },
  montreal: {
    name: "Монреаль",
    summary:
      "Культурный и более доступный крупный город Канады, где язык и зима становятся честной проверкой совместимости.",
    bestFor: [
      "Студенты",
      "Креативные специалисты",
      "Те, кто открыт к двуязычной среде",
    ],
    watchOut: [
      "Французский важнее, чем многим англоговорящим кажется",
      "Зима длинная и ощутимая",
      "Некоторые профессии сложнее без готовности учить язык",
    ],
    mainLifestyleBlocker:
      "Если не принимать французский и зиму, город может так и не стать своим.",
  },
  "new-york": { name: "Нью-Йорк" },
  "san-francisco": { name: "Сан-Франциско" },
  miami: { name: "Майами" },
  austin: { name: "Остин" },
  "los-angeles": { name: "Лос-Анджелес" },
  seattle: { name: "Сиэтл" },
  boston: { name: "Бостон" },
  chicago: { name: "Чикаго" },
  "washington-dc": { name: "Вашингтон" },
  denver: { name: "Денвер" },
  atlanta: { name: "Атланта" },
  dallas: { name: "Даллас" },
  houston: { name: "Хьюстон" },
  philadelphia: { name: "Филадельфия" },
  "san-diego": { name: "Сан-Диего" },
  portland: { name: "Портленд" },
  phoenix: { name: "Финикс" },
  nashville: { name: "Нэшвилл" },
  dubai: { name: "Дубай" },
  "abu-dhabi": { name: "Абу-Даби" },
  bangkok: { name: "Бангкок" },
  "chiang-mai": { name: "Чиангмай" },
  phuket: { name: "Пхукет" },
  "mexico-city": { name: "Мехико" },
  "playa-del-carmen": { name: "Плая-дель-Кармен" },
  guadalajara: { name: "Гвадалахара" },
  warsaw: { name: "Варшава" },
  krakow: { name: "Краков" },
  wroclaw: { name: "Вроцлав" },
  prague: { name: "Прага" },
  brno: { name: "Брно" },
  moscow: { name: "Москва" },
  "saint-petersburg": { name: "Санкт-Петербург" },
  almaty: { name: "Алматы" },
  astana: { name: "Астана" },
  yerevan: {
    name: "Ереван",
    summary:
      "Практичный центр переезда в Армении: доступная повседневность, русскоязычная среда и растущее тех- и экспат-сообщество, но почти все международные возможности сосредоточены в столице.",
    bestFor: [
      "Удалённые специалисты",
      "Основатели и фрилансеры",
      "Русскоязычные переезжающие",
    ],
    watchOut: [
      "Самая сильная инфраструктура и сервисы для переехавших сосредоточены в Ереване",
      "Летняя жара и зимний воздух могут влиять на комфорт",
      "Долгосрочный карьерный потолок ниже, чем в крупных рынках",
    ],
    mainLifestyleBlocker:
      "Ереван лучше всего работает как основная база; за его пределами международная инфраструктура быстро слабеет.",
    whatPeopleUnderestimate:
      "Насколько легче проходит старт, если вам уже важны русскоязычные сервисы, сообщество и гибкое краткосрочное жильё.",
    first90DaysPreview: [
      "Начать с центральных или тех-ориентированных районов, прежде чем брать долгую аренду",
      "Сразу настроить банк, связь, налоги и доступ к коворкингу",
      "Проверить жару, зимний воздух и повседневный ритм до решения остаться надолго",
    ],
  },
};

const RU_CITY_TEXT: Record<string, string> = {
  "Warm climate": "Тёплый климат",
  "Relatively affordable": "Относительно доступно",
  "Coastal city": "Город у моря",
  "Strong expat community": "Сильное сообщество переехавших",
  "English-friendly": "Легче жить с английским",
  "Relaxed pace of life": "Спокойный ритм жизни",
  "Reliable public transport": "Надёжный общественный транспорт",
  "Strong job market": "Сильный рынок работы",
  "Good student infrastructure": "Хорошая среда для студентов",
  "Family-friendly": "Удобно для семьи",
  "Popular with remote workers": "Популярен среди удалённых специалистов",
  "Good universities and student scene": "Хорошие университеты и студенческая среда",
  "Canada's most versatile urban launchpad, with broad opportunity and equally broad housing pain.":
    "Самая универсальная городская точка входа в Канаду: много возможностей, но и сильное давление по жилью.",
  "Housing is extremely expensive": "Жильё очень дорогое",
  "Large-city commute and cost pressures add up fast":
    "Большой город быстро добавляет расходы и время в дороге",
  "The move needs a serious arrival budget": "На старт нужен серьёзный бюджет",
  "Cost pressure can shrink even a strong salary quickly.":
    "Даже хороший доход быстро сжимается из-за высокой стоимости жизни.",
  "Stunning and globally recognizable, with outdoor upside that comes at a serious affordability premium.":
    "Очень красивый и узнаваемый город с сильной природой вокруг, но за это приходится платить высокой стоимостью жизни.",
  "Housing costs are among the highest in Canada":
    "Жильё одно из самых дорогих в Канаде",
  "Career upside is narrower than Toronto in some industries":
    "В некоторых сферах карьерный потолок ниже, чем в Торонто",
  "The city can feel financially exhausting over time":
    "Со временем город может финансово выматывать",
  "The beauty tax is real and persistent.":
    "Красота города стоит дорого и постоянно давит на бюджет.",
  "A pragmatic Canadian city with better value and strong career logic for some sectors, especially if you can handle the climate.":
    "Практичный канадский город с более разумной стоимостью и сильной карьерной логикой в отдельных сферах, если вам подходит климат.",
  "Winter is a serious adaptation challenge": "Зима может стать серьёзным испытанием",
  "Urban life is less dense and more car shaped":
    "Городская жизнь менее плотная и часто завязана на машину",
  "Not ideal if you want a soft, walkable big-city feel":
    "Не лучший вариант, если хочется мягкий и пеший большой город",
  "Cold weather and a car-oriented routine are a hard no for some movers.":
    "Холод и автомобильный ритм подходят не всем.",
  "A culturally rich, more affordable major Canadian city where language and weather are part of the real fit question.":
    "Культурный и более доступный крупный город Канады, где язык и зима становятся честной проверкой совместимости.",
  "French matters more than many English speakers hope":
    "Французский важнее, чем многим англоговорящим кажется",
  "Winter is long and real": "Зима длинная и ощутимая",
  "Some professional sectors are less accessible without language commitment":
    "Некоторые профессии сложнее без готовности учить язык",
  "If you resist French or winter, the city may never quite fit.":
    "Если не принимать французский и зиму, город может так и не стать своим.",
  "Armenia's practical relocation center: affordable daily life, Russian-language ease, and a growing tech and expat scene, with limited city alternatives outside the capital.":
    "Практичный центр переезда в Армении: доступная повседневность, русскоязычная среда и растущее тех- и экспат-сообщество, но почти все международные возможности сосредоточены в столице.",
  "The strongest infrastructure and expat services are concentrated in Yerevan":
    "Самая сильная инфраструктура и сервисы для переехавших сосредоточены в Ереване",
  "Summer heat and winter air quality can affect daily comfort":
    "Летняя жара и зимний воздух могут влиять на комфорт",
  "Long-term career upside is narrower than in larger markets":
    "Долгосрочный карьерный потолок ниже, чем в крупных рынках",
  "Yerevan works best as the base; outside it, international infrastructure drops quickly.":
    "Ереван лучше всего работает как основная база; за его пределами международная инфраструктура быстро слабеет.",
};

export function translateCityText(value: string, language: UiLanguage) {
  if (language !== "ru") return value;
  return RU_CITY_TEXT[value] ?? value;
}

function getRuCityName(city: CityProfile) {
  return RU_CITY_TRANSLATIONS[city.id]?.name ?? city.name;
}

function buildFallbackSummary(city: CityProfile) {
  const strengths: string[] = [];

  if (city.career_opportunities >= 4) strengths.push("сильным рынком работы");
  if (city.student_fit >= 4) strengths.push("хорошей средой для учёбы");
  if (city.expat_community >= 4) strengths.push("заметным сообществом переехавших");
  if (city.english_friendliness >= 4) strengths.push("более простой повседневностью на английском");
  if (city.coastal) strengths.push("доступом к морю");
  if (city.calm_lifestyle >= 4) strengths.push("спокойным ритмом");

  const cityName = getRuCityName(city);
  const mainStrengths = strengths.slice(0, 2).join(" и ");

  if (mainStrengths) {
    return `${cityName} может подойти как практичный вариант с ${mainStrengths}, но перед выбором стоит честно проверить бюджет, жильё и первые месяцы адаптации.`;
  }

  return `${cityName} может подойти при правильном сценарии переезда, но его стоит проверять через бюджет, жильё и повседневный ритм, а не только по общему впечатлению.`;
}

function buildFallbackMainBlocker(city: CityProfile) {
  if (city.housing_difficulty >= 4 || city.cost_level >= 4) {
    return "Главная сложность — стоимость жизни и поиск нормального жилья.";
  }
  if (city.english_friendliness <= 2) {
    return "Без местного языка повседневность и документы могут быстро стать сложнее.";
  }
  if (city.climate_score <= 2) {
    return "Климат может потребовать больше адаптации, чем кажется на старте.";
  }
  if (city.career_opportunities <= 2) {
    return "Карьерные возможности стоит проверить заранее под вашу сферу.";
  }

  return "Главный риск — выбрать город по впечатлению, не проверив бюджет и быт.";
}

function buildFallbackWatchOut(city: CityProfile) {
  const watchOut: string[] = [];

  if (city.housing_difficulty >= 4) {
    watchOut.push("Жильё может быть дорогим и конкурентным");
  }
  if (city.cost_level >= 4) {
    watchOut.push("Повседневные расходы могут быстро давить на бюджет");
  }
  if (city.english_friendliness <= 3) {
    watchOut.push("Без местного языка будет сложнее в быту и документах");
  }
  if (city.climate_score <= 2) {
    watchOut.push("Климат может потребовать отдельной адаптации");
  }
  if (city.career_opportunities <= 3) {
    watchOut.push("Рынок работы нужно проверить под вашу сферу заранее");
  }
  if (watchOut.length === 0) {
    watchOut.push("Первые месяцы лучше планировать с запасом по деньгам и времени");
  }

  return watchOut.slice(0, 3);
}

function buildFallbackBestFor(city: CityProfile) {
  const bestFor: string[] = [];

  if (city.career_opportunities >= 4) bestFor.push("Специалисты с рабочей или карьерной целью");
  if (city.student_fit >= 4) bestFor.push("Студенты");
  if (city.family_fit >= 4) bestFor.push("Семьи");
  if (city.remote_worker_fit >= 4) bestFor.push("Удалённые специалисты");
  if (city.calm_lifestyle >= 4) bestFor.push("Те, кому нужен спокойный ритм");
  if (bestFor.length === 0) bestFor.push("Те, кто готов заранее проверить город на практике");

  return bestFor.slice(0, 3);
}

function buildFallbackFirst90Days(city: CityProfile) {
  const preview = [
    "Начать с временного жилья и короткого списка районов",
    "Проверить реальный месячный бюджет до долгих обязательств",
  ];

  if (city.english_friendliness <= 3) {
    preview.push("Заложить время на язык, документы и местные сервисы");
  } else {
    preview.push("Собрать базовые сервисы: банк, связь, транспорт и страховку");
  }

  return preview;
}

export function getCityDisplay(city: CityProfile, language: UiLanguage) {
  const translation = language === "ru" ? RU_CITY_TRANSLATIONS[city.id] : null;
  const translatedWatchOut = city.watch_out
    .map((item) => RU_CITY_TEXT[item])
    .filter((item): item is string => Boolean(item));

  return {
    name: translation?.name ?? city.name,
    summary:
      translation?.summary ??
      (language === "ru"
        ? RU_CITY_TEXT[city.summary] ?? buildFallbackSummary(city)
        : city.summary),
    bestFor:
      translation?.bestFor ??
      (language === "ru"
        ? buildFallbackBestFor(city)
        : city.best_for.map((item) => translateCityText(item, language))),
    watchOut:
      translation?.watchOut ??
      (language === "ru" && translatedWatchOut.length !== city.watch_out.length
        ? buildFallbackWatchOut(city)
        : city.watch_out.map((item) => translateCityText(item, language))),
    first90DaysPreview:
      translation?.first90DaysPreview ??
      (language === "ru"
        ? buildFallbackFirst90Days(city)
        : city.first_90_days_preview.map((item) => translateCityText(item, language))),
    mainLifestyleBlocker:
      translation?.mainLifestyleBlocker ??
      (language === "ru"
        ? RU_CITY_TEXT[city.main_lifestyle_blocker] ?? buildFallbackMainBlocker(city)
        : city.main_lifestyle_blocker),
    whatPeopleUnderestimate:
      translation?.whatPeopleUnderestimate ??
      translateCityText(city.what_people_underestimate, language),
  };
}
