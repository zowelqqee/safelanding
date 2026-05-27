# Soft Landing

**Soft Landing** — это mobile-first relocation operating system: приложение, которое помогает человеку переехать в другую страну без хаоса из 40 вкладок, Telegram-чатов, PDF-ок и тревожного “а что теперь?”.

Это не тревел-гайд.  
Это не визовое агентство.  
Это не блог “10 лучших стран для фрилансеров”.

Soft Landing превращает релокацию в понятный путь:

```txt
кто ты → куда тебе реально подходит → какой город выдержит твою жизнь
→ какой legal path выглядит правдоподобно → что делать дальше
```

Главная идея:

> Переезд не должен ощущаться как паника с красивой обложкой.

---

## Что это за продукт

Soft Landing помогает пользователю пройти ранний, самый мутный слой релокации:

- понять, какие страны подходят по lifestyle fit и legal fit;
- выбрать город не “по вайбу”, а по реальным ограничениям;
- увидеть главный blocker до того, как он станет дорогой ошибкой;
- сохранить страну, город и legal path;
- собрать move profile;
- получить персональный roadmap;
- подготовить Move Brief для будущего partner review;
- оставить feedback и поведенческие сигналы для аналитики MVP.

Продукт сознательно **не обещает визу**, **не дает юридическое заключение** и **не выдает непроверенные document checklists**. Документы, требования, thresholds и application packages должны проходить проверку через партнеров, агентства или квалифицированных экспертов.

---

## Core Flow

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

Внутри roadmap сейчас живет 8 уровней:

```txt
1. Find your place
2. Choose legal path
3. Build your move profile
4. Prepare documents
5. Review risks
6. Submit / appointment
7. Prepare arrival
8. First 30 days
```

Активная логика MVP покрывает первые уровни и build-profile слой. Документный слой намеренно закрыт до верификации.

---

## Главные принципы

### Mobile-first, правда mobile-first

Телефон — основной экран. Desktop — просто более широкий способ смотреть тот же путь.

Правила:

- один основной поток за раз;
- короткие формы;
- крупные touch targets;
- bottom navigation в app-зоне;
- карточки вместо табличного шума;
- понятное next action на каждом шаге;
- никакой “desktop SaaS dashboard, сжатый до iPhone”.

Если экран больно использовать на телефоне, экран неправильный.

### Personal, not generic

Каждый экран должен отвечать:

- подходит ли это мне;
- что меня остановит;
- с чем сравнить;
- какой следующий шаг.

Soft Landing не должен ощущаться как wiki. Он должен ощущаться как спокойный навигатор.

### Honest fit assessment

Подбор разделяет:

- `lifestyle fit` — насколько место подходит жизни пользователя;
- `legal fit` — насколько реалистичен путь легализации;
- `overall fit` — общий сигнал, но не магический рейтинг судьбы.

Страна может быть прекрасной, но юридически слабой для конкретного человека. И наоборот.

### No fake certainty

Запрещенный вайб:

```txt
Guaranteed approval
Exact visa checklist
100% match
You qualify
Move safely in 30 days
```

Правильный язык:

```txt
Fit assessment only
Requirements vary
Verify before applying
Professional review recommended
Main blocker
Likely friction
```

---

## Tech Stack

- **Next.js 16 App Router**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Supabase Auth**
- **Supabase PostgreSQL**
- **Supabase RLS**
- **Framer Motion**
- **Lucide React**
- **Local Python city model service**
- **Vercel-ready deployment**

Важно: в проекте есть `AGENTS.md` с правилом для Next.js:

```txt
This is NOT the Next.js you know.
Read node_modules/next/dist/docs before writing Next code.
```

Next здесь свежий, с измененными соглашениями. Перед серьезными изменениями в App Router лучше смотреть локальные docs в `node_modules/next/dist/docs/`.

---

## Project Map

