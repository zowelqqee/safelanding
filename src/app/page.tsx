import Link from "next/link";
import { ArrowRight, Shield, CheckCircle, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeaderActions } from "@/components/landing/landing-header-actions";
import { COUNTRIES } from "@/lib/data/countries";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <ChaosSection />
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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-foreground tracking-tight transition-opacity hover:opacity-80"
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
    <section className="px-4 pt-16 pb-10 max-w-5xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-6">
        <Globe className="h-3.5 w-3.5" />
        Global relocation OS
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight mb-5">
        Move countries without
        <br />
        getting lost.
      </h1>
      <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
        Where to go, how to enter legally, what to prepare, what can go wrong,
        and what to do next — in one place.
      </p>
      <Link href="/start">
        <Button size="lg" className="gap-2 text-base px-6 h-12">
          Start my move
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
      <p className="text-xs text-muted-foreground mt-4">
        Free to start. No account required to see your results.
      </p>
    </section>
  );
}

function ChaosSection() {
  return (
    <section className="px-4 py-12 bg-muted/40">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xl sm:text-2xl font-semibold text-foreground mb-4 leading-snug">
          Moving shouldn&apos;t feel like 40 tabs, Telegram chats, PDFs, and panic.
        </p>
        <p className="text-base text-muted-foreground leading-relaxed">
          Soft Landing turns relocation into a clear path:{" "}
          <span className="text-foreground font-medium">where to go</span>,{" "}
          <span className="text-foreground font-medium">how to enter legally</span>,{" "}
          <span className="text-foreground font-medium">what to prepare</span>,{" "}
          <span className="text-foreground font-medium">what can go wrong</span>, and{" "}
          <span className="text-foreground font-medium">what to do next</span>.
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
      description: "Stages, tasks, documents, readiness score. You always know what's next.",
    },
  ];

  return (
    <section className="px-4 py-14 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">How it works</h2>
      <p className="text-muted-foreground text-center mb-10 text-sm">
        From confusion to clarity in four steps.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step) => (
          <div key={step.number} className="bg-card rounded-xl border p-5">
            <div className="text-xs font-mono text-primary font-semibold mb-3">
              {step.number}
            </div>
            <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
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
      description:
        "A ranked shortlist of destinations matched to your goal, income, and region — with fit reasons and risks per country.",
    },
    {
      icon: Shield,
      title: "Legal path clarity",
      description:
        "Understand which visa or residency path fits your situation in your chosen country. No generic lists.",
    },
    {
      icon: FileText,
      title: "Reality preview",
      description:
        "See the real blocker, first-90-days preview, and what people usually underestimate before you commit.",
    },
    {
      icon: CheckCircle,
      title: "Journey map",
      description:
        "Stages, tasks, readiness score. You see real progress and a clear next step — not just a to-do list.",
    },
  ];

  return (
    <section className="px-4 py-14 bg-muted/40">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">What you get</h2>
        <p className="text-muted-foreground text-center mb-10 text-sm">
          Everything in one place. Not scattered across tabs, PDFs, and Telegram chats.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4 p-5 rounded-xl border bg-card">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
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
    <section className="px-4 py-14 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 justify-center mb-2">
        <Globe className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-primary">Available destinations</span>
      </div>
      <h2 className="text-2xl font-bold text-center mb-2">12 countries, expanding</h2>
      <p className="text-muted-foreground text-center mb-8 text-sm max-w-md mx-auto">
        Southern Europe, Central Europe, North America, the Gulf, and Asia —
        with country, city, and legal-path fit layers built in.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {COUNTRIES.map((country) => (
          <Link key={country.id} href={`/explore/${country.slug}`}>
            <div className="bg-card rounded-xl border p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <div className="text-2xl mb-1">{country.emoji}</div>
              <div className="font-semibold text-sm mb-0.5">{country.name}</div>
              <div className="text-xs text-muted-foreground">
                {country.journeyAvailable ? "Full journey" : "Explore"}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Link href="/start">
          <Button variant="outline" className="gap-2">
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
    <section className="px-4 py-16 bg-muted/40">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-3">Your move, step by step.</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Start for free. No account required to see your country match and legal
          path options.
        </p>
        <Link href="/start">
          <Button size="lg" className="gap-2 text-base px-6 h-12">
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
    <footer className="border-t px-4 py-6 text-center">
      <p className="text-xs text-muted-foreground max-w-lg mx-auto">
        Soft Landing provides structured relocation guidance and document
        organization. It is not a law firm and does not provide legal advice.
        Requirements may change. For legal decisions, consult a qualified
        immigration professional.
      </p>
    </footer>
  );
}
