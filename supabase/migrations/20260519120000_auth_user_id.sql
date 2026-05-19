-- Switch move_profiles from anonymous_id identity to user_id identity.
-- Requires Supabase auth to be configured.

-- Make anonymous_id nullable — no longer the primary identity
ALTER TABLE move_profiles ALTER COLUMN anonymous_id DROP NOT NULL;

-- Add unique constraint on user_id to support upsert by user_id
ALTER TABLE move_profiles ADD CONSTRAINT move_profiles_user_id_key UNIQUE (user_id);

-- Drop old open anon policy
DROP POLICY IF EXISTS "anon_all" ON move_profiles;

-- Authenticated users can only access their own row
CREATE POLICY "authenticated_own_profile" ON move_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
