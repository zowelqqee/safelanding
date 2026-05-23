# Soft Landing

Soft Landing is a mobile-first relocation planning app that helps people move countries without getting lost.

It guides users from country discovery to city selection, legal path assessment, move profile building, and a personal roadmap. The product is designed to feel less like a visa wiki and more like a step-by-step relocation journey.

The core idea is simple:

> Moving countries should not feel like 40 tabs, Telegram chats, PDFs, and panic.

Soft Landing turns relocation into a structured path:
where to go, which legal route may fit, what the main blockers are, what to compare, and what to do next.

---

## Product vision

Soft Landing is not a travel app, not a legal firm, and not a generic immigration blog.

It is a consumer relocation operating system.

The app helps users:

- compare countries by lifestyle fit and legal fit;
- choose cities/regions based on real constraints;
- understand high-level legal paths without diving into legal chaos;
- build a personal move profile;
- follow a Duolingo-like relocation roadmap;
- save countries, cities, and legal routes;
- prepare for verified document guidance later through partners or agencies.

The product intentionally stops before giving unverified document checklists.

Document requirements, application packages, and legal review must be verified with local experts or partner agencies before becoming part of the product.

---

## Current MVP scope

The current MVP focuses on the pre-document relocation layer:

1. User authentication
2. Persistent move profile
3. Global country discovery
4. Country and city matching
5. Legal path fit assessment
6. Personal relocation roadmap
7. Interactive “Build your move profile” level
8. Saved country/city/path state
9. Profile-based restore after login
10. Mobile-first app shell

The product currently does **not** provide legal advice, verified document checklists, file uploads, or visa guarantees.

---

## Core flow

The main user flow:

```txt
Start
→ Create profile / sign in
→ Onboarding
→ Country shortlist
→ City shortlist
→ Legal path options
→ Move plan
→ Roadmap
→ Build move profile
→ Prepare documents placeholder
```

The roadmap currently includes:

1. Find your place
2. Choose legal path
3. Build your move profile
4. Prepare documents
5. Review risks
6. Submit / appointment
7. Prepare arrival
8. First 30 days

Only the first three levels are implemented as active product logic.

The `Prepare documents` level is intentionally blocked from showing unverified requirements until partner/agency validation exists.

---

## Key product principles

### Mobile-first

Soft Landing is designed primarily for phone-sized screens.

The app should feel usable on an iPhone-sized viewport first. Desktop is a wider companion layout, not the primary design target.

Rules:

* single-column mobile layouts;
* bottom navigation for logged-in app screens;
* large touch targets;
* cards instead of dense tables;
* short forms;
* clear next action;
* no desktop-first dashboards squeezed into mobile.

If a screen is uncomfortable on mobile, the screen is wrong.

### Personal, not generic

The app should always answer:

* Does this destination fit me?
* What is the blocker?
* What can I compare?
* What comes next?

Soft Landing should not feel like a wiki.

### Honest fit assessment

Country and legal route matching should separate:

* lifestyle fit;
* legal fit;
* overall fit.

A destination can be attractive but legally difficult.

Example: the United States may have strong career upside, but low legal fit if the user has no sponsor, no admission, and no extraordinary ability profile.

### No unverified legal claims

Soft Landing must avoid promising:

* guaranteed visa approval;
* exact document requirements without verification;
* fixed income thresholds without source/date;
* legal certainty.

Use cautious language:

* “requirements vary”;
* “verify before applying”;
* “professional review recommended”;
* “this is a fit assessment, not legal advice.”

---

## Tech stack

* Next.js App Router
* TypeScript
* Tailwind CSS
* Supabase
* Supabase Auth
* Supabase PostgreSQL
* Vercel-ready deployment
* Mobile-first responsive UI

---

## Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

For Supabase, use the project base URL:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
```

Use the public / publishable key for the frontend.

Do **not** put the Supabase secret key into any `NEXT_PUBLIC_` variable.

Set `NEXT_PUBLIC_SITE_URL` to the production origin, without a trailing slash:

```env
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

This origin is used for Supabase email confirmation callbacks. Do not set it to
`localhost` in environments where real confirmation emails are sent.

---

## Local development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

For testing on a phone in the same Wi-Fi network:

```bash
npm run dev -- --host 0.0.0.0
```

Then find the local IP address:

```bash
ipconfig getifaddr en0
```

Open on the phone:

```txt
http://YOUR_LOCAL_IP:3000
```

---

## Supabase setup

The app uses Supabase Auth and a `move_profiles` table as the main source of truth for the user’s relocation state.

### Required Supabase settings

In Supabase:

```txt
Authentication → Sign In / Providers → Email
```

Enable email/password auth.

For local development, email confirmation can be disabled.

### Main table

The core table is:

```txt
move_profiles
```

It stores:

* authenticated user id;
* onboarding answers;
* selected country;
* selected city;
* selected legal path;
* saved countries;
* saved cities;
* roadmap progress flags;
* move profile details.

The user profile is linked through:

```txt
move_profiles.user_id → auth.users.id
```

Row Level Security should allow users to read and update only their own profile.

---

## Current data model

The main persisted object is `MoveProfile`.

Important fields:

