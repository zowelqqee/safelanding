# Soft Landing

**Soft Landing** is a mobile-first relocation planning product for people who want to move countries without getting lost in browser tabs, visa forums, agency sales funnels, PDFs, and half-trusted advice.

It helps a person turn a vague thought like:

> “Maybe I should move somewhere else.”

into a clearer path:

```txt
where could I realistically go
→ which cities fit my actual life
→ which legal paths might make sense
→ what is the main blocker
→ what should I do next
```

Soft Landing is not a travel app, not a visa agency, and not a legal-advice tool. It is a calm decision layer for the early stage of relocation, before documents, applications, and agency handoff.

---

## Why This Exists

Relocation is usually treated as an information problem: more articles, more checklists, more country pages, more videos.

But for most people, the real problem is not a lack of information. It is a lack of structure.

They need to know:

- which destinations are realistic for their profile;
- what tradeoffs they are actually making;
- whether a city fits their budget, work, family, and tolerance for friction;
- which legal route is plausible enough to explore further;
- what needs expert verification before money or time is committed.

Soft Landing turns that chaos into a guided flow.

---

## Product Idea

The product is built around one simple promise:

> Help people make better relocation decisions before they make expensive relocation mistakes.

Soft Landing helps users:

- compare countries by lifestyle fit and legal fit;
- choose cities based on lived constraints, not just aesthetics;
- identify the main blocker for each destination;
- understand high-level legal path fit;
- build a persistent move profile;
- follow a personal relocation roadmap;
- generate a Move Brief that can later support human partner review;
- give feedback and behavioral signals so the product can learn what is useful.

The product intentionally avoids fake certainty. It does not say “you qualify”, “you will get approved”, or “this is your exact checklist”. Instead, it frames results as fit assessment, friction, blockers, and next steps.

---

## Core User Journey

```txt
Landing
  ↓
Sign up / sign in
  ↓
Onboarding
  ↓
Country shortlist
  ↓
City shortlist
  ↓
Legal path selection
  ↓
Personal roadmap
  ↓
Build move profile
  ↓
Move Brief
  ↓
Partner review request
```

The experience starts with personal context: citizenship, current country, relocation goal, budget range, savings, income type, lifestyle preferences, concerns, open regions, and optimization goal.

From there, Soft Landing recommends countries and cities, explains why they fit or do not fit, and moves the user toward a more concrete relocation plan.

---

## Main Product Surfaces

### Onboarding

A guided intake flow that builds the user’s relocation profile. The goal is not to collect everything, but to gather enough signal to make the first recommendations useful.

### Country Matching

Countries are evaluated across lifestyle, legal, cost, housing, language, work, study, family, climate, stability, and bureaucracy dimensions.

The user does not just see a score. They see reasons, risks, and the main blocker.

### City Matching

City selection focuses on the practical reality of living somewhere:

- housing pressure;
- monthly budget;
- first 90 days difficulty;
- transport;
- English friendliness;
- remote-work fit;
- career fit;
- family fit;
- lifestyle tradeoffs.

The product treats cities as lived environments, not postcard thumbnails.

### Legal Path Fit

Legal paths are presented as high-level fit assessments. The product can show which routes may be worth investigating, but it does not provide legal certainty.

This is an intentional product boundary.

### Roadmap

The roadmap translates the user’s choices into a staged relocation journey:

```txt
Find your place
Choose legal path
Build your move profile
Prepare documents
Review risks
Submit / appointment
Prepare arrival
First 30 days
```

The current MVP focuses on the early stages and the move-profile layer.

### Move Brief

The Move Brief summarizes the user’s selected country, city, legal path, profile details, blockers, and next steps.

It is designed as a bridge between self-guided planning and future partner or expert review.

### Partner Review

Partner review is the intended handoff layer for verified document guidance, agency support, or expert review.

This is where legal/document certainty belongs: with qualified humans or verified partners, not with an unverified product screen.

---

## What Makes It Different

Soft Landing is not trying to be the biggest immigration database.

