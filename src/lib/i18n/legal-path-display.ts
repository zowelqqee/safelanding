import type { LegalPath } from "@/types";
import type { UiLanguage } from "./onboarding";

const PATH_NAME_RU: Record<string, string> = {
  "spain-digital-nomad": "Виза цифрового кочевника",
  "spain-student": "Студенческая виза",
  "spain-non-lucrative": "Виза без права на работу",
  "spain-exploration": "Сначала пожить и присмотреться",
  "portugal-d8": "D8 для удалённой работы",
  "portugal-student": "Студенческая виза",
  "portugal-job-seeker": "Виза для поиска работы",
  "portugal-exploration": "Сначала пожить и присмотреться",
  "germany-blue-card": "Голубая карта ЕС",
  "germany-skilled-worker": "Виза квалифицированного специалиста",
  "germany-student": "Студенческая виза",
  "germany-opportunity-card": "Карта возможностей",
  "canada-express-entry": "Express Entry",
  "canada-study-permit": "Разрешение на учёбу",
  "canada-provincial-nominee": "Провинциальная программа",
  "armenia-temp-resident": "Временное резидентство",
  "armenia-exploration": "Сначала пожить и присмотреться",
};

const TEXT_RU: Record<string, string> = {
  "Competitive routes reward strong preparation, not generic interest":
    "Конкурентные программы требуют сильной подготовки, а не общего интереса",
  "Weak language or credentials can reduce fit quickly":
    "Слабый язык или неподходящие документы быстро снижают шансы",
  "Cutoffs and process details must be checked fresh":
    "Проходные баллы и детали процесса нужно проверять по актуальным правилам",
  "Income proof quality matters a lot":
    "Качество подтверждения дохода очень важно",
  "Requirements vary by filing route and timing":
    "Требования зависят от способа подачи и момента подачи",
  "Housing and admin still require patience after approval":
    "После одобрения всё равно нужны терпение с жильём и документами",
  "Admission comes before the visa strategy becomes real":
    "Сначала нужно поступление, только потом визовый план становится реальным",
  "Not ideal if you are not actually study-ready":
    "Не лучший вариант, если вы не готовы по-настоящему учиться",
  "Rules around work and renewal need current verification":
    "Правила работы и продления нужно проверять по актуальным источникам",
  "Financial proof is central and must be checked carefully":
    "Финансовые подтверждения здесь ключевые, их нужно внимательно проверить",
  "It is a weak fit if you actually need remote-work flexibility":
    "Слабый вариант, если вам нужна гибкость для удалённой работы",
  "Not all applicants like the non-working framing":
    "Не всем подходит формат без права на работу",
  "Not a long-term settlement answer":
    "Это не долгосрочный вариант для переезда",
  "Exploration fit should not be confused with legal-settlement fit":
    "Разведочную поездку не стоит путать с подходящим вариантом для жизни",
  "Stay limits and eligibility vary and must be checked":
    "Сроки пребывания и условия въезда нужно проверять",
  "You already have remote income outside the destination country":
    "У вас уже есть удалённый доход за пределами выбранной страны",
  "This route still depends on clean remote-income proof":
    "Для этого варианта всё ещё нужно аккуратное подтверждение удалённого дохода",
  "This route usually depends on remote income from outside the destination country":
    "Этот вариант обычно зависит от дохода из-за пределов выбранной страны",
  "You already have a study anchor or admission progress":
    "У вас уже есть учебная опора или процесс поступления",
  "Admission is still the missing piece":
    "Поступление пока остаётся недостающим шагом",
  "This route is hard to use without a real study plan or admission":
    "Этот вариант сложно использовать без реального учебного плана или поступления",
  "You already have an employer or sponsor-style anchor":
    "У вас уже есть работодатель или похожая опора",
  "This route usually depends on a real employer or sponsor":
    "Этот вариант обычно зависит от реального работодателя или спонсора",
  "Your income profile looks closer to a remote-route case":
    "Ваш доход больше похож на подходящий случай для удалённого маршрута",
  "Income thresholds must be verified before relying on this route":
    "Пороги дохода нужно проверить перед тем, как опираться на этот вариант",
  "Study is already part of your move plan":
    "Учёба уже входит в ваш план переезда",
  "Your profile suggests some professional earning power":
    "Профиль показывает профессиональный и доходный потенциал",
  "You want to explore before making a long-term commitment":
    "Вы хотите сначала присмотреться к направлению перед долгосрочным решением",
  "This is a reasonable first step while your long-term route is still unclear":
    "Это разумный первый шаг, пока долгосрочный вариант ещё не ясен",
  "You want to move soon, so a real long-term route may matter more than exploration":
    "Вы хотите переехать скоро, поэтому долгосрочный вариант может быть важнее ознакомительной поездки",
  "This is not a long-term settlement route by itself":
    "Сам по себе это не долгосрочный вариант для жизни",
  "You are already planning around family or partner movement":
    "Вы уже планируете переезд с учётом семьи или партнёра",
  "You may have the financial base this kind of route needs":
    "У вас может быть финансовая база, нужная для такого варианта",
  "This route usually works better with real capital or savings behind it":
    "Этот вариант обычно сильнее, когда за ним есть капитал или накопления",
  "You may have the kind of standout profile this route expects":
    "Ваш профиль может быть достаточно сильным для этого варианта",
  "This route usually needs unusually strong evidence, not just a good profile":
    "Обычно здесь нужны очень сильные доказательства, а не просто хороший профиль",
  "You already work remotely with stable foreign income":
    "У вас уже есть стабильный зарубежный доход от удалённой работы",
  "You want a real residence path rather than tourist time":
    "Вы хотите реальный путь к ВНЖ, а не просто туристическое пребывание",
  "You are ready to study and can pursue admission":
    "Вы готовы учиться и можете идти к поступлению",
  "You want Spain as a structured first step into Europe":
    "Вы хотите использовать Испанию как понятный первый шаг в Европу",
  "You have savings or passive income support":
    "У вас есть накопления или пассивный доход",
  "You want a quieter route than employment-driven migration":
    "Вы хотите более спокойный путь, чем переезд через работодателя",
  "You want to scout neighborhoods and city fit first":
    "Вы хотите сначала присмотреться к районам и понять, подходит ли город",
  "You are not yet ready to commit to a residency path":
    "Вы пока не готовы сразу выбирать путь к ВНЖ",
  "You want Armenia as a practical 1-3 year base rather than a tourist-only stay":
    "Вы хотите использовать Армению как практичную базу на 1-3 года, а не только как туристическое пребывание",
  "You can document your work, business, study, family, or other residence basis":
    "Вы можете подтвердить работу, бизнес, учёбу, семейное основание или другую причину для резидентства",
  "You value Russian-language ease, lower friction, and a fast regional setup":
    "Вам важны русскоязычная среда, меньше трения и быстрый старт в регионе",
  "It is not an automatic residency route for every remote worker":
    "Это не автоматический путь к резидентству для любого удалённого специалиста",
  "Your exact basis and document package need current local verification":
    "Ваше основание и пакет документов нужно проверить по актуальным местным правилам",
  "Long-term planning is less predictable than in mature EU residence systems":
    "Долгосрочный план менее предсказуем, чем в более зрелых системах ВНЖ в ЕС",
  "You want to test Yerevan before choosing a residence route":
    "Вы хотите сначала проверить Ереван до выбора пути к резидентству",
  "You need a simple regional base while comparing longer-term destinations":
    "Вам нужна простая региональная база, пока вы сравниваете долгосрочные направления",
  "Your passport allows easy entry or visa-free time that you can verify before travel":
    "Ваш паспорт даёт простой въезд или безвизовое время, которое можно проверить перед поездкой",
  "Exploration stay is not the same as long-term residence":
    "Ознакомительное пребывание не заменяет долгосрочное резидентство",
  "Registration, tax, banking, and stay limits still need checking":
    "Регистрацию, налоги, банки и лимиты пребывания всё равно нужно проверить",
  "It can become a holding pattern if you do not choose a longer plan":
    "Без более долгого плана это может превратиться в временную паузу без ясного следующего шага",
};

