ALTER TABLE move_profiles
  ADD COLUMN IF NOT EXISTS personal_details_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS target_move_month TEXT,
  ADD COLUMN IF NOT EXISTS moving_with TEXT,
  ADD COLUMN IF NOT EXISTS work_status_detail TEXT,
  ADD COLUMN IF NOT EXISTS study_status_detail TEXT,
  ADD COLUMN IF NOT EXISTS budget_notes TEXT,
  ADD COLUMN IF NOT EXISTS family_notes TEXT;
