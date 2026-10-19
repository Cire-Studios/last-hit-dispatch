import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  AdminAuthError,
  adminAuthIsConfigured,
  assertSameOrigin,
  clearAdminCookies,
  createAdminLoginChallenge,
  readAdminSession,
  verifyAdminLoginCode,
} from "@/lib/playtest-admin-auth.server";
import { sendAdminLoginCode } from "@/lib/playtest-email.server";

const requestCodeSchema = z.object({
  action: z.literal("request_code"),
  email: z.string().trim().email().max(255),
});

const verifyCodeSchema = z.object({
  action: z.literal("verify_code"),
  email: z.string().trim().email().max(255),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/),
});

const logoutSchema = z.object({ action: z.literal("logout") });
const schema = z.discriminatedUnion("action", [requestCodeSchema, verifyCodeSchema, logoutSchema]);

export const Route = createFileRoute("/api/admin/playtest-auth")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!adminAuthIsConfigured()) {
          return json(503, { authenticated: false, configured: false });
        }
        const session = await readAdminSession(request);
        return json(200, {
          authenticated: Boolean(session),
          configured: true,
          ...(session ? { email: session.email } : {}),
        });
      },
      POST: async ({ request }) => {
        try {
          assertSameOrigin(request);
          if (!adminAuthIsConfigured()) {
            return json(503, { error: "Admin access is not configured.", code: "not_configured" });
          }

          const body = schema.safeParse(await request.json());
          if (!body.success) {
            return json(400, { error: "Check the details and try again.", code: "invalid_input" });
          }

          if (body.data.action === "logout") {
            return json(200, { ok: true }, clearAdminCookies(request));
          }

          if (body.data.action === "request_code") {
            const challenge = await createAdminLoginChallenge(request, body.data.email);
            if (challenge.shouldSend && challenge.code) {
              try {
                await sendAdminLoginCode(body.data.email.trim().toLowerCase(), challenge.code);
              } catch (error) {
                console.error("Playtest admin sign-in email failed", error);
                return json(502, {
                  error: "The sign-in email could not be sent. Try again in a moment.",
                  code: "delivery_failed",
                });
              }
            }
            return json(
              200,
              {
                ok: true,
                waitSeconds: challenge.waitSeconds,
                message: "If that email has access, a sign-in code is on its way.",
              },
              challenge.cookie ? [challenge.cookie] : [],
            );
          }

          const cookies = await verifyAdminLoginCode(request, body.data.email, body.data.code);
          return json(200, { ok: true, authenticated: true }, cookies);
        } catch (error) {
          if (error instanceof AdminAuthError) {
            return json(error.status, { error: error.message, code: "auth_failed" }, error.cookies);
          }
          if (error instanceof SyntaxError) {
            return json(400, { error: "Check the details and try again.", code: "invalid_input" });
          }
          console.error("Playtest admin authentication failed", error);
          return json(500, { error: "Sign-in is temporarily unavailable.", code: "auth_failed" });
        }
      },
    },
  },
});

function json(status: number, body: unknown, cookies: string[] = []) {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  cookies.forEach((value) => headers.append("Set-Cookie", value));
  return new Response(JSON.stringify(body), { status, headers });
}
