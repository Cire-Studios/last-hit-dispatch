import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  AdminAuthError,
  assertSameOrigin,
  readAdminSession,
} from "@/lib/playtest-admin-auth.server";
import {
  PlaytestAdminInputError,
  cancelAdminReservation,
  createAdminPlaytestSession,
  createAdminPlaytestTable,
  listAdminPlaytests,
  updateAdminPlaytestSession,
  updateAdminPlaytestTable,
} from "@/lib/playtest-admin-storage.server";

const id = z.string().uuid();
const session = z.object({
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
  timezone: z.string().trim().min(1).max(80),
  venueName: z.string().trim().min(2).max(160),
  addressLine: z.string().trim().min(3).max(200),
  city: z.string().trim().min(2).max(100),
  region: z.string().trim().min(2).max(30),
  notes: z.string().trim().max(600),
  isActive: z.boolean(),
});
const table = z.object({
  label: z.string().trim().min(1).max(120),
  capacity: z.number().int().min(1).max(12),
  sortOrder: z.number().int().min(-100).max(100),
  isActive: z.boolean(),
});

const mutationSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("create_session"), session }),
  z.object({ action: z.literal("update_session"), id, session }),
  z.object({ action: z.literal("create_table"), sessionId: id, table }),
  z.object({ action: z.literal("update_table"), id, table }),
  z.object({ action: z.literal("cancel_reservation"), id }),
]);

export const Route = createFileRoute("/api/admin/playtests")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!(await readAdminSession(request))) {
          return json(401, { error: "Sign in to manage playtests.", code: "unauthorized" });
        }
        try {
          return json(200, await listAdminPlaytests());
        } catch (error) {
          console.error("Loading playtest admin dashboard failed", error);
          return json(502, { error: "The playtest schedule could not be loaded.", code: "failed" });
        }
      },
      POST: async ({ request }) => {
        try {
          assertSameOrigin(request);
          if (!(await readAdminSession(request))) {
            return json(401, {
              error: "Your session has expired. Sign in again.",
              code: "unauthorized",
            });
          }

          const payload = mutationSchema.safeParse(await request.json());
          if (!payload.success) {
            return json(400, { error: "Check the details and try again.", code: "invalid_input" });
          }

          switch (payload.data.action) {
            case "create_session":
              await createAdminPlaytestSession(payload.data.session);
              break;
            case "update_session":
              await updateAdminPlaytestSession(payload.data.id, payload.data.session);
              break;
            case "create_table":
              await createAdminPlaytestTable(payload.data.sessionId, payload.data.table);
              break;
            case "update_table":
              await updateAdminPlaytestTable(payload.data.id, payload.data.table);
              break;
            case "cancel_reservation":
              await cancelAdminReservation(payload.data.id);
              break;
          }

          return json(200, { ok: true, ...(await listAdminPlaytests()) });
        } catch (error) {
          if (error instanceof AdminAuthError) {
            return json(error.status, { error: error.message, code: "unauthorized" });
          }
          if (error instanceof SyntaxError) {
            return json(400, { error: "Check the details and try again.", code: "invalid_input" });
          }
          if (error instanceof PlaytestAdminInputError) {
            return json(409, { error: error.message, code: "conflict" });
          }
          console.error("Updating playtest admin dashboard failed", error);
          return json(502, {
            error: friendlyDatabaseError(error),
            code: "failed",
          });
        }
      },
    },
  },
});

function friendlyDatabaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("playtest_tables_session_label")) {
    return "That table name is already used for this date.";
  }
  return "The change could not be saved. Try again in a moment.";
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
