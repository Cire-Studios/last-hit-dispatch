import { createFileRoute } from "@tanstack/react-router";

import { authenticateCronRequest } from "@/lib/cron-auth.server";
import { sendPlaytestReminder } from "@/lib/playtest-email.server";
import {
  listPendingReminders,
  markReminderSent,
  playtestDatabaseIsConfigured,
} from "@/lib/playtest-storage.server";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export const Route = createFileRoute("/api/cron/playtest-reminders")({
  server: {
    handlers: {
      GET: ({ request }) => runReminders(request),
      POST: ({ request }) => runReminders(request),
    },
  },
});

async function runReminders(request: Request) {
  const authenticationError = await authenticateCronRequest(request);
  if (authenticationError) return authenticationError;

  if (
    !playtestDatabaseIsConfigured() ||
    !process.env.RESEND_API_KEY ||
    !process.env.PLAYTEST_EMAIL_FROM
  ) {
    return json(503, { error: "Reminder service is not configured" });
  }

  try {
    const rows = await listPendingReminders();
    const now = Date.now();
    let sent = 0;
    const errors: string[] = [];

    for (const row of rows) {
      const hoursUntilStart = (new Date(row.starts_at).getTime() - now) / 3_600_000;
      const kind =
        hoursUntilStart >= 23 && hoursUntilStart <= 25 && !row.reminder_24h_sent_at
          ? "24h"
          : hoursUntilStart >= 1 && hoursUntilStart <= 3 && !row.reminder_2h_sent_at
            ? "2h"
            : null;
      if (!kind) continue;

      try {
        await sendPlaytestReminder(row, kind);
        await markReminderSent(row.reservation_id, kind);
        sent += 1;
      } catch (error) {
        console.error("Playtest reminder failed", error);
        errors.push(row.reservation_id);
      }
    }

    return json(errors.length > 0 ? 207 : 200, {
      ok: errors.length === 0,
      sent,
      failed: errors.length,
    });
  } catch (error) {
    console.error("Playtest reminder run failed", error);
    return json(502, { error: "Reminder run failed" });
  }
}
