import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const schema = z.object({
  email: z.string().trim().email().max(255),
  interests: z.array(z.enum(["updates", "playtest"])).min(1).max(4),
  source: z.string().trim().max(60).optional(),
});

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export const Route = createFileRoute("/api/public/signup")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        const apiKey = process.env.MAILERLITE_API_KEY;
        if (!apiKey) return json(500, { error: "MailerLite not configured" });

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return json(400, { error: "Invalid JSON" });
        }

        const parsed = schema.safeParse(payload);
        if (!parsed.success) {
          return json(400, { error: "Invalid input", issues: parsed.error.issues });
        }
        const { email, interests, source } = parsed.data;

        const groupMap: Record<"updates" | "playtest", string | undefined> = {
          updates: process.env.MAILERLITE_GROUP_UPDATES,
          playtest: process.env.MAILERLITE_GROUP_PLAYTEST,
        };
        const groups = interests.map((i) => groupMap[i]).filter((g): g is string => Boolean(g));

        const body: Record<string, unknown> = {
          email,
          fields: {
            interests: interests.join(","),
            ...(source ? { signup_source: source } : {}),
          },
          status: "active",
        };
        if (groups.length > 0) body.groups = groups;

        try {
          const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(body),
          });

          if (!res.ok) {
            const errText = await res.text();
            console.error(`MailerLite ${res.status}: ${errText}`);
            return json(502, { error: "Subscription failed" });
          }

          return json(200, { ok: true });
        } catch (err) {
          console.error("MailerLite request error:", err);
          return json(502, { error: "Subscription failed" });
        }
      },
    },
  },
});
