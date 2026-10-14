# Playtest reservations

The public page lives at `/utah-playtest`. Sessions, tables, reservations, and reminder delivery state live in the Lovable Cloud database. The schema migration is recorded in `drizzle/migrations/0000_playtest_reservations.sql`, and Lovable keeps the generated database types in `src/integrations/supabase/types.ts`.

After the branch syncs to Lovable, ask the project agent to apply the playtest reservation migration. Confirm that `playtest_sessions`, `playtest_tables`, and `playtest_reservations` appear under **More → Cloud → Database** before opening reservations.

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

- Lovable Cloud provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the deployed app. Add them locally only when testing against live Cloud data.
- `TURNSTILE_SECRET_KEY` blocks automated submissions. The public site key is already configured with the other public settings.
- `RESEND_API_KEY`, `PLAYTEST_EMAIL_FROM`, and optional `PLAYTEST_REPLY_TO` send confirmations and reminders.
- Lovable Cloud provides and rotates `LOVABLE_CRON_SECRET` for the reminder Job.
- `PLAYTEST_DEMO_MODE=true` shows interactive sample dates without writing data. Keep it disabled in production.
- Existing MailerLite settings add guests to the playtesting list only when they opt in.

Create a Lovable Cloud Job that sends a `POST` request to `/api/public/cron/playtest-reminders` every 30 minutes. The endpoint authenticates with Lovable's managed cron secret and sends reminders about 24 hours and 2 hours before each reservation. Review runs under **More → Cloud → Jobs**.
