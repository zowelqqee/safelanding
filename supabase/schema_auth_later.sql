-- Soft Landing — database schema-- Run this in the Supabase SQL editor

-- Enable UUID extensioncreate extension if not exists "uuid-ossp";

-- ─── User profiles ────────────────────────────────────────────────────────────

create table if not exists user_profiles (id uuid primary key default uuid_generate_v4(),user_id uuid references auth.users(id) on delete cascade not null unique,citizenship text,current_country text,residence_country text,language text not null default 'en' check (language in ('ru', 'en')),move_goal text check (move_goal in ('remote_work','study','explore_first','find_job','family','not_sure')),monthly_income text check (monthly_income in ('under_1000','1000_2000','2000_3000','3000_5000','5000_plus')),savings_range text check (savings_range in ('under_3000','3000_7000','7000_15000','15000_30000','30000_plus')),income_type text check (income_type in ('remote_employment','freelance','business_owner','savings_only','student_family','no_stable_income')),life_preferences text[] default '{}',main_fear text check (main_fear in ('documents','money','housing','language','finding_work','being_alone','choosing_wrong_place','legal_status')),created_at timestamptz not null default now(),updated_at timestamptz not null default now());

-- ─── User journeys ────────────────────────────────────────────────────────────

create table if not exists user_journeys (id uuid primary key default uuid_generate_v4(),user_id uuid references auth.users(id) on delete cascade not null,country text not null default 'spain',city_id text not null,legal_path_id text not null,status text not null default 'active' check (status in ('active','paused','completed')),overall_progress integer not null default 0 check (overall_progress between 0 and 100),readiness_score integer not null default 0 check (readiness_score between 0 and 100),current_stage_id text,created_at timestamptz not null default now(),updated_at timestamptz not null default now());

-- ─── Journey stages ───────────────────────────────────────────────────────────

create table if not exists journey_stages (id uuid primary key default uuid_generate_v4(),journey_id uuid references user_journeys(id) on delete cascade not null,template_stage_id text not null,title text not null,description text,status text not null default 'locked' check (status in ('locked','active','completed')),progress integer not null default 0 check (progress between 0 and 100),sort_order integer not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now());

-- ─── Tasks ────────────────────────────────────────────────────────────────────

create table if not exists tasks (id uuid primary key default uuid_generate_v4(),user_id uuid references auth.users(id) on delete cascade not null,journey_id uuid references user_journeys(id) on delete cascade not null,stage_id uuid references journey_stages(id) on delete cascade not null,title text not null,description text,type text not null check (type in ('document','form','service','research','appointment','review')),status text not null default 'todo' check (status in ('todo','in_progress','done','blocked')),priority text not null default 'medium' check (priority in ('low','medium','high')),due_date date,related_document_type_id text,service_category text,created_at timestamptz not null default now(),updated_at timestamptz not null default now());

-- ─── User documents ───────────────────────────────────────────────────────────

create table if not exists user_documents (id uuid primary key default uuid_generate_v4(),user_id uuid references auth.users(id) on delete cascade not null,document_type_id text not null,journey_id uuid references user_journeys(id) on delete set null,file_url text,file_name text,status text not null default 'missing' check (status in ('missing','uploaded','needs_translation','needs_apostille','expiring_soon','expired','risky','looks_good')),issued_at date,expires_at date,notes text,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(user_id, document_type_id, journey_id));

-- ─── Row-level security ───────────────────────────────────────────────────────

alter table user_profiles enable row level security;alter table user_journeys enable row level security;alter table journey_stages enable row level security;alter table tasks enable row level security;alter table user_documents enable row level security;

-- user_profiles policiescreate policy "Users can view own profile"on user_profiles for select using (auth.uid() = user_id);create policy "Users can insert own profile"on user_profiles for insert with check (auth.uid() = user_id);create policy "Users can update own profile"on user_profiles for update using (auth.uid() = user_id);

-- user_journeys policiescreate policy "Users can view own journeys"on user_journeys for select using (auth.uid() = user_id);create policy "Users can insert own journeys"on user_journeys for insert with check (auth.uid() = user_id);create policy "Users can update own journeys"on user_journeys for update using (auth.uid() = user_id);

-- journey_stages policiescreate policy "Users can view own stages"on journey_stages for selectusing (journey_id in (select id from user_journeys where user_id = auth.uid()));create policy "Users can insert own stages"on journey_stages for insertwith check (journey_id in (select id from user_journeys where user_id = auth.uid()));create policy "Users can update own stages"on journey_stages for updateusing (journey_id in (select id from user_journeys where user_id = auth.uid()));

-- tasks policiescreate policy "Users can view own tasks"on tasks for select using (auth.uid() = user_id);create policy "Users can insert own tasks"on tasks for insert with check (auth.uid() = user_id);create policy "Users can update own tasks"on tasks for update using (auth.uid() = user_id);

-- user_documents policiescreate policy "Users can view own documents"on user_documents for select using (auth.uid() = user_id);create policy "Users can insert own documents"on user_documents for insert with check (auth.uid() = user_id);create policy "Users can update own documents"on user_documents for update using (auth.uid() = user_id);

-- ─── Triggers: updated_at ─────────────────────────────────────────────────────

create or replace function update_updated_at()returns trigger language plpgsql as $$beginnew.updated_at = now();return new;end;$$;

create trigger user_profiles_updated_at before update on user_profilesfor each row execute function update_updated_at();create trigger user_journeys_updated_at before update on user_journeysfor each row execute function update_updated_at();create trigger journey_stages_updated_at before update on journey_stagesfor each row execute function update_updated_at();create trigger tasks_updated_at before update on tasksfor each row execute function update_updated_at();create trigger user_documents_updated_at before update on user_documentsfor each row execute function update_updated_at();

-- ─── Storage bucket for documents ────────────────────────────────────────────-- Run manually in Supabase dashboard or via CLI:-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false)