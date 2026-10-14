CREATE TABLE "playtest_reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"table_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"seats" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"reservation_code" text NOT NULL,
	"marketing_opt_in" boolean DEFAULT false NOT NULL,
	"source" text DEFAULT '/utah-playtest' NOT NULL,
	"reminder_24h_sent_at" timestamp with time zone,
	"reminder_2h_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "playtest_reservations_reservation_code_unique" UNIQUE("reservation_code"),
	CONSTRAINT "playtest_reservations_seats" CHECK ("playtest_reservations"."seats" between 1 and 4),
	CONSTRAINT "playtest_reservations_status" CHECK ("playtest_reservations"."status" in ('confirmed', 'cancelled'))
);
--> statement-breakpoint
CREATE TABLE "playtest_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"timezone" text DEFAULT 'America/Denver' NOT NULL,
	"venue_name" text NOT NULL,
	"address_line" text NOT NULL,
	"city" text NOT NULL,
	"region" text DEFAULT 'UT' NOT NULL,
	"notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "playtest_sessions_time_order" CHECK ("playtest_sessions"."ends_at" > "playtest_sessions"."starts_at")
);
--> statement-breakpoint
CREATE TABLE "playtest_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"label" text NOT NULL,
	"capacity" integer DEFAULT 6 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "playtest_tables_session_label" UNIQUE("session_id","label"),
	CONSTRAINT "playtest_tables_capacity" CHECK ("playtest_tables"."capacity" between 1 and 12)
);
--> statement-breakpoint
ALTER TABLE "playtest_reservations" ADD CONSTRAINT "playtest_reservations_session_id_playtest_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."playtest_sessions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playtest_reservations" ADD CONSTRAINT "playtest_reservations_table_id_playtest_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."playtest_tables"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playtest_tables" ADD CONSTRAINT "playtest_tables_session_id_playtest_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."playtest_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "playtest_reservations_one_per_session_email" ON "playtest_reservations" USING btree ("session_id",lower("email")) WHERE "playtest_reservations"."status" = 'confirmed';--> statement-breakpoint
CREATE INDEX "playtest_reservations_table_status" ON "playtest_reservations" USING btree ("table_id","status");
--> statement-breakpoint
CREATE VIEW public.playtest_table_availability AS
SELECT
  t.id,
  t.session_id,
  t.label,
  t.capacity,
  t.sort_order,
  t.is_active,
  COALESCE(SUM(r.seats) FILTER (WHERE r.status = 'confirmed'), 0)::integer AS seats_reserved,
  GREATEST(
    t.capacity - COALESCE(SUM(r.seats) FILTER (WHERE r.status = 'confirmed'), 0)::integer,
    0
  ) AS seats_remaining
FROM public.playtest_tables t
LEFT JOIN public.playtest_reservations r ON r.table_id = t.id
GROUP BY t.id;
--> statement-breakpoint
CREATE VIEW public.playtest_reminder_queue AS
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
  s.region
FROM public.playtest_reservations r
JOIN public.playtest_tables t ON t.id = r.table_id
JOIN public.playtest_sessions s ON s.id = r.session_id
WHERE r.status = 'confirmed' AND s.is_active = true;
--> statement-breakpoint
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
  table_label text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    v_table.label;
END;
$$;
--> statement-breakpoint
ALTER TABLE public.playtest_sessions ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.playtest_tables ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.playtest_reservations ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
REVOKE ALL ON public.playtest_sessions FROM anon, authenticated;
--> statement-breakpoint
REVOKE ALL ON public.playtest_tables FROM anon, authenticated;
--> statement-breakpoint
REVOKE ALL ON public.playtest_reservations FROM anon, authenticated;
--> statement-breakpoint
REVOKE ALL ON public.playtest_table_availability FROM anon, authenticated;
--> statement-breakpoint
REVOKE ALL ON public.playtest_reminder_queue FROM anon, authenticated;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.reserve_playtest_seats(uuid, text, text, integer, boolean, text) FROM PUBLIC, anon, authenticated;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON public.playtest_sessions TO service_role;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON public.playtest_tables TO service_role;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON public.playtest_reservations TO service_role;
--> statement-breakpoint
GRANT SELECT ON public.playtest_table_availability TO service_role;
--> statement-breakpoint
GRANT SELECT ON public.playtest_reminder_queue TO service_role;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.reserve_playtest_seats(uuid, text, text, integer, boolean, text) TO service_role;
