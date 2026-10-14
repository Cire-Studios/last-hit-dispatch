import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  emailDeliveryIsConfigured,
  sendReservationConfirmation,
} from "@/lib/playtest-email.server";
import { createDemoPlaytestSessions } from "@/lib/playtest";
import {
  createPlaytestReservation,
  playtestDatabaseIsConfigured,
} from "@/lib/playtest-storage.server";

const schema = z.object({
  tableId: z.string().trim().min(1).max(80),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  seats: z.number().int().min(1).max(4),
  marketingOptIn: z.boolean().optional().default(false),
  website: z.string().max(200).optional().default(""),
  turnstileToken: z.string().max(2048).optional().default(""),
  source: z.string().trim().min(1).max(120).optional().default("/utah-playtest"),
});

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export const Route = createFileRoute("/api/public/playtest-reservations")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return json(400, { error: "Invalid request", code: "invalid_input" });
        }

        const parsed = schema.safeParse(payload);
        if (!parsed.success) {
          return json(400, { error: "Invalid request", code: "invalid_input" });
        }
        const input = parsed.data;
        if (input.website) return json(200, { ok: true });

        const demoMode = process.env.PLAYTEST_DEMO_MODE === "true";
        if (!demoMode) {
          const verification = await verifyTurnstile(input.turnstileToken, request);
          if (!verification.ok)
            return json(verification.status, {
              error: verification.error,
              code: verification.code,
            });
        }

        if (demoMode) {
          const selectedTable = createDemoPlaytestSessions()
            .flatMap((session) => session.tables.map((table) => ({ session, table })))
            .find(({ table }) => table.id === input.tableId);
          if (!selectedTable || selectedTable.table.seatsRemaining < input.seats) {
            return json(409, { error: "Those seats are no longer available", code: "table_full" });
          }
          return json(200, {
            ok: true,
            reservationCode: "DEMO-HUNT",
            session: {
              startsAt: selectedTable.session.startsAt,
              endsAt: selectedTable.session.endsAt,
              timezone: selectedTable.session.timezone,
              venueName: selectedTable.session.venueName,
              addressLine: selectedTable.session.addressLine,
              city: selectedTable.session.city,
              region: selectedTable.session.region,
              tableLabel: selectedTable.table.label,
            },
          });
        }

        if (!playtestDatabaseIsConfigured()) {
          return json(503, { error: "Reservations are not open yet", code: "not_configured" });
        }

        try {
          const reservation = await createPlaytestReservation(input);

          if (emailDeliveryIsConfigured()) {
            try {
              await sendReservationConfirmation(input.email, input.name, input.seats, reservation);
            } catch (error) {
              console.error("Playtest confirmation email failed", error);
            }
          }

          if (input.marketingOptIn) await addToPlaytestList(input.email, input.source);

          return json(200, {
            ok: true,
            reservationCode: reservation.reservation_code,
            session: {
              startsAt: reservation.starts_at,
              endsAt: reservation.ends_at,
              timezone: reservation.timezone,
              venueName: reservation.venue_name,
              addressLine: reservation.address_line,
              city: reservation.city,
              region: reservation.region,
              tableLabel: reservation.table_label,
            },
          });
        } catch (error) {
          console.error("Playtest reservation failed", error);
          const detail = error instanceof Error ? error.message : "";
          if (detail.includes("duplicate_reservation")) {
            return json(409, {
              error: "That email already has a seat at this table",
              code: "duplicate",
            });
          }
          if (detail.includes("table_full") || detail.includes("insufficient_seats")) {
            return json(409, { error: "Those seats were just taken", code: "table_full" });
          }
          if (detail.includes("session_unavailable")) {
            return json(409, {
              error: "That playtest is no longer available",
              code: "session_unavailable",
            });
          }
          return json(502, { error: "Reservation failed", code: "reservation_failed" });
        }
      },
    },
  },
});

async function verifyTurnstile(token: string, request: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret)
    return {
      ok: false as const,
      status: 503,
      error: "Reservations are not open yet",
      code: "not_configured",
    };
  if (!token)
    return {
      ok: false as const,
      status: 400,
      error: "Complete the verification",
      code: "verification_failed",
    };

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: request.headers.get("CF-Connecting-IP") || undefined,
      }),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success
      ? { ok: true as const }
      : {
          ok: false as const,
          status: 400,
          error: "Verification expired",
          code: "verification_failed",
        };
  } catch (error) {
    console.error("Playtest Turnstile verification failed", error);
    return {
      ok: false as const,
      status: 502,
      error: "Verification unavailable",
      code: "verification_unavailable",
    };
  }
}

async function addToPlaytestList(email: string, source: string) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) return;
  try {
    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        fields: { interests: "playtest", signup_source: source },
        groups: process.env.MAILERLITE_GROUP_PLAYTEST
          ? [process.env.MAILERLITE_GROUP_PLAYTEST]
          : undefined,
        status: "active",
      }),
    });
    if (!response.ok) console.error(`MailerLite playtest signup returned ${response.status}`);
  } catch (error) {
    console.error("MailerLite playtest signup failed", error);
  }
}
