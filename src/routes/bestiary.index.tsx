import { createFileRoute } from "@tanstack/react-router";

import { BestiaryIndexPage } from "@/components/bestiary/BestiaryPages";

const SITE_URL = "https://lasthit.cirestudios.dev";
const TITLE = "Meet the Monsters | Last Hit Bestiary";
const DESCRIPTION =
  "Meet all 12 monsters in Last Hit. Explore their lore, Bounty statistics, and verified Monster Behaviors.";

export const Route = createFileRoute("/bestiary/")({
  component: BestiaryIndexPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/bestiary` },
      {
        property: "og:image",
        content: `${SITE_URL}/last-hit/monsters/backgrounds/ember-drake.webp`,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/bestiary` }],
  }),
});
