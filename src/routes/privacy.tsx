import { createFileRoute, Link } from "@tanstack/react-router";

import { BestiaryFooter, BestiaryHeader } from "@/components/bestiary/BestiaryPages";

const SITE_URL = "https://lasthit.cirestudios.dev";
const TITLE = "Privacy Policy | Last Hit";
const DESCRIPTION = "Learn what information Last Hit collects and the choices available to you.";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/privacy` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
  }),
});

function PrivacyPage() {
  return (
    <main className="site-shell privacy-site">
      <BestiaryHeader />
      <article className="privacy-page mx-auto max-w-4xl px-5 lg:px-10">
        <header>
          <p className="eyebrow">Last updated August 13, 2026</p>
          <h1>Privacy Policy</h1>
          <p>This policy explains what Last Hit collects and how it is used.</p>
        </header>

        <section>
          <h2>Information you provide</h2>
          <p>
            When you follow Last Hit, we collect your email address and update choices so we can
            send what you requested. When you send feedback, we collect what you choose to share,
            including contact details if you provide them.
          </p>
        </section>

        <section>
          <h2>Optional cookies</h2>
          <p>
            If you accept optional cookies, they help us understand website visits and measure our
            promotions. We may record page visits and whether a successful signup selected
            Announcements, Playtesting, or both.
          </p>
          <p>
            We do not include your email address, name, feedback, or form content in these tracking
            events. You can reject optional cookies or change your choice through Cookie Settings in
            the footer.
          </p>
        </section>

        <section>
          <h2>How information is used</h2>
          <p>
            We use information to send requested updates, improve Last Hit, review feedback, operate
            the website, and understand our promotions. Services that help us do this process only
            the information needed for their role.
          </p>
        </section>

        <section>
          <h2>Your choices</h2>
          <p>
            You can unsubscribe from emails at any time using the link in an email. For privacy
            questions, <Link to="/feedback">send feedback</Link> and include contact details if you
            would like a response.
          </p>
        </section>
      </article>
      <BestiaryFooter />
    </main>
  );
}
