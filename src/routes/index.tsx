import { createFileRoute } from "@tanstack/react-router";

import { AttentionFirstLanding } from "@/components/landing/AttentionFirstLanding";

const ASSET_ROOT = "/last-hit";
const SITE_URL = "https://lasthit.cirestudios.dev";
const PAGE_TITLE = "Last Hit | Competitive Monster-Hunting Board Game";
const PAGE_DESCRIPTION =
  "Last Hit is a competitive monster-hunting board game for 2–6 players. Choose a Bounty in secret, manage Attention, build Attack Lineups, and earn Reputation.";
const SOCIAL_DESCRIPTION =
  "Choose Bounties in secret, manage Attention, build Attack Lineups, and earn Reputation in this competitive board game for 2–6 players.";
const SOCIAL_IMAGE = `${SITE_URL}${ASSET_ROOT}/og-last-hit-v2.jpg`;

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Last Hit",
  url: `${SITE_URL}/`,
  description: PAGE_DESCRIPTION,
  image: [SOCIAL_IMAGE],
  brand: {
    "@type": "Brand",
    name: "Cire Studios",
  },
  category: "Board Game",
  audience: {
    "@type": "PeopleAudience",
    suggestedMinAge: 12,
  },
  additionalProperty: [
    {
      "@type": "PropertyValue",
      name: "Players",
      value: "2–6",
    },
    {
      "@type": "PropertyValue",
      name: "Play time",
      value: "35–60 minutes",
    },
  ],
};

export const Route = createFileRoute("/")({
  component: AttentionFirstLanding,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      {
        name: "description",
        content: PAGE_DESCRIPTION,
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      {
        property: "og:title",
        content: PAGE_TITLE,
      },
      {
        property: "og:description",
        content: SOCIAL_DESCRIPTION,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:site_name", content: "Last Hit" },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:secure_url", content: SOCIAL_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Last Hit board game box in a lantern-lit guild hall",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: SOCIAL_DESCRIPTION },
      { name: "twitter:image", content: SOCIAL_IMAGE },
      {
        name: "twitter:image:alt",
        content: "Last Hit board game box in a lantern-lit guild hall",
      },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      {
        rel: "preload",
        as: "image",
        href: `${ASSET_ROOT}/crest.webp`,
        fetchpriority: "high",
      },
      {
        rel: "preload",
        as: "image",
        href: `${ASSET_ROOT}/guild-hall.webp`,
        fetchpriority: "high",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(productSchema),
      },
    ],
  }),
});
