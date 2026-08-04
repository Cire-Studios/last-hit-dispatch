import { createFileRoute } from "@tanstack/react-router";
import { EyeOff, MessageSquareText, ShieldCheck } from "lucide-react";

import { BestiaryFooter, BestiaryHeader } from "@/components/bestiary/BestiaryPages";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

const SITE_URL = "https://lasthit.cirestudios.dev";
const TITLE = "Send Feedback | Last Hit";
const DESCRIPTION =
  "Share private playtest feedback with the Last Hit team. No account or contact information is required.";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/feedback` },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/feedback` }],
  }),
});

function FeedbackPage() {
  return (
    <main className="site-shell feedback-site">
      <BestiaryHeader />
      <section className="feedback-page">
        <div className="feedback-page-atmosphere" aria-hidden="true" />
        <div className="feedback-page-grid mx-auto max-w-[90rem] px-5 lg:px-10">
          <div className="feedback-page-copy">
            <p className="eyebrow">Field report</p>
            <h1>
              Help shape
              <span>the next hunt.</span>
            </h1>
            <p>
              Tell us what worked, what felt unclear, or what you would change. Every report helps
              us make Last Hit stronger.
            </p>
            <div className="feedback-promises" aria-label="About your feedback">
              <div>
                <EyeOff aria-hidden="true" />
                <span>
                  <strong>No account needed</strong>
                  <small>Leave email blank to send without contact details.</small>
                </span>
              </div>
              <div>
                <ShieldCheck aria-hidden="true" />
                <span>
                  <strong>Shared privately</strong>
                  <small>Your response goes directly to the Last Hit team.</small>
                </span>
              </div>
              <div>
                <MessageSquareText aria-hidden="true" />
                <span>
                  <strong>Honest feedback welcome</strong>
                  <small>Specific moments and examples help us most.</small>
                </span>
              </div>
            </div>
          </div>
          <div className="feedback-form-card">
            <header>
              <span>Playtest feedback</span>
              <h2>Send a field report</h2>
              <p>Most reports take less than three minutes.</p>
            </header>
            <FeedbackForm />
          </div>
        </div>
      </section>
      <BestiaryFooter />
    </main>
  );
}
