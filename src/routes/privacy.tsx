import { createFileRoute, Link } from "@tanstack/react-router";

import { BestiaryFooter, BestiaryHeader } from "@/components/bestiary/BestiaryPages";

const SITE_URL = "https://lasthit.cirestudios.dev";
const TITLE = "Privacy Policy | Last Hit";
const DESCRIPTION =
  "Learn how Cire Studios LLC handles information on the Last Hit website and the choices available to you.";

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
          <p className="eyebrow">Last updated October 13, 2026</p>
          <h1>Privacy Policy</h1>
          <p>
            Cire Studios LLC operates Last Hit. This policy applies to the website at{" "}
            <a href={SITE_URL}>lasthit.cirestudios.dev</a> and explains how information is handled
            when you use it.
          </p>
        </header>

        <section>
          <h2>Information you provide</h2>
          <p>You can browse the website without joining an email list.</p>
          <ul>
            <li>
              <strong>Follow Last Hit:</strong> If you sign up, we collect your email address,
              whether you selected Announcements, Playtesting, or both, and where the signup form
              was opened on the website.
            </li>
            <li>
              <strong>Feedback and contact:</strong> If you send feedback or contact us, we collect
              the information you choose to provide. The feedback form includes a category, rating,
              message, and an optional email address.
            </li>
            <li>
              <strong>Playtest reservations:</strong> If you reserve a playtest seat, we collect
              your name, email address, selected session and table, party size, signup source, and
              whether you asked to receive future playtest invitations and updates.
            </li>
          </ul>
        </section>

        <section>
          <h2>Information collected automatically</h2>
          <p>
            When you visit, hosting, security, error-monitoring, and optional analytics services may
            automatically receive technical information needed to deliver, protect, and understand
            the website. Depending on the service and your choices, this may include your IP address
            and approximate location derived from it, browser and device type, operating system,
            requested pages and resources, timestamps, referring page, and basic page-view or
            interaction information.
          </p>
          <p>
            Cloudflare provides hosting and security services and may set an essential security
            cookie such as <code>__cf_bm</code>. The feedback page also uses Cloudflare Turnstile to
            help prevent abuse. Turnstile may receive browser, device, IP-address, and interaction
            information needed to perform that check. See the{" "}
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">
              Cloudflare Privacy Policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Email subscriptions and MailerLite</h2>
          <p>
            MailerLite processes subscriptions on behalf of Cire Studios LLC. Subscriber information
            is used to send the Announcements or Playtesting communications you selected. Cire
            Studios decides which Last Hit communications are sent; MailerLite provides the service
            used to manage and deliver them.
          </p>
          <p>
            Reservation confirmations and time-sensitive playtest reminders are service messages for
            the reservation you requested. They are separate from optional marketing emails.
          </p>
          <p>
            You can unsubscribe through the link included in each marketing email. Learn more in the{" "}
            <a
              href="https://www.mailerlite.com/legal/privacy-policy"
              target="_blank"
              rel="noreferrer"
            >
              MailerLite Privacy Policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Optional Meta Pixel</h2>
          <p>
            If you accept optional cookies, the Meta Pixel loads to measure page visits, successful
            signup conversions, and advertising effectiveness. Meta may receive browser, device,
            cookie, IP-address, page-view, referral, and conversion-event information.
          </p>
          <p>
            The conversion events identify whether a successful signup selected Announcements,
            Playtesting, or both. Last Hit does not intentionally send signup email addresses,
            names, feedback, or other form-field contents through the Meta Pixel.
          </p>
          <p>
            The Meta Pixel does not download or run unless you select Accept optional cookies. See
            Meta&apos;s{" "}
            <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noreferrer">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://accountscenter.facebook.com/ad_preferences"
              target="_blank"
              rel="noreferrer"
            >
              Ad Preferences
            </a>
            . You can also stop future Meta tracking on this website through Cookie Settings.
          </p>
        </section>

        <section>
          <h2>Cookies and storage choices</h2>
          <p>
            Essential website technology supports delivery, security, feedback verification, and
            remembering your privacy choice. It remains available whether you accept or reject
            optional cookies.
          </p>
          <p>
            The website stores your choice in localStorage under{" "}
            <code>last_hit_meta_pixel_consent</code>, with a value of <code>accepted</code> or{" "}
            <code>rejected</code>. This preference does not contain your email address or name. If
            browser storage is cleared, the website will ask for your choice again.
          </p>
          <p>
            Accept allows the optional Meta advertising and measurement technology to load and set
            related cookies. Reject keeps it disabled without limiting essential website features.
            Use the Cookie Settings link in the footer to change your choice. Changing from Accept
            to Reject stops future Pixel calls, removes known first-party Meta cookies where
            technically possible, and reloads the page with the Pixel disabled.
          </p>
        </section>

        <section>
          <h2>How information is used</h2>
          <ul>
            <li>Operate, maintain, and secure the website.</li>
            <li>Manage subscriptions and send the communications you selected.</li>
            <li>Recruit and communicate with playtesters.</li>
            <li>Manage playtest capacity, confirmations, cancellations, and reminders.</li>
            <li>Review feedback and improve Last Hit.</li>
            <li>Understand website performance and diagnose errors.</li>
            <li>Measure promotions and advertising when optional cookies are accepted.</li>
          </ul>
        </section>

        <section>
          <h2>Service providers and disclosures</h2>
          <p>
            The current website uses service providers for hosting, security, error monitoring,
            subscription management, feedback delivery, and optional advertising measurement. These
            include Cloudflare, Lovable, Resend, MailerLite, Discord, and Meta as described in this
            policy. Lovable supports playtest reservation records, and Resend delivers reservation
            confirmations and reminders.
          </p>
          <p>
            Feedback submitted through the website is delivered to a private Cire Studios channel
            using Discord. The submitted category, rating, message, source page, and optional email
            address are included. See the{" "}
            <a href="https://discord.com/privacy" target="_blank" rel="noreferrer">
              Discord Privacy Policy
            </a>
            .
          </p>
          <p>
            Optional advertising-related tracking can be disabled through Cookie Settings. This
            policy does not make a statement about whether particular disclosures are considered a
            “sale” or “share” under any specific privacy law.
          </p>
        </section>

        <section>
          <h2>Data retention</h2>
          <p>
            Subscription information is retained while you remain subscribed and as reasonably
            necessary for operational and legal purposes. Unsubscribing stops marketing emails, but
            limited records may be retained to honor and document the unsubscribe request.
          </p>
          <p>
            Feedback, security records, website logs, and other information may be retained as
            reasonably necessary for the purposes described in this policy and according to the
            practices of the services involved. Cire Studios has not stated a fixed retention period
            for these records.
          </p>
        </section>

        <section>
          <h2>Privacy requests</h2>
          <p>
            Depending on where you live, you may have rights to request access to, correction of, or
            deletion of your personal information. Cire Studios may need to verify your identity
            before fulfilling a request.
          </p>
          <p>
            To make a request, use the <Link to="/feedback">Last Hit feedback form</Link> and
            provide an email address so Cire Studios can respond. The current public Cire Studios
            website does not list a contact email, so this policy does not publish an unverified
            address.
          </p>
        </section>

        <section>
          <h2>Children</h2>
          <p>
            The email signup and website marketing services are not directed to children under 13,
            and Cire Studios does not knowingly collect personal information from children under 13.
            A parent or guardian who believes a child provided personal information can request its
            deletion through the <Link to="/feedback">feedback form</Link>.
          </p>
          <p>
            Last Hit&apos;s recommended playing age of 12+ describes the board game. It does not
            mean a child under 13 should submit personal information through the website.
          </p>
        </section>

        <section>
          <h2>Security</h2>
          <p>
            Cire Studios uses reasonable safeguards suited to the website and the information it
            handles. No method of transmission or storage can be guaranteed to be completely secure.
          </p>
        </section>

        <section>
          <h2>External links</h2>
          <p>
            The website links to third-party websites and services. Their privacy practices are
            governed by their own policies, not this policy.
          </p>
        </section>

        <section>
          <h2>Changes to this policy</h2>
          <p>
            Material changes will be reflected on this page by updating the date above and, when
            appropriate, by adding a notice on the website.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Last Hit is operated by Cire Studios LLC. For privacy questions or requests, use the{" "}
            <Link to="/feedback">Last Hit feedback form</Link> and include an email address if you
            would like a response.
          </p>
        </section>
      </article>
      <BestiaryFooter />
    </main>
  );
}
