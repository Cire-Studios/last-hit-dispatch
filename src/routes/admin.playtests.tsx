import { createFileRoute } from "@tanstack/react-router";

import { PlaytestAdminPortal } from "@/components/playtest-admin/PlaytestAdminPortal";

export const Route = createFileRoute("/admin/playtests")({
  component: PlaytestAdminPortal,
  head: () => ({
    meta: [
      { title: "Playtest Command Center | Last Hit" },
      { name: "description", content: "Manage Last Hit playtest dates and reservations." },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
});
