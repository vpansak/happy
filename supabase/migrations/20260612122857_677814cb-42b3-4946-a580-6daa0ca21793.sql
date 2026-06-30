
CREATE TABLE public.gift_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.gift_redemptions TO anon, authenticated;
GRANT ALL ON public.gift_redemptions TO service_role;

ALTER TABLE public.gift_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a gift redemption"
  ON public.gift_redemptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND length(mobile) BETWEEN 5 AND 25
    AND length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );
