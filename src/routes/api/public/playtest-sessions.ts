import { createFileRoute } from "@tanstack/react-router";

import { createDemoPlaytestSessions, type PlaytestSessionsResponse } from "@/lib/playtest";
import { listPlaytestSessions, playtestDatabaseIsConfigured } from "@/lib/playtest-storage.server";

function json(status: number, body: PlaytestSessionsResponse | { error: string }) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export const Route = createFileRoute("/api/public/playtest-sessions")({
  server: {
    handlers: {
      GET: async () => {
        if (process.env.PLAYTEST_DEMO_MODE === "true") {
          return json(200, { sessions: createDemoPlaytestSessions(), mode: "demo" });
        }

        if (!playtestDatabaseIsConfigured()) {
          return json(200, { sessions: [], mode: "unconfigured" });
        }

        try {
          return json(200, { sessions: await listPlaytestSessions(), mode: "live" });
        } catch (error) {
          console.error("Playtest schedule request failed", error);
          return json(502, { error: "Schedule unavailable" });
        }
      },
    },
  },
});