const SUMMARY_RU: Record<string, string> = {
  "canada-express-entry":
    "Путь для квалифицированных специалистов с сильным профессиональным профилем, языком и хорошей подготовкой.",
  "armenia-temp-resident":
    "Среднесрочный путь для Армении, если есть реальное основание для резидентства: работа, бизнес, учёба, семья или другой подходящий якорь.",
  "armenia-exploration":
    "Простой первый шаг, чтобы проверить Ереван, банки, жильё и повседневность до решения делать Армению долгосрочной базой.",
};

const DEFAULT_DISCLAIMER_RU =
  "Это оценка совпадения, а не юридическая консультация. Требования меняются, пороги и документы нужно проверять перед подачей.";

const COUNTRY_NAME_RU: Record<string, string> = {
  armenia: "Армении",
  canada: "Канады",
  "czech-republic": "Чехии",
  germany: "Германии",
  mexico: "Мексики",
  netherlands: "Нидерландов",
  poland: "Польши",
  portugal: "Португалии",
  russia: "России",
  spain: "Испании",
  thailand: "Таиланда",
  uae: "ОАЭ",
  uk: "Великобритании",
  us: "США",
};

const SCENARIO_NAME_RU: Record<LegalPath["scenario"], string> = {
  business: "Бизнес-маршрут",
  capital: "Маршрут через капитал или накопления",
  exploration: "Разведочная поездка",
  family: "Семейный маршрут",
  remote: "Маршрут для удалённой работы",
  study: "Студенческий маршрут",
  talent: "Маршрут для сильного профессионального профиля",
  work: "Рабочий маршрут",
};

