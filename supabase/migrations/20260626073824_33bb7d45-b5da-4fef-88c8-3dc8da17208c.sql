
CREATE TABLE public.family_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_uid uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  family_key text NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (auth_uid)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_members TO authenticated;
GRANT ALL ON public.family_members TO service_role;

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own row only" ON public.family_members
  FOR ALL
  USING (auth_uid = auth.uid())
  WITH CHECK (auth_uid = auth.uid());

DROP POLICY IF EXISTS "open access" ON public.activity_logs;

REVOKE ALL ON public.activity_logs FROM anon;
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;

CREATE POLICY "select own family" ON public.activity_logs
  FOR SELECT
  TO authenticated
  USING (
    family_key = (
      SELECT family_key FROM public.family_members
      WHERE auth_uid = auth.uid()
    )
  );

CREATE POLICY "insert own family" ON public.activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    family_key = (
      SELECT family_key FROM public.family_members
      WHERE auth_uid = auth.uid()
    )
  );
