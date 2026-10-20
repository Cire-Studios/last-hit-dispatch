ALTER TABLE public.playtest_sessions
  ADD COLUMN postal_code text DEFAULT '' NOT NULL;

ALTER TABLE public.playtest_sessions
  ADD CONSTRAINT playtest_sessions_postal_code
  CHECK (postal_code = '' OR postal_code ~ '^[0-9]{5}(-[0-9]{4})?$');

CREATE OR REPLACE VIEW public.playtest_reminder_queue WITH (security_invoker = true) AS
SELECT
  r.id AS reservation_id,
  r.name,
  r.email,
  r.seats,
  r.reservation_code,
  r.reminder_24h_sent_at,
  r.reminder_2h_sent_at,
  t.label AS table_label,
  s.starts_at,
  s.ends_at,
  s.timezone,
  s.venue_name,
  s.address_line,
  s.city,
  s.region,
  s.postal_code
FROM public.playtest_reservations r
JOIN public.playtest_tables t ON t.id = r.table_id
JOIN public.playtest_sessions s ON s.id = r.session_id
WHERE r.status = 'confirmed' AND s.is_active = true;

DROP FUNCTION public.reserve_playtest_seats(uuid, text, text, integer, boolean, text);

CREATE FUNCTION public.reserve_playtest_seats(
  p_table_id uuid,
  p_name text,
  p_email text,
  p_seats integer,
  p_marketing_opt_in boolean DEFAULT false,
  p_source text DEFAULT '/utah-playtest'
)
RETURNS TABLE (
  reservation_id uuid,
  reservation_code text,
  starts_at timestamptz,
  ends_at timestamptz,
  timezone text,
  venue_name text,
  address_line text,
  city text,
  region text,
  postal_code text,
  table_label text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_table public.playtest_tables%ROWTYPE;
  v_session public.playtest_sessions%ROWTYPE;
  v_reserved integer;
  v_code text;
  v_reservation_id uuid;
BEGIN
  IF p_seats < 1 OR p_seats > 4 THEN
    RAISE EXCEPTION 'invalid_seat_count';
  END IF;

  SELECT * INTO v_table
  FROM public.playtest_tables
  WHERE id = p_table_id
  FOR UPDATE;

  IF NOT FOUND OR NOT v_table.is_active THEN
    RAISE EXCEPTION 'session_unavailable';
  END IF;

  SELECT * INTO v_session
  FROM public.playtest_sessions
  WHERE id = v_table.session_id;

  IF NOT FOUND OR NOT v_session.is_active OR v_session.starts_at <= now() THEN
    RAISE EXCEPTION 'session_unavailable';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.playtest_reservations
    WHERE session_id = v_session.id
      AND lower(email) = lower(trim(p_email))
      AND status = 'confirmed'
  ) THEN
    RAISE EXCEPTION 'duplicate_reservation';
  END IF;

  SELECT COALESCE(SUM(seats), 0)::integer INTO v_reserved
  FROM public.playtest_reservations
  WHERE table_id = p_table_id AND status = 'confirmed';

  IF v_reserved >= v_table.capacity THEN
    RAISE EXCEPTION 'table_full';
  END IF;

  IF v_reserved + p_seats > v_table.capacity THEN
    RAISE EXCEPTION 'insufficient_seats';
  END IF;

  v_code := 'LH-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  INSERT INTO public.playtest_reservations (
    session_id,
    table_id,
    name,
    email,
    seats,
    reservation_code,
    marketing_opt_in,
    source
  ) VALUES (
    v_session.id,
    p_table_id,
    trim(p_name),
    lower(trim(p_email)),
    p_seats,
    v_code,
    p_marketing_opt_in,
    p_source
  ) RETURNING id INTO v_reservation_id;

  RETURN QUERY SELECT
    v_reservation_id,
    v_code,
    v_session.starts_at,
    v_session.ends_at,
    v_session.timezone,
    v_session.venue_name,
    v_session.address_line,
    v_session.city,
    v_session.region,
    v_session.postal_code,
    v_table.label;
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_playtest_seats(uuid, text, text, integer, boolean, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_playtest_seats(uuid, text, text, integer, boolean, text)
  TO service_role;

COMMENT ON COLUMN public.playtest_sessions.postal_code IS
  'US ZIP code for the physical playtest venue. Empty only for sessions created before this field existed.';
