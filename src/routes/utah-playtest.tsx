import { createFileRoute } from "@tanstack/react-router";

import { UtahPlaytestLanding } from "@/components/playtest/UtahPlaytestLanding";

const SITE_URL = "https://lasthit.cirestudios.dev";
const TITLE = "Reserve a Utah Playtest Seat | Last Hit";
const DESCRIPTION =
  "Reserve a free seat at an upcoming Last Hit board game playtest in Utah County. Choose a date, pick a table, and help shape the next hunt.";

export const Route = createFileRoute("/utah-playtest")({
  component: UtahPlaytestLanding,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/utah-playtest` },
      { property: "og:image", content: `${SITE_URL}/last-hit/og-last-hit.jpg` },
      { property: "og:image:alt", content: "Last Hit board game components arranged for play" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/last-hit/og-last-hit.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/utah-playtest` }],
  }),
});
