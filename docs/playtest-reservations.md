# Playtest reservations

The public page lives at `/utah-playtest`. Sessions, tables, reservations, and reminder delivery state live in Supabase Postgres. The schema migration is recorded in `supabase/migrations/20261019203643_create_playtest_reservations.sql`, and generated database types live in `src/integrations/supabase/types.ts`.

Link the repository to the intended Supabase project with `supabase link --project-ref <project-ref>`, then apply the migration with `supabase db push`. Confirm that `playtest_sessions`, `playtest_tables`, and `playtest_reservations` appear in the Supabase Table Editor before opening reservations.

## Add a playtest day

Create the day first, then add zero or more tables. A day with no tables appears as a date with “Tables coming soon.” Set `is_active` to `false` to hide a day or an individual table.

```sql
with new_session as (
  insert into public.playtest_sessions (
    starts_at,
    ends_at,
    venue_name,
    address_line,
    city,
    region,
    notes
  ) values (
    '2026-11-07 13:00:00-07',
    '2026-11-07 15:00:00-07',
    'Venue name',
    '123 Main Street',
    'Lehi',
    'UT',
    'Please arrive 10 minutes early.'
  )
  returning id
)
insert into public.playtest_tables (session_id, label, capacity, sort_order)
select id, label, capacity, sort_order
from new_session
cross join (values
  ('Table A · The Ember Drake', 6, 1),
  ('Table B · The Moss Troll', 6, 2)
) as tables(label, capacity, sort_order);
```

To create a date with no tables, run only the `playtest_sessions` insert. To cancel a reservation and return its seats to inventory:

```sql
update public.playtest_reservations
set status = 'cancelled', updated_at = now()
where reservation_code = 'LH-EXAMPLE';
```

## Environment

- `SUPABASE_URL` and the server-only `SUPABASE_SECRET_KEY` connect the Vercel functions to Supabase. Never expose the secret key through a `VITE_` variable.
- `TURNSTILE_SECRET_KEY` blocks automated submissions. The public site key is already configured with the other public settings.
- `RESEND_API_KEY`, `PLAYTEST_EMAIL_FROM`, and optional `PLAYTEST_REPLY_TO` send confirmations and reminders.
- Vercel sends `CRON_SECRET` as bearer authentication when it invokes the reminder endpoint.
- `PLAYTEST_DEMO_MODE=true` shows interactive sample dates without writing data. Keep it disabled in production.
- Existing MailerLite settings add guests to the playtesting list only when they opt in.

`vercel.json` schedules a `GET` request to `/api/cron/playtest-reminders` every 30 minutes. The endpoint authenticates with `CRON_SECRET` and sends reminders about 24 hours and 2 hours before each reservation. This schedule requires Vercel Pro; Hobby permits only one cron execution per day. Review runs under **Project → Settings → Cron Jobs**.
