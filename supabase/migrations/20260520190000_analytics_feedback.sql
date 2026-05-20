CREATE TABLE IF NOT EXISTS app_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  move_profile_id UUID REFERENCES move_profiles(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  move_profile_id UUID REFERENCES move_profiles(id) ON DELETE SET NULL,
  source TEXT NOT NULL,
  usefulness TEXT NOT NULL,
  would_request_real_help TEXT NULL,
  comment TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS app_events_event_name_idx ON app_events(event_name);
CREATE INDEX IF NOT EXISTS app_events_created_at_idx ON app_events(created_at DESC);
CREATE INDEX IF NOT EXISTS app_events_user_id_idx ON app_events(user_id);
CREATE INDEX IF NOT EXISTS user_feedback_source_idx ON user_feedback(source);
CREATE INDEX IF NOT EXISTS user_feedback_created_at_idx ON user_feedback(created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS user_feedback_unique_user_profile_source_idx
  ON user_feedback(user_id, move_profile_id, source)
  WHERE user_id IS NOT NULL AND move_profile_id IS NOT NULL;

ALTER TABLE app_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_insert_own_app_events" ON app_events;
CREATE POLICY "authenticated_insert_own_app_events"
  ON app_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (
      move_profile_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM move_profiles
        WHERE move_profiles.id = app_events.move_profile_id
          AND move_profiles.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "authenticated_insert_own_user_feedback" ON user_feedback;
CREATE POLICY "authenticated_insert_own_user_feedback"
  ON user_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (
      move_profile_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM move_profiles
        WHERE move_profiles.id = user_feedback.move_profile_id
          AND move_profiles.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "authenticated_select_own_user_feedback" ON user_feedback;
CREATE POLICY "authenticated_select_own_user_feedback"
  ON user_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
