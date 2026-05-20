import Link from "next/link";
import { ArrowRight, Shield, CheckCircle, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeaderActions } from "@/components/landing/landing-header-actions";
import { COUNTRIES } from "@/lib/data/countries";

export default function LandingPage() {
  return (
    <div className="city-page-wrap flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <StatementSection />
        <HowItWorksSection />
        <WhatYouGetSection />
        <DestinationsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}

function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--city-border)] bg-[var(--city-bg)]/95 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-stone-900 tracking-tight text-base transition-opacity hover:opacity-70"
        >
          Soft Landing
        </Link>
        <LandingHeaderActions />
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-10">
      <div className="city-card relative overflow-hidden rounded-[32px] px-6 py-10 text-center sm:px-10 sm:py-14">
        <div className="relative">
          <div className="mx-auto mb-6 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--city-muted-fg)]">
            <span className="rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-3 py-1">Country shortlist</span>
            <span className="text-[var(--city-border)]">·</span>
            <span className="rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-3 py-1">City decision</span>
            <span className="text-[var(--city-border)]">·</span>
            <span className="rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-3 py-1">Legal path fit</span>
            <span className="text-[var(--city-border)]">·</span>
            <span className="rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-3 py-1">Move brief</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-900 leading-[1.1] mb-6">
            Move countries without<br />getting lost.
          </h1>

          <p className="text-base sm:text-lg text-[var(--city-muted-fg)] max-w-xl mx-auto mb-8 leading-relaxed">
            Where to go, how to enter legally, what to compare, what may block you,
            and what to do next — in one calm planning flow.
          </p>

          <div className="mx-auto mb-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
            <RouteChip label="Remote worker" value="Portugal → Lisbon" />
            <RouteChip label="Legal path" value="D8 Digital Nomad Visa" />
            <RouteChip label="Next step" value="Move Brief → Review" />
          </div>

          <Link href="/start">
            <Button size="lg" className="gap-2 rounded-full text-sm px-7 h-12">
              Start my move
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-xs text-[var(--city-muted-fg)] mt-4">
            Free to start. No account required to see your results.
          </p>
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

function StatementSection() {
  return (
    <section className="px-4 sm:px-6 py-14 bg-[var(--city-warm-muted)]">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xl sm:text-2xl font-medium text-stone-900 mb-4 leading-snug">
          Moving shouldn&apos;t feel like 40 tabs, Telegram chats, PDFs, and panic.
        </p>
        <p className="text-base text-[var(--city-muted-fg)] leading-relaxed max-w-lg mx-auto">
          Soft Landing turns relocation into a clear path:{" "}
          <span className="text-stone-800 font-medium">where to go</span>,{" "}
          <span className="text-stone-800 font-medium">how to enter legally</span>,{" "}
          <span className="text-stone-800 font-medium">what to prepare</span>,{" "}
          <span className="text-stone-800 font-medium">what can go wrong</span>, and{" "}
          <span className="text-stone-800 font-medium">what to do next</span>.
        </p>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Tell us about yourself",
      description: "Your situation, goals, region preferences, and what you're optimizing for. Takes 3 minutes.",
    },
    {
      number: "02",
      title: "Get your country shortlist",
      description: "We rank destinations by fit — not a generic top-10. Save, compare, then choose.",
    },
    {
      number: "03",
      title: "Pick city and legal path",
      description: "Choose a city. We show which visa or residency path actually fits your situation.",
    },
    {
      number: "04",
      title: "Follow your journey",
      description: "Stages, tasks, readiness score. You always know what's next.",
    },
  ];

  return (
    <section className="px-4 sm:px-6 py-14 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <p className="city-section-kicker mb-2">How it works</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">From confusion to clarity.</h2>
        <p className="text-[var(--city-muted-fg)] mt-2 text-sm max-w-sm mx-auto">Four steps from scattered research to a clear plan.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div key={step.number} className="city-card rounded-[22px] p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)] mb-3">
              {step.number}
            </div>
            <h3 className="font-semibold text-sm text-stone-900 mb-2">{step.title}</h3>
            <p className="text-xs text-[var(--city-muted-fg)] leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhatYouGetSection() {
  const features = [
    {
      icon: Globe,
      title: "Country & city match",
      description: "A ranked shortlist of destinations matched to your goal, income, and region — with fit reasons and risks per country.",
    },
    {
      icon: Shield,
      title: "Legal path clarity",
      description: "Understand which visa or residency path fits your situation in your chosen country. No generic lists.",
    },
    {
      icon: FileText,
      title: "Reality preview",
      description: "See the real blocker, first-90-days preview, and what people usually underestimate before you commit.",
    },
    {
      icon: CheckCircle,
      title: "Journey map",
      description: "Stages, tasks, readiness score. You see real progress and a clear next step — not just a to-do list.",
    },
  ];

  return (
    <section className="px-4 sm:px-6 py-14 bg-[var(--city-warm-muted)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="city-section-kicker mb-2">What you get</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">Everything in one place.</h2>
          <p className="text-[var(--city-muted-fg)] mt-2 text-sm max-w-sm mx-auto">Not scattered across tabs, PDFs, and Telegram chats.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="city-card flex gap-4 rounded-[22px] p-5">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)] flex items-center justify-center">
                <f.icon className="h-4 w-4 text-stone-700" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-stone-900 mb-1.5">{f.title}</h3>
                <p className="text-xs text-[var(--city-muted-fg)] leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DestinationsSection() {
  return (
    <section className="px-4 sm:px-6 py-14 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <p className="city-section-kicker mb-2">Available destinations</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">12 countries, expanding</h2>
        <p className="text-[var(--city-muted-fg)] mt-2 text-sm max-w-md mx-auto">
          Southern Europe, Central Europe, North America, the Gulf, and Asia —
          with country, city, and legal-path fit layers built in.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {COUNTRIES.map((country) => (
          <Link key={country.id} href={`/explore/${country.slug}`}>
            <div className="city-card rounded-[18px] p-4 text-center hover:border-stone-400 transition-colors cursor-pointer">
              <div className="text-2xl mb-1.5">{country.emoji}</div>
              <div className="font-semibold text-sm text-stone-900 mb-0.5">{country.name}</div>
              <div className="text-[11px] text-[var(--city-muted-fg)]">
                {country.journeyAvailable ? "Full journey" : "Explore"}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Link href="/start">
          <Button variant="outline" className="gap-2 rounded-full border-[var(--city-border)] text-stone-700 hover:bg-[var(--city-warm-muted)]">
            Find my destination
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="px-4 sm:px-6 py-16 bg-[var(--city-warm-muted)]">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 mb-3">Your move, step by step.</h2>
        <p className="text-[var(--city-muted-fg)] mb-8 max-w-sm mx-auto text-sm leading-relaxed">
          Start for free. No account required to see your country match and legal
          path options.
        </p>
        <Link href="/start">
          <Button size="lg" className="gap-2 rounded-full text-sm px-7 h-12">
            Start my move
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-[var(--city-border)] px-4 py-6 text-center">
      <p className="text-xs text-[var(--city-muted-fg)] max-w-lg mx-auto">
        Soft Landing provides structured relocation guidance and document
        organization. It is not a law firm and does not provide legal advice.
        Requirements may change. For legal decisions, consult a qualified
        immigration professional.
      </p>
    </footer>
  );
}
