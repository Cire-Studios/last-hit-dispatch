import { createFileRoute, notFound } from "@tanstack/react-router";

import { MonsterProfilePage } from "@/components/bestiary/BestiaryPages";
import { getMonster } from "@/lib/monsters";

const SITE_URL = "https://lasthit.cirestudios.dev";

export const Route = createFileRoute("/bestiary/$monster")({
  loader: ({ params }) => {
    const monster = getMonster(params.monster);
    if (!monster) throw notFound();
    return monster;
  },
  component: MonsterRoute,
  head: ({ loaderData: monster }) => {
    if (!monster) return {};
    const title = `${monster.name} | Last Hit Bestiary`;
    const description = `Meet the ${monster.name}: ${monster.hook} Discover its lore, Bounty record, and Monster Behavior.`;
    const canonical = `${SITE_URL}/bestiary/${monster.slug}`;
    const socialImage = monster.backgroundImage;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonical },
        { property: "og:image", content: `${SITE_URL}${socialImage}` },
        { property: "og:image:alt", content: monster.imageAlt },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: `${SITE_URL}${socialImage}` },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `Meet the ${monster.name}`,
            description,
            image: `${SITE_URL}${socialImage}`,
            mainEntityOfPage: canonical,
          }),
        },
      ],
    };
  },
});

function MonsterRoute() {
  const monster = Route.useLoaderData();
  return <MonsterProfilePage monster={monster} />;
}
