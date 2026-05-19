-- move_profiles: anonymous, unauthenticated move profiles
-- user_id is nullable — will be populated when auth is added later

CREATE TABLE IF NOT EXISTS move_profiles (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID,                                      -- future auth.users FK
  anonymous_id          TEXT        UNIQUE NOT NULL,

  -- Onboarding step 1: background
  citizenship           TEXT,
  current_country       TEXT,
  residence_country     TEXT,
  preferred_language    TEXT        NOT NULL DEFAULT 'en',

  -- Onboarding step 2: goal
  move_goal             TEXT,

  -- Onboarding step 3: money
  monthly_income_range  TEXT,
  savings_range         TEXT,
  income_type           TEXT,

  -- Onboarding step 4: life preferences (array of LifePreference enum values)
  life_preferences      TEXT[]      NOT NULL DEFAULT '{}',

  -- Onboarding step 5: main concern (stored as array for future multi-concern support)
  worries               TEXT[]      NOT NULL DEFAULT '{}',

  -- Onboarding step 6: open regions
  open_regions          TEXT[]      NOT NULL DEFAULT '{}',

  -- Onboarding step 7: optimization goal
  optimization_goal     TEXT,

  -- Shortlists
  saved_country_ids     TEXT[]      NOT NULL DEFAULT '{}',
  saved_city_ids        TEXT[]      NOT NULL DEFAULT '{}',

  -- Final selections
  selected_country_id   TEXT,
  selected_city_id      TEXT,
  selected_legal_path_id TEXT,
  personal_details_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  timeline_confirmed    BOOLEAN     NOT NULL DEFAULT FALSE,
  work_study_confirmed  BOOLEAN     NOT NULL DEFAULT FALSE,
  budget_confirmed      BOOLEAN     NOT NULL DEFAULT FALSE,
  family_confirmed      BOOLEAN     NOT NULL DEFAULT FALSE,
  target_move_month     TEXT,
  urgency_level         TEXT,
  must_arrive_before    TEXT,
  flexible_dates        BOOLEAN,
  moving_with           TEXT,
  work_status_detail    TEXT,
  study_status_detail   TEXT,
  has_job_offer         BOOLEAN,
  has_school_admission  BOOLEAN,
  employer_or_school_name TEXT,
  expected_monthly_budget_range TEXT,
  emergency_fund_range  TEXT,
  budget_notes          TEXT,
  dependents_count      INTEGER,
  family_notes          TEXT,

  -- Journey progress
  active_step           TEXT        NOT NULL DEFAULT 'welcome',
  onboarding_completed  BOOLEAN     NOT NULL DEFAULT FALSE,

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on every change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER move_profiles_updated_at
  BEFORE UPDATE ON move_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE move_profiles ENABLE ROW LEVEL SECURITY;

-- Allow the anon role to read and write rows.
-- When auth is added, tighten this so users can only access their own profile.
CREATE POLICY "anon_all" ON move_profiles
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
