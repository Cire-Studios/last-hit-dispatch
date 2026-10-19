# Vercel and Supabase deployment

The website runs as a TanStack Start application on Vercel. Playtest sessions, tables, reservations, and reminder state are stored in Supabase Postgres. The current reservation feature does not require a Supabase Storage bucket because it stores structured records rather than uploaded files.

## 1. Prepare Supabase

Create or choose the Supabase project that will own production data, then link it from the repository root:

```sh
supabase login
supabase link --project-ref <project-ref>
supabase db push
supabase gen types typescript --linked > src/integrations/supabase/types.ts
```

The migration creates the three playtest tables, two server-only views, and the atomic seat-reservation function. Row-level security is enabled, and access is limited to the server's Supabase secret key.

## 2. Configure Vercel

Import the Git repository into Vercel and confirm the detected framework is **TanStack Start**. Vercel should use these defaults:

- Install command: `bun install --frozen-lockfile`
- Build command: `bun run build`
- Output: detected automatically from Nitro

Add these values under **Project → Settings → Environment Variables** for Production and any Preview environments that should use a database:

| Variable                       | Purpose                                                               |
| ------------------------------ | --------------------------------------------------------------------- |
| `SUPABASE_URL`                 | Supabase project API URL                                              |
| `SUPABASE_SECRET_KEY`          | Server-only Supabase secret key; never prefix with `VITE_`            |
| `TURNSTILE_SECRET_KEY`         | Validates reservation and feedback submissions                        |
| `DISCORD_FEEDBACK_WEBHOOK_URL` | Delivers feedback to the private Discord channel                      |
| `MAILERLITE_API_KEY`           | Adds newsletter and playtest subscribers                              |
| `MAILERLITE_GROUP_UPDATES`     | MailerLite launch-updates group                                       |
| `MAILERLITE_GROUP_PLAYTEST`    | MailerLite playtest group                                             |
| `RESEND_API_KEY`               | Sends reservation confirmations and reminders                         |
| `PLAYTEST_EMAIL_FROM`          | Verified sender, such as `Last Hit Playtests <playtests@your-domain>` |
| `PLAYTEST_REPLY_TO`            | Optional reply address for cancellations and questions                |
| `CRON_SECRET`                  | Random value of at least 16 characters for Vercel Cron authentication |

Keep `PLAYTEST_DEMO_MODE` unset or set to `false` in production.

## 3. Scheduled reminders

`vercel.json` invokes `/api/cron/playtest-reminders` every 30 minutes. Vercel adds `Authorization: Bearer <CRON_SECRET>` automatically, and the route accepts the GET method used by Vercel Cron.

The 30-minute schedule requires Vercel Pro. Vercel Hobby allows only one cron execution per day and will reject this schedule during deployment. If production will use Hobby, move the same authenticated HTTP schedule to Supabase Cron or another scheduler before deploying.

## 4. Production checks

After deployment:

1. Open `/utah-playtest` and confirm it shows either upcoming sessions or the empty-schedule message.
2. Create a test session and table in Supabase, then reserve one seat through the public page.
3. Confirm the reservation appears in `playtest_reservations` and the confirmation email arrives.
4. Open **Vercel → Settings → Cron Jobs** and confirm `playtest-reminders` is active.
5. Review the first cron function log and verify it returns a successful JSON response.
6. Add the production hostname to the Cloudflare Turnstile widget's allowed hostnames before accepting traffic.