```txt
.
├── src
│   ├── app                         # Next App Router routes
│   │   ├── (app)/app               # authenticated product area
│   │   ├── api                     # prediction APIs
│   │   ├── auth                    # sign-in, sign-up, callback
│   │   ├── compare                 # country/city comparison
│   │   ├── explore                 # public country/city guides
│   │   ├── internal/metrics        # admin-only MVP dashboard
│   │   └── start                   # onboarding entry
│   ├── components
│   │   ├── analytics               # page/event components
│   │   ├── city                    # city reality/video layers
│   │   ├── feedback                # feedback capture
│   │   ├── onboarding              # onboarding flow and steps
│   │   ├── partner-review          # partner review request UI
│   │   ├── roadmap                 # roadmap forms and cards
│   │   ├── site                    # headers/navigation
│   │   └── ui                      # shared UI primitives
│   ├── hooks
│   ├── lib
│   │   ├── analytics               # app_events + behavioral analytics
│   │   ├── auth                    # auth helpers
│   │   ├── data                    # countries, cities, legal paths, docs
│   │   ├── i18n                    # EN/RU UI language helpers
│   │   ├── move-brief              # Move Brief builder
│   │   ├── partner-review          # partner review persistence
│   │   ├── profile                 # move_profiles service layer
│   │   ├── roadmap                 # generated roadmap logic
│   │   ├── scoring                 # country/city/path matching
│   │   └── supabase                # browser/server/admin clients
│   └── types                       # product and DB-facing types
├── supabase
│   ├── migrations                  # actual Supabase migrations
│   ├── schema.sql                  # base snapshot / starter schema
│   └── schema_auth_later.sql       # future/older auth-heavy schema draft
├── ml                              # local city model HTTP server
├── relocation_dataset              # dataset generation and encoders
├── public                          # images, manifest, static assets
├── city_model.pt                   # trained local city model artifact
├── dataset.csv / dataset.json      # model data artifacts
├── train.py / predict.py           # model training/inference scripts
└── package.json
```

---

## Routes

Public:

```txt
/
/start
/explore
/explore/[country]
/explore/[country]/[city]
/compare
/auth/sign-in
/auth/sign-up
/auth/callback
```

Authenticated app:

```txt
/app
/app/roadmap
/app/roadmap/personal-details
/app/roadmap/timeline
/app/roadmap/work-study
/app/roadmap/budget
/app/roadmap/family
/app/tasks
/app/vault
/app/explore
/app/profile
/app/move-brief
/app/partner-review
```

Internal:

```txt
/internal/metrics
```

API:

```txt
/api/country-predictions
/api/city-predictions
```

---

## Data Model

### What lives in Supabase

Supabase is used for user-owned product state and MVP analytics:

```txt
auth.users
move_profiles
app_events
user_feedback
```

There is also app code for:

```txt
partner_review_requests
```

If you need that table in a fresh Supabase project, add a migration for it before using the partner review flow.

### What lives in code

Reference/product data currently lives in TypeScript files, not in Postgres:

```txt
src/lib/data/countries.ts
src/lib/data/cities.ts
src/lib/data/legal-paths.ts
src/lib/data/document-types.ts
src/lib/data/city-reality-reports.ts
src/lib/data/relocation-video-stories.ts
```

This keeps MVP iteration fast: countries, cities and legal paths can be tuned in code without a CMS/admin panel.

---

## Main Table: move_profiles

`move_profiles` is the source of truth for a user's relocation state.

It stores:

```txt
user_id
anonymous_id

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

moving_with
work_status_detail
study_status_detail
has_job_offer
has_school_admission
employer_or_school_name

expected_monthly_budget_range
emergency_fund_range
budget_notes

dependents_count
family_notes

created_at
updated_at
```

Relationship:

```txt
move_profiles.user_id → auth.users.id
```

RLS policy:

```txt
authenticated users can read/update only their own profile
```

---

## Analytics

Behavioral analytics is stored in:

```txt
app_events
```

Shape:

```txt
id
user_id
move_profile_id
event_name
event_payload JSONB
created_at
```

Example event:

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

Current event examples:

```txt
onboarding_started
onboarding_completed
country_selected
city_selected
legal_path_selected
city_reality_viewed
video_story_clicked
move_brief_viewed
partner_review_requested
city_card_view
```

Feedback is stored in:

```txt
user_feedback
```

It captures usefulness, willingness to request real help, comments and source surface.

---

## Roadmap Logic

Roadmap is generated from `move_profiles` in code:

```txt
src/lib/roadmap/roadmapGenerator.ts
```

There are no separate `roadmap`, `journey_stages` or `tasks` tables in the active MVP path yet. That is intentional. The roadmap is still product-learning territory, so the data model stays lightweight.

The generator decides:

- completed levels;
- active level;
- locked levels;
- current task;
- readiness percentage;
- when `Prepare documents` becomes the next stage.