function buildRuPathName(path: LegalPath) {
  return SCENARIO_NAME_RU[path.scenario] ?? path.name;
}

function buildRuPathSummary(path: LegalPath) {
  const country = COUNTRY_NAME_RU[path.countryId] ?? "страны";

  if (path.requires_remote_income) {
    return `Практический маршрут для ${country}, если ваш основной доход приходит из-за рубежа и его можно подтвердить договорами, выписками, налоговыми или клиентскими документами.`;
  }
  if (path.requires_local_employer) {
    return `Рабочий маршрут для ${country}, который становится реальным только при понятном работодателе, роли, контракте и готовности компании участвовать в процессе.`;
  }
  if (path.requires_admission) {
    return `Учебный маршрут для ${country}: сначала поступление, программа, деньги и жильё, а уже потом визовая логика становится предметной.`;
  }
  if (path.scenario === "business") {
    return `Маршрут для ${country} через бизнес или founder-сценарий: нужны реальный проект, структура владения, деньги на запуск и местная проверка требований.`;
  }
  if (path.scenario === "capital") {
    return `Маршрут для ${country}, где главным доказательством становятся накопления, пассивный доход или финансовая устойчивость без опоры на местный рынок труда.`;
  }
  if (path.scenario === "talent") {
    return `Селективный маршрут для ${country}: работает не от амбиций, а от доказательств достижений, публикаций, наград, контрактов или признания в сфере.`;
  }
  if (path.scenario === "exploration") {
    return `Короткий способ проверить ${country} на практике: районы, жильё, бюджет, климат и документы до того, как входить в долгий процесс.`;
  }

  return `Маршрут для ${country}, который стоит оценивать через конкретное основание, документы, сроки подготовки и риски первого переезда.`;
}

function buildRuPathGoodIf(path: LegalPath) {
  if (path.requires_remote_income) {
    return [
      "У вас уже есть стабильный зарубежный доход, а не только идея найти клиентов после переезда",
      "Можно показать источник денег: контракты, инвойсы, выписки, налоговые документы или письмо работодателя",
      "Вы готовы заранее проверить страховку, жильё, налоговые последствия и способ подачи",
    ];
  }
  if (path.requires_local_employer) {
    return [
      "Есть работодатель, оффер или сильная воронка собеседований именно под эту страну",
      "Роль и зарплата выглядят совместимыми с текущими требованиями маршрута",
      "Компания понимает свою часть процесса: контракт, спонсорство, приглашение или локальные документы",
    ];
  }
  if (path.requires_admission) {
    return [
      "Есть реальный учебный план, а не только желание легализоваться через учёбу",
      "Вы готовы подтвердить поступление, оплату, проживание, страховку и средства на жизнь",
      "Программа помогает вашей долгосрочной логике: работа, язык, диплом или переход к следующему статусу",
    ];
  }
  if (path.scenario === "business") {
    return [
      "У вас есть бизнес, капитал, клиенты или понятная founder-логика, которую можно документально объяснить",
      "Вы готовы сравнить налоги, компанию, банковский доступ и стоимость обслуживания до регистрации",
      "Нужна страна как операционная база, а не просто красивый адрес",
    ];
  }
  if (path.scenario === "capital") {
    return [
      "Есть накопления или пассивный доход, достаточные для спокойной подачи и первых месяцев",
      "Вы не планируете сразу зависеть от местного рынка труда",
      "Готовы подтвердить происхождение средств, страховку, жильё и финансовую устойчивость",
    ];
  }
  if (path.scenario === "talent") {
    return [
      "У вас есть доказуемые достижения, а не просто сильное резюме",
      "Можно собрать внешнее признание: публикации, награды, рекомендации, контракты, медиа или метрики",
      "Вы готовы к профессиональной оценке кейса до того, как строить вокруг него весь переезд",
    ];
  }
  if (path.scenario === "exploration") {
    return [
      "Вы ещё сравниваете страны, города и районы и не хотите сразу подписывать долгий план",
      "Нужно проверить бюджет, жильё, транспорт, климат и бытовую скорость на месте",
      "Вы понимаете, что поездка для разведки не равна праву жить, работать или продлеваться долгосрочно",
    ];
  }

  return [
    "У вас есть конкретное основание для маршрута и документы под него",
    "Вы готовы проверить требования по актуальным источникам до подачи",
    "Первые месяцы переезда уже посчитаны по деньгам, жилью и срокам",
  ];
}

