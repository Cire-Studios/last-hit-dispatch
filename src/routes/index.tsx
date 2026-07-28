import { createFileRoute } from "@tanstack/react-router";

import { AttentionFirstLanding } from "@/components/landing/AttentionFirstLanding";

const ASSET_ROOT = "/last-hit";

export const Route = createFileRoute("/")({
  component: AttentionFirstLanding,
  head: () => ({
    meta: [
      { title: "Last Hit — Predict the Table. Control the Timing." },
      {
        name: "description",
        content:
          "Last Hit is a competitive 2–6 player board game where Attention controls Priority, placement, and whether rivals can interfere with an attack.",
      },
      {
        property: "og:title",
        content: "Last Hit — Predict the Table. Control the Timing.",
      },
      {
        property: "og:description",
        content: "Commit Attention to place later—or save it to cut down a rival's attack.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${ASSET_ROOT}/og-last-hit.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${ASSET_ROOT}/og-last-hit.jpg` },
    ],
    links: [
      { rel: "preload", as: "image", href: `${ASSET_ROOT}/guild-hall.webp` },
      { rel: "preload", as: "image", href: `${ASSET_ROOT}/cover.webp` },
    ],
  }),
});
