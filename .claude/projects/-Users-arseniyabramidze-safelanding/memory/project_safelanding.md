---
name: project-safelanding
description: Soft Landing product — consumer relocation app + NSV AI Case Manager module
metadata:
  type: project
---

Main product: consumer relocation web app for Spain routes (DNV, Student, Exploration).
Audience: Russian-speaking remote workers.

**NSV AI Case Manager** added 2026-06-09:
Module for Non-Stop Visa agency handling Armenia migration services (social card, IE, bank, TRP, PR, citizenship).

Why: Automate routine client intake so specialists only handle legal/financial decisions.

Key files:
- `src/lib/nsv/` — core module (types, db, workflow, AI, telegram)
- `src/lib/ai/` — LLM system prompt, scripts, prompt builder
- `src/app/api/leads/` — site lead webhook
- `src/app/api/telegram/` — Telegram bot webhook
- `src/app/admin/cases/` — admin dashboard
- `supabase/migrations/20260608000000_nsv_tables.sql` — DB schema

Architecture principle: deterministic handoff rules BEFORE LLM. LLM output validated with Zod before any DB mutation.

**How to apply:** When editing NSV module, preserve the safety boundary: handoff rules check first, LLM returns JSON, server validates and applies. Never let LLM directly mutate DB or bypass handoff triggers.
