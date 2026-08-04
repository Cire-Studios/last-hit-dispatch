import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const categoryLabels = {
  rules: "Rules",
  balance: "Balance",
  pacing: "Pacing",
  components: "Components",
  overall: "Overall experience",
  other: "Other",
} as const;

const schema = z.object({
  category: z.enum(["rules", "balance", "pacing", "components", "overall", "other"]),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(20).max(2000),
  email: z
    .union([z.literal(""), z.string().trim().email().max(255)])
    .optional()
    .default(""),
  website: z.string().max(200).optional().default(""),
  turnstileToken: z.string().min(1).max(2048),
  source: z.string().trim().min(1).max(60).optional().default("/feedback"),
});

const turnstileResponseSchema = z.object({
  success: z.boolean(),
  "error-codes": z.array(z.string()).optional(),
});

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export const Route = createFileRoute("/api/public/feedback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return json(400, { error: "Invalid JSON", code: "invalid_input" });
        }

        const parsed = schema.safeParse(payload);
        if (!parsed.success) {
          return json(400, { error: "Invalid input", code: "invalid_input" });
        }

        const { category, rating, message, email, website, turnstileToken, source } = parsed.data;

        if (website) return json(200, { ok: true });

        const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
        const webhook = process.env.DISCORD_FEEDBACK_WEBHOOK_URL;
        if (!turnstileSecret || !webhook) {
          console.error("Feedback intake is missing required configuration");
          return json(500, { error: "Feedback unavailable", code: "not_configured" });
        }

        try {
          const verificationResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken }),
            },
          );
          const verificationPayload = turnstileResponseSchema.safeParse(
            await verificationResponse.json(),
          );

          if (
            !verificationResponse.ok ||
            !verificationPayload.success ||
            !verificationPayload.data.success
          ) {
            return json(400, { error: "Verification failed", code: "verification_failed" });
          }
        } catch (error) {
          console.error("Turnstile verification request failed", error);
          return json(502, { error: "Verification unavailable", code: "verification_unavailable" });
        }

        let webhookUrl: URL;
        try {
          webhookUrl = new URL(webhook);
          const allowedHosts = new Set([
            "discord.com",
            "www.discord.com",
            "discordapp.com",
            "www.discordapp.com",
          ]);
          if (webhookUrl.protocol !== "https:" || !allowedHosts.has(webhookUrl.hostname)) {
            throw new Error("Unexpected Discord webhook host");
          }
          webhookUrl.searchParams.set("wait", "true");
        } catch (error) {
          console.error("Feedback webhook configuration is invalid", error);
          return json(500, { error: "Feedback unavailable", code: "not_configured" });
        }

        try {
          const discordResponse = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: "Last Hit Feedback",
              allowed_mentions: { parse: [] },
              embeds: [
                {
                  title: "New Last Hit feedback",
                  description: message,
                  color: 13738062,
                  fields: [
                    { name: "Category", value: categoryLabels[category], inline: true },
                    {
                      name: "Overall experience",
                      value: `${rating}/5 ${"★".repeat(rating)}${"☆".repeat(5 - rating)}`,
                      inline: true,
                    },
                    {
                      name: "Contact",
                      value: email || "No contact details provided",
                      inline: false,
                    },
                    { name: "Source", value: source, inline: false },
                  ],
                  footer: {
                    text: email
                      ? "Contact provided voluntarily"
                      : "Submitted without contact details",
                  },
                  timestamp: new Date().toISOString(),
                },
              ],
            }),
          });

          if (!discordResponse.ok) {
            console.error(`Discord feedback webhook returned ${discordResponse.status}`);
            return json(discordResponse.status === 429 ? 503 : 502, {
              error: "Feedback delivery failed",
              code: "delivery_failed",
            });
          }

          return json(200, { ok: true });
        } catch (error) {
          console.error("Discord feedback webhook request failed", error);
          return json(502, { error: "Feedback delivery failed", code: "delivery_failed" });
        }
      },
    },
  },
});