```txt
user_id
citizenship
current_country
residence_country
preferred_language

move_goal
monthly_income_range
savings_range
income_type

life_preferences
worries
open_regions
optimization_goal

saved_country_ids
saved_city_ids

selected_country_id
selected_city_id
selected_legal_path_id

active_step
onboarding_completed

personal_details_confirmed
timeline_confirmed
work_study_confirmed
budget_confirmed
family_confirmed

target_move_month
urgency_level
must_arrive_before
flexible_dates

work_status_detail
study_status_detail
has_job_offer
has_school_admission
employer_or_school_name

expected_monthly_budget_range
emergency_fund_range
budget_notes

moving_with
dependents_count
family_notes
```

---

## Roadmap logic

The roadmap is currently generated from `move_profiles` in code.

No separate roadmap tables are used yet.

This is intentional.

The roadmap should remain lightweight until the UX is validated.

The current generator decides:

* which level is completed;
* which level is active;
* which nodes are completed/current/queued/locked;
* the current task;
* the move preparation percentage.

### Current roadmap stages

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

### Implemented interactive nodes

Inside `Build your move profile`:

```txt
Confirm personal details
Add timeline
Add work/study details
Add budget reality
Add family/partner info
```

Each node opens a mobile-first form, saves into `move_profiles`, and unlocks the next node.

When all five are completed, `Prepare documents` becomes the current stage.

---

## What is intentionally not implemented yet

### Document checklist

Not implemented yet.

Reason: document guidance must be verified with partner agencies or qualified experts.

The app should not generate country/path-specific document requirements until they are reviewed.

### File upload

Not implemented yet.

Supabase Storage may be added later for:

* passport scans;
* bank statements;
* certificates;
* translations;
* insurance files;
* application forms.

### Legal risk engine

Not implemented yet.

Any risk scoring must be carefully designed and must not imply legal certainty.

### Partner review

Not implemented yet.

Future premium layer:

* expert review;
* agency handoff;
* verified document checklist;
* human consultation;
* partner services.

---

## App routes

Main public routes:

```txt
/
/start
/auth/sign-up
/auth/sign-in
```

Main app routes:

```txt
/app
/app/roadmap
/app/tasks
/app/vault
/app/explore
/app/profile
```

Roadmap forms:

```txt
/app/roadmap/personal-details
/app/roadmap/timeline
/app/roadmap/work-study
/app/roadmap/budget
/app/roadmap/family
```

---

## UX direction

Soft Landing should feel calm, premium, and practical.

It should not feel like:

* a government website;
* a visa agency landing page;
* a travel blog;
* a Notion template;
* a corporate SaaS dashboard;
* a childish gamified app.

The roadmap can borrow progression logic from Duolingo, but the tone must stay adult and trustworthy.

Good language:

```txt
Move preparation
Current level
Next task
Completed
Active
Queued
Locked
Main blocker
Legal fit
Lifestyle fit
```

Avoid:

```txt
Guaranteed
Easy visa
Approval chance
No risk
Clear node
Magic plan
```

---

## Product positioning

Short version:

```txt
Soft Landing helps people move countries without getting lost.
```

Longer version:

```txt
Soft Landing helps people choose where to move, understand realistic legal paths, build a personal move profile, and follow a step-by-step relocation roadmap.
```

More emotional version:

```txt
Moving should not feel like 40 tabs, Telegram chats, PDFs, and panic.
Soft Landing turns relocation into a clear path.
```

---

## Development rules

When adding new features:

1. Keep the app mobile-first.
2. Do not add legal claims without verification.
3. Do not expand into document requirements without partner/expert review.
4. Prefer generated logic from `move_profiles` before adding new tables.
5. Do not overbuild.
6. Preserve the main user path.
7. Every screen needs a clear next action.

---

## Near-term roadmap

### Phase 1 — Universal pre-document layer

* Expand country database
* Expand city/region database
* Expand high-level legal path database
* Add lifestyle fit vs legal fit
* Add country compare
* Add city compare
* Improve country/city pages with reality previews
* Improve saved countries/cities UX

### Phase 2 — Partner-verified document layer

* Verified document checklist templates
* Partner/agency review model
* Document status tracking
* Vault without upload first
* File upload later
* Human review CTA

### Phase 3 — Services and affiliate layer

* Insurance
* Housing
* Flights
* eSIM
* Banking
* Tax consultation
* Translation partners
* Legal partners
* Relocation agencies

### Phase 4 — Community/reality layer

* Structured relocation stories
* City reality reports
* “First 90 days” reports
* Common mistakes
* Cost reality vs expectation

---

## Current acceptance checklist

The current app should support:

* user sign up with email/password;
* user sign in;
* persistent `move_profiles` row;
* onboarding restore after refresh;
* country selection persistence;
* city selection persistence;
* legal path selection persistence;
* roadmap generated from user profile;
* interactive build-profile nodes;
* progress after each node;
* roadmap restore after refresh;
* sign out / sign in profile recovery.

---

## Legal disclaimer

Soft Landing provides structured relocation planning and general fit assessment.

It is not a law firm and does not provide legal advice.

Immigration requirements change and vary by country, consulate, personal situation, and legal route.

Before making legal or immigration decisions, users should consult qualified immigration professionals or verified partner agencies.