Interactive build-profile nodes:

```txt
Confirm personal details
Add timeline
Add work/study details
Add budget reality
Add family/partner info
```

Each node writes back into `move_profiles`.

---

## City Recommendation Model

City recommendations have two layers:

1. TypeScript heuristic matcher in `src/lib/scoring/city-matcher.ts`
2. Optional local Python model served from `ml/city_model_server.py`

The Next API calls the model service if it is available:

```txt
CITY_MODEL_URL=http://127.0.0.1:8000
CITY_MODEL_ENABLED=true
```

If the model service is down, the app falls back to the TypeScript matcher.

Run the model server:

```bash
npm run city-model
```

Health endpoint:

```txt
http://127.0.0.1:8000/health
```

Prediction endpoint:

```txt
POST http://127.0.0.1:8000/predict
```

---

## Supabase Setup

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=

SUPABASE_SERVICE_ROLE_KEY=

CITY_MODEL_URL=http://127.0.0.1:8000
CITY_MODEL_ENABLED=true
CITY_MODEL_TIMEOUT_MS=3500
```

Required for the browser:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Required for production email confirmation redirects:

```env
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

Required only for internal aggregate metrics:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

Never put the service role key into a `NEXT_PUBLIC_` variable.

### Auth

In Supabase:

```txt
Authentication → Sign In / Providers → Email
```

Enable email/password auth.

For local MVP testing, email confirmation can be disabled.

### Tables

Apply migrations from:

```txt
supabase/migrations
```

At minimum, the current active schema needs:

```txt
20260519085041_create_move_profiles.sql
20260519120000_auth_user_id.sql
20260519133000_move_profile_roadmap_fields.sql
20260519143000_build_profile_step_fields.sql
20260520190000_analytics_feedback.sql
```

If your Supabase shows only `move_profiles`, you probably ran only the base schema or the first migration. Run the analytics migration to create `app_events` and `user_feedback`.

---

## Local Development

Install dependencies:

```bash
npm install
```

Run Next:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Run the city model in another terminal:

```bash
npm run city-model
```

Run lint:

```bash
npm run lint
```

Run production build:

```bash
npm run build
```

Test on a phone in the same Wi-Fi network:

```bash
npm run dev -- --host 0.0.0.0
```

Find local IP:

```bash
ipconfig getifaddr en0
```

Open:

```txt
http://YOUR_LOCAL_IP:3000
```

---

## MVP Screens Worth Testing

For product QA, test these flows:

```txt
/start
```

- sign in;
- complete onboarding;
- select country;
- select city;
- select legal path;
- land on roadmap.

```txt
/app/roadmap
```

- complete personal details;
- complete timeline;
- complete work/study;
- complete budget;
- complete family/partner info.

```txt
/app/move-brief
```

- verify summary content;
- submit feedback;
- click partner review CTA.

```txt
/app/partner-review
```

- submit request;
- verify `partner_review_requested` event.

```txt
/compare?type=city
```

- view city cards;
- verify `city_card_view` events.

---

## What Is Intentionally Not Done Yet

### Verified document checklists

Not shipped as product truth yet. The app can prepare the surface and partner-review handoff, but should not claim exact document requirements without verification.

### File vault uploads

The `/app/vault` surface exists conceptually, but file upload/storage is not the active MVP layer yet.

Likely future storage:

```txt
Supabase Storage bucket: documents
```

Potential files:

```txt
passport scans
bank statements
certificates
translations
insurance files
application forms
```

### Full journey/task tables

`schema_auth_later.sql` contains an older/future draft for:

```txt
user_profiles
user_journeys
journey_stages
tasks
user_documents
```

Those are not the current active product model. Do not assume those tables exist unless you deliberately apply that schema.

### Legal risk engine

Risk language must be designed carefully. Anything that smells like legal certainty needs human review, source dates and conservative copy.

---

## Design Direction

Soft Landing should feel:

```txt
calm
premium
practical
adult
trustworthy
clear
```

It should not feel like:

```txt
government portal
visa agency sales funnel
travel blog
Notion template
enterprise dashboard
childish gamified app
```

Good product words:

```txt
Move preparation
Current level
Next task
Completed
Active
Queued
Locked
Main blocker
Lifestyle fit
Legal fit
Fit assessment
Reality layer
Move Brief
Partner review
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