It is trying to be the clearest decision interface.

The product separates:

- **Lifestyle fit**: would this place work for the user’s day-to-day life?
- **Legal fit**: does the user have a plausible route to stay?
- **Practical friction**: what will likely hurt first?
- **Next action**: what should the user do now?

That separation matters because relocation decisions fail when everything is collapsed into one vague “best country” score.

---

## Design Philosophy

Soft Landing should feel calm, premium, practical, and adult.

It should not feel like:

- a government portal;
- a visa agency landing page;
- a generic travel blog;
- a Notion template;
- a corporate SaaS dashboard;
- a toy-like gamified app.

The interface is mobile-first because many relocation decisions happen in fragments: on a phone, between work, while comparing options, while talking to family, while trying not to spiral.

The product should make that moment feel smaller and more manageable.

---

## Data and Intelligence

Soft Landing combines structured product data, scoring logic, user profile state, behavioral analytics, and an optional city recommendation model.

At a high level, the system includes:

- curated country profiles;
- curated city profiles;
- legal path definitions;
- document type references;
- city reality reports;
- relocation video story references;
- profile-based country scoring;
- profile-based city scoring;
- legal path scoring;
- event analytics for product learning;
- feedback capture;
- a local ML-assisted city recommendation layer.

The matching system is designed to be explainable. Recommendations should come with reasons and risks, not just rankings.

---

## Behavioral Analytics

The product captures MVP analytics to understand what users actually inspect, compare, and trust.

Example behavioral event:

```json
{
  "event_name": "city_card_view",
  "event_payload": {
    "city_id": 21,
    "app_city_id": "amsterdam",
    "duration_ms": 4200,
    "position": 1,
    "scrolled_to_details": true,
    "session_id": "uuid"
  }
}
```

This is used to learn which city cards, comparison surfaces, and decision points deserve more product attention.

---

## Product Boundaries

Soft Landing is intentionally conservative about legal and document claims.

It does not provide:

- guaranteed visa outcomes;
- exact official document checklists;
- legal advice;
- approval probability;
- fixed income thresholds without verification;
- country-specific legal certainty.

The product can help a user understand fit and friction. Verified document guidance must come from qualified sources, partner agencies, or expert review.

---

## Current MVP Scope

The MVP focuses on the pre-document relocation layer:

- authentication;
- persistent move profile;
- onboarding;
- country discovery;
- country matching;
- city matching;
- legal path fit assessment;
- personal roadmap;
- build-profile forms;
- saved country/city/path state;
- Move Brief generation;
- partner review request flow;
- behavioral analytics;
- feedback capture;
- mobile-first app shell.

The document vault, verified checklist layer, and deeper legal risk engine are intentionally not the active core yet.

---

## Technology Overview

Soft Landing is built with:

- Next.js App Router;
- React;
- TypeScript;
- Tailwind CSS;
- Supabase Auth;
- Supabase PostgreSQL;
- Supabase Row Level Security;
- Framer Motion;
- Lucide React;
- a Python-based city recommendation model service;
- structured TypeScript data for destinations and legal paths.

The architecture keeps the MVP lightweight: user state and analytics live in Supabase, while destination and scoring data remain easy to iterate on in code.

---

## Repository Structure

```txt
src/app                     Application routes
src/components              Product UI and shared interface components
src/lib/data                Country, city, legal path, document, and story data
src/lib/scoring             Country, city, and legal path matching logic
src/lib/profile             Move profile persistence
src/lib/roadmap             Roadmap generation
src/lib/move-brief          Move Brief generation
src/lib/analytics           Product and behavioral analytics
src/lib/supabase            Supabase clients
supabase/migrations         Database migrations
ml                          City model inference service
relocation_dataset          Dataset generation and model utilities
public                      Static assets
```

---

## Product North Star

The user should leave each session thinking:

```txt
I know what fits me better.
I know what might block me.
I know what to compare next.
I know the next concrete step.
```

That is the product.

Everything else is furniture.