function buildRuPathWeakPoints(path: LegalPath) {
  if (path.requires_remote_income) {
    return [
      "Слабое место — качество подтверждения дохода: нерегулярные платежи, наличные или неясные клиенты усложняют кейс",
      "Удалённая работа не отменяет налоговые, страховые и жилищные вопросы после приезда",
      "Порог дохода и список документов нужно проверять прямо перед подачей",
    ];
  }
  if (path.requires_local_employer) {
    return [
      "Без работодателя маршрут почти не существует, даже если страна вам идеально подходит по жизни",
      "Оффер с низкой зарплатой может проиграть жилью, страховке и стоимости первого месяца",
      "Сроки зависят не только от вас, но и от HR, спонсорства, ведомств и готовности документов",
    ];
  }
  if (path.requires_admission) {
    return [
      "Поступление — главный шлюз: без него визовый план остаётся теорией",
      "Учёба как фиктивный повод создаёт риск на продлении и в долгосрочной стратегии",
      "Стоимость программы, жильё и доказательство средств часто важнее, чем кажется",
    ];
  }
  if (path.scenario === "business") {
    return [
      "Бизнес-маршруты требуют больше структуры, чем обычная регистрация компании",
      "Ошибки в налогах, банковском доступе или модели бизнеса могут сделать переезд дорогим тупиком",
      "Нужна местная проверка до затрат на регистрацию, офис, консультантов и аренду",
    ];
  }
  if (path.scenario === "capital") {
    return [
      "Финансовые доказательства должны быть чистыми, понятными и актуальными",
      "Маршрут может ограничивать работу или не подходить тем, кому нужен активный доход",
      "Курс валют, страховка и долгий срок рассмотрения могут менять реальный бюджет",
    ];
  }
  if (path.scenario === "talent") {
    return [
      "Обычное хорошее резюме обычно слабее, чем требуется для talent-маршрута",
      "Доказательства нужно упаковать юридически и профессионально, а не просто перечислить достижения",
      "Отказ или слабая оценка кейса может потратить месяцы, если не проверить профиль заранее",
    ];
  }
  if (path.scenario === "exploration") {
    return [
      "Разведка не решает долгосрочный статус и не должна маскировать отсутствие стратегии",
      "Хорошая поездка может скрыть бюрократию, аренду, налоги и рутину обычного месяца",
      "Нужно заранее знать лимиты пребывания, страховку, обратные билеты и правила въезда",
    ];
  }

  return [
    "Главный риск — строить план по общему описанию, а не по вашим документам",
    "Требования, сроки и трактовка ведомств могут меняться",
    "Жильё и деньги первого месяца часто становятся не меньшим фильтром, чем сама виза",
  ];
}

function formatPreparationTime(value: string, language: UiLanguage) {
  if (language !== "ru") return value;

  return value
    .replace(/(\d+)\s+to\s+(\d+)\s+months?/gi, "$1-$2 месяцев")
    .replace(/(\d+)\s+to\s+(\d+)\s+weeks?/gi, "$1-$2 недели")
    .replace(/(\d+)\s+to\s+(\d+)\s+days?/gi, "$1-$2 дней");
}

export function translateLegalPathText(value: string, language: UiLanguage) {
  if (language !== "ru") return value;
  return TEXT_RU[value] ?? value;
}

export function getLegalPathDisplay(path: LegalPath, language: UiLanguage) {
  return {
    name: language === "ru" ? PATH_NAME_RU[path.id] ?? buildRuPathName(path) : path.name,
    summary:
      language === "ru" ? SUMMARY_RU[path.id] ?? buildRuPathSummary(path) : path.summary,
    goodIf:
      language === "ru"
        ? buildRuPathGoodIf(path)
        : path.goodIf.map((item) => translateLegalPathText(item, language)),
    weakPoints:
      language === "ru"
        ? buildRuPathWeakPoints(path)
        : path.weakPoints.map((item) => translateLegalPathText(item, language)),
    estimatedPreparationTime: formatPreparationTime(path.estimatedPreparationTime, language),
    legalDisclaimer:
      language === "ru" ? DEFAULT_DISCLAIMER_RU : path.legal_disclaimer,
  };
}
