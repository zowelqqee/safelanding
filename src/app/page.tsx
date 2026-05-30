import Link from "next/link";
import { ArrowRight, Shield, CheckCircle, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/site-header";
import { COUNTRIES } from "@/lib/data/countries";
import { getServerLanguage } from "@/lib/i18n/server";
import type { UiLanguage } from "@/lib/i18n/onboarding";

const COPY = {
  en: {
    hero: {
      chips: ["Country shortlist", "City decision", "Legal path fit", "Move brief"],
      title: "Move countries without\ngetting lost.",
      description:
        "Where to go, how to enter legally, what to compare, what may block you, and what to do next — in one calm planning flow.",
      routes: [
        { label: "Remote worker", value: "Portugal → Lisbon" },
        { label: "Legal path", value: "D8 Digital Nomad Visa" },
        { label: "Next step", value: "Move Brief → Review" },
      ],
      cta: "Start my move",
      sub: "Free to start. No account required to see your results.",
    },
    statement: {
      headline: "Moving shouldn't feel like 40 tabs, Telegram chats, PDFs, and panic.",
      body: "Soft Landing turns relocation into a clear path:",
      highlights: ["where to go", "how to enter legally", "what to prepare", "what can go wrong"],
      suffix: "and what to do next.",
    },
    howItWorks: {
      kicker: "How it works",
      title: "From confusion to clarity.",
      subtitle: "Four steps from scattered research to a clear plan.",
      steps: [
        {
          number: "01",
          title: "Tell us about yourself",
          description:
            "Your situation, goals, region preferences, and what you're optimizing for. Takes 3 minutes.",
        },
        {
          number: "02",
          title: "Get your country shortlist",
          description:
            "We rank destinations by fit — not a generic top-10. Save, compare, then choose.",
        },
        {
          number: "03",
          title: "Pick city and legal path",
          description:
            "Choose a city. We show which visa or residency path actually fits your situation.",
        },
        {
          number: "04",
          title: "Follow your journey",
          description: "Stages, tasks, readiness score. You always know what's next.",
        },
      ],
    },
    whatYouGet: {
      kicker: "What you get",
      title: "Everything in one place.",
      subtitle: "Not scattered across tabs, PDFs, and Telegram chats.",
      features: [
        {
          title: "Country & city match",
          description:
            "A ranked shortlist of destinations matched to your goal, income, and region — with fit reasons and risks per country.",
        },
        {
          title: "Legal path clarity",
          description:
            "Understand which visa or residency path fits your situation in your chosen country. No generic lists.",
        },
        {
          title: "Reality preview",
          description:
            "See the real blocker, first-90-days preview, and what people usually underestimate before you commit.",
        },
        {
          title: "Journey map",
          description:
            "Stages, tasks, readiness score. You see real progress and a clear next step — not just a to-do list.",
        },
      ],
    },
    destinations: {
      kicker: "Available destinations",
      titleSuffix: "countries, expanding",
      subtitle:
        "Southern Europe, Central Europe, North America, the Gulf, Central Asia, and Asia — with country, city, and legal-path fit layers built in.",
      explore: "Explore",
      fullJourney: "Full journey",
      cta: "Find my destination",
    },
    cta: {
      title: "Your move, step by step.",
      subtitle:
        "Start for free. No account required to see your country match and legal path options.",
      button: "Start my move",
    },
    footer:
      "Soft Landing provides structured relocation guidance and document organization. It is not a law firm and does not provide legal advice. Requirements may change. For legal decisions, consult a qualified immigration professional.",
  },
  ru: {
    hero: {
      chips: ["Подбор страны", "Выбор города", "Подходящий легальный путь", "Move Brief"],
      title: "Переехать в другую страну\nи не потеряться.",
      description:
        "Куда ехать, как въехать легально, что сравнить, что может помешать и что делать дальше — в одном спокойном плане.",
      routes: [
        { label: "Удалённая работа", value: "Португалия → Лиссабон" },
        { label: "Легальный путь", value: "D8 Digital Nomad Visa" },
        { label: "Следующий шаг", value: "Move Brief → Ревью" },
      ],
      cta: "Начать план переезда",
      sub: "Бесплатно. Аккаунт не нужен, чтобы увидеть результаты.",
    },
    statement: {
      headline:
        "Переезд не должен быть 40 вкладками, чатами в Telegram, PDF-ками и паникой.",
      body: "Soft Landing превращает переезд в понятный маршрут:",
      highlights: ["куда ехать", "как въехать легально", "что готовить", "что может пойти не так"],
      suffix: "и что делать дальше.",
    },
    howItWorks: {
      kicker: "Как это работает",
      title: "От хаоса к ясности.",
      subtitle: "Четыре шага от разрозненных исследований к чёткому плану.",
      steps: [
        {
          number: "01",
          title: "Расскажите о себе",
          description:
            "Ваша ситуация, цели, предпочтения по регионам и приоритеты. Занимает 3 минуты.",
        },
        {
          number: "02",
          title: "Получите подборку стран",
          description:
            "Ранжируем направления по совпадению — не generic top-10. Сохраняйте, сравнивайте, выбирайте.",
        },
        {
          number: "03",
          title: "Выберите город и легальный путь",
          description:
            "Выберите город. Покажем, какая виза или ВНЖ действительно подходит именно вам.",
        },
        {
          number: "04",
          title: "Следуйте своему маршруту",
          description: "Этапы, задачи, показатель готовности. Всегда знаете, что делать дальше.",
        },
      ],
    },
    whatYouGet: {
      kicker: "Что вы получаете",
      title: "Всё в одном месте.",
      subtitle: "Не разбросано по вкладкам, PDF-файлам и чатам в Telegram.",
      features: [
        {
          title: "Подбор страны и города",
          description:
            "Ранжированный список направлений, подобранных под вашу цель, доход и регион — с причинами совпадения и рисками по каждой стране.",
        },
        {
          title: "Ясность с легальным путём",
          description:
            "Поймите, какая виза или ВНЖ подходит вашей ситуации в выбранной стране. Никаких общих списков.",
        },
        {
          title: "Предварительный просмотр реальности",
          description:
            "Смотрите главный блокер, превью первых 90 дней и то, что люди обычно недооценивают — до того, как вы определитесь.",
        },
        {
          title: "Карта маршрута",
          description:
            "Этапы, задачи, показатель готовности. Видите реальный прогресс и чёткий следующий шаг — не просто список дел.",
        },
      ],
    },
    destinations: {
      kicker: "Доступные направления",
      titleSuffix: "стран, список расширяется",
      subtitle:
        "Южная Европа, Центральная Европа, Северная Америка, Ближний Восток, Центральная Азия и Азия — с послойным анализом страны, города и легального пути.",
      explore: "Обзор",
      fullJourney: "Полный маршрут",
      cta: "Найти моё направление",
    },
    cta: {
      title: "Переезд, разложенный по шагам.",
      subtitle:
        "Начните бесплатно. Аккаунт не нужен, чтобы увидеть подборку стран и варианты легального пути.",
      button: "Начать план переезда",
    },
    footer:
      "Soft Landing предоставляет структурированные рекомендации по переезду и помогает организовать документы. Это не юридическая фирма и не юридическая консультация. Требования могут меняться. Для юридических решений обращайтесь к квалифицированному специалисту по иммиграции.",
  },
} satisfies Record<UiLanguage, unknown>;

export default async function LandingPage() {
  const language = await getServerLanguage();
  const copy = COPY[language];

  return (
    <div className="city-page-wrap flex flex-col min-h-screen">
      <SiteHeader variant="public" action="landing" initialLanguage={language} />
      <main className="flex-1">
        <HeroSection copy={copy.hero} />
        <StatementSection copy={copy.statement} />
        <HowItWorksSection copy={copy.howItWorks} />
        <WhatYouGetSection copy={copy.whatYouGet} />
        <DestinationsSection copy={copy.destinations} />
        <CtaSection copy={copy.cta} />
      </main>
      <LandingFooter text={copy.footer} />
    </div>
  );
}

type HeroCopy = typeof COPY["en"]["hero"];

function HeroSection({ copy }: { copy: HeroCopy }) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-10">
      <div className="city-card relative overflow-hidden rounded-[32px] px-6 py-10 text-center sm:px-10 sm:py-14">
        <div className="relative">
          <div className="mx-auto mb-6 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--city-muted-fg)]">
            {copy.chips.map((chip, i) => (
              <>
                <span key={chip} className="rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-3 py-1">
                  {chip}
                </span>
                {i < copy.chips.length - 1 && (
                  <span key={`dot-${i}`} className="text-[var(--city-border)]">·</span>
                )}
              </>
            ))}
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-900 leading-[1.1] mb-6 whitespace-pre-line">
            {copy.title}
          </h1>

          <p className="text-base sm:text-lg text-[var(--city-muted-fg)] max-w-xl mx-auto mb-8 leading-relaxed">
            {copy.description}
          </p>

          <div className="mx-auto mb-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
            {copy.routes.map((route) => (
              <RouteChip key={route.label} label={route.label} value={route.value} />
            ))}
          </div>

          <Link href="/start">
            <Button size="lg" className="gap-2 rounded-full text-sm px-7 h-12">
              {copy.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-xs text-[var(--city-muted-fg)] mt-4">{copy.sub}</p>
        </div>
      </div>
    </section>
  );
}

function RouteChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--city-muted-fg)]">{label}</p>
      <p className="mt-1.5 text-sm font-medium text-stone-900">{value}</p>
    </div>
  );
}

type StatementCopy = typeof COPY["en"]["statement"];

function StatementSection({ copy }: { copy: StatementCopy }) {
  return (
    <section className="px-4 sm:px-6 py-14 bg-[var(--city-warm-muted)]">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xl sm:text-2xl font-medium text-stone-900 mb-4 leading-snug">
          {copy.headline}
        </p>
        <p className="text-base text-[var(--city-muted-fg)] leading-relaxed max-w-lg mx-auto">
          {copy.body}{" "}
          {copy.highlights.map((h, i) => (
            <span key={h}>
              <span className="text-stone-800 font-medium">{h}</span>
              {i < copy.highlights.length - 1 ? ", " : " "}
            </span>
          ))}
          {copy.suffix}
        </p>
      </div>
    </section>
  );
}

type HowItWorksCopy = typeof COPY["en"]["howItWorks"];

function HowItWorksSection({ copy }: { copy: HowItWorksCopy }) {
  return (
    <section className="px-4 sm:px-6 py-14 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <p className="city-section-kicker mb-2">{copy.kicker}</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">{copy.title}</h2>
        <p className="text-[var(--city-muted-fg)] mt-2 text-sm max-w-sm mx-auto">{copy.subtitle}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {copy.steps.map((step) => (
          <div key={step.number} className="city-card rounded-[22px] p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)] mb-3">
              {step.number}
            </div>
            <h3 className="font-semibold text-sm text-stone-900 mb-2">{step.title}</h3>
            <p className="text-xs text-[var(--city-muted-fg)] leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

type WhatYouGetCopy = typeof COPY["en"]["whatYouGet"];

const FEATURE_ICONS = [Globe, Shield, FileText, CheckCircle];

function WhatYouGetSection({ copy }: { copy: WhatYouGetCopy }) {
  return (
    <section className="px-4 sm:px-6 py-14 bg-[var(--city-warm-muted)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="city-section-kicker mb-2">{copy.kicker}</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">{copy.title}</h2>
          <p className="text-[var(--city-muted-fg)] mt-2 text-sm max-w-sm mx-auto">{copy.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {copy.features.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <div key={f.title} className="city-card flex gap-4 rounded-[22px] p-5">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)] flex items-center justify-center">
                  <Icon className="h-4 w-4 text-stone-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-stone-900 mb-1.5">{f.title}</h3>
                  <p className="text-xs text-[var(--city-muted-fg)] leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type DestinationsCopy = typeof COPY["en"]["destinations"];

function DestinationsSection({ copy }: { copy: DestinationsCopy }) {
  return (
    <section className="px-4 sm:px-6 py-14 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <p className="city-section-kicker mb-2">{copy.kicker}</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">
          {COUNTRIES.length} {copy.titleSuffix}
        </h2>
        <p className="text-[var(--city-muted-fg)] mt-2 text-sm max-w-md mx-auto">{copy.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {COUNTRIES.map((country) => (
          <Link key={country.id} href={`/explore/${country.slug}`}>
            <div className="city-card rounded-[18px] p-4 text-center hover:border-stone-400 transition-colors cursor-pointer">
              <div className="text-2xl mb-1.5">{country.emoji}</div>
              <div className="font-semibold text-sm text-stone-900 mb-0.5">{country.name}</div>
              <div className="text-[11px] text-[var(--city-muted-fg)]">
                {country.journeyAvailable ? copy.fullJourney : copy.explore}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Link href="/start">
          <Button variant="outline" className="gap-2 rounded-full border-[var(--city-border)] text-stone-700 hover:bg-[var(--city-warm-muted)]">
            {copy.cta}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

type CtaCopy = typeof COPY["en"]["cta"];

function CtaSection({ copy }: { copy: CtaCopy }) {
  return (
    <section className="px-4 sm:px-6 py-16 bg-[var(--city-warm-muted)]">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 mb-3">{copy.title}</h2>
        <p className="text-[var(--city-muted-fg)] mb-8 max-w-sm mx-auto text-sm leading-relaxed">{copy.subtitle}</p>
        <Link href="/start">
          <Button size="lg" className="gap-2 rounded-full text-sm px-7 h-12">
            {copy.button}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

function LandingFooter({ text }: { text: string }) {
  return (
    <footer className="border-t border-[var(--city-border)] px-4 py-6 text-center">
      <p className="text-xs text-[var(--city-muted-fg)] max-w-lg mx-auto">{text}</p>
    </footer>
  );
}
