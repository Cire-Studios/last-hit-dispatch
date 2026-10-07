import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { MobileNavigation } from "@/components/MobileNavigation";
import { useCookieConsent } from "@/components/cookie-consent-context";
import { useSignup } from "@/components/signup-context";
import type { Monster } from "@/lib/monsters";
import { getMonsterNeighbors, monsters } from "@/lib/monsters";
import "./mystery-bounties.css";

const ASSET_ROOT = "/last-hit";

export function BestiaryHeader() {
  const { openSignup } = useSignup();

  return (
    <header className="bestiary-nav">
      <nav
        className="mx-auto flex max-w-[90rem] items-center justify-between gap-5 px-5 py-3 lg:px-10"
        aria-label="Main navigation"
      >
        <Link to="/" className="brand-mark" aria-label="Last Hit home">
          <img src={`${ASSET_ROOT}/crest.webp`} alt="" width={36} height={36} />
          <span>Last Hit</span>
        </Link>
        <div className="bestiary-nav-links">
          <Link to="/bestiary" className="nav-link" activeProps={{ "aria-current": "page" }}>
            Bestiary
          </Link>
          <Link to="/" hash="rulebook" className="nav-link">
            Rulebook
          </Link>
          <Link to="/feedback" className="nav-link">
            Feedback
          </Link>
        </div>
        <button
          className="button button-small button-gold desktop-nav-follow"
          type="button"
          onClick={() => openSignup({ source: "bestiary-header", preset: "updates" })}
        >
          Follow Last Hit
        </button>
        <MobileNavigation
          signupSource="bestiary-mobile-header"
          links={[
            { href: "/", label: "Home" },
            { href: "/#hunt", label: "How It Plays" },
            { href: "/bestiary", label: "Bestiary" },
            { href: "/#rulebook", label: "Rulebook" },
            { href: "/#playtest", label: "Playtest" },
            { href: "/feedback", label: "Feedback" },
          ]}
        />
      </nav>
    </header>
  );
}

export function BestiaryFooter() {
  const { openCookieSettings } = useCookieConsent();

  return (
    <footer className="site-footer">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-9 text-center sm:flex-row sm:text-left lg:px-10">
        <Link to="/" className="brand-mark">
          <img src={`${ASSET_ROOT}/crest.webp`} alt="" width={34} height={34} />
          <span>Last Hit</span>
        </Link>
        <p>Designed by Eric Jones · © {new Date().getFullYear()} Cire Studios LLC</p>
        <nav className="site-footer-links" aria-label="Footer navigation">
          <Link to="/feedback">Send feedback</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <button type="button" onClick={openCookieSettings}>
            Cookie Settings
          </button>
          <a href="https://cirestudios.dev" target="_blank" rel="noreferrer">
            Cire Studios <ArrowRight size={14} />
          </a>
        </nav>
      </div>
    </footer>
  );
}

export function BestiaryIndexPage() {
  return (
    <main className="site-shell bestiary-site">
      <BestiaryHeader />
      <section className="bestiary-index-hero">
        <div className="bestiary-index-backdrop" aria-hidden="true">
          <img
            src={monsters.find((monster) => monster.slug === "ember-drake")?.backgroundImage}
            alt=""
          />
        </div>
        <div className="mx-auto max-w-[90rem] px-5 lg:px-10">
          <p className="eyebrow">The Guild's field guide</p>
          <h1>Meet the monsters.</h1>
          <p>
            Learn the signs they leave behind, the places they claim, and the habits that make every
            Bounty a different kind of hunt.
          </p>
          <a className="quiet-link" href="#monster-roster">
            Open the bestiary <ArrowRight size={15} />
          </a>
        </div>
      </section>

      <section id="monster-roster" className="bestiary-roster mx-auto max-w-[90rem] px-5 lg:px-10">
        <div className="bestiary-grid">
          {monsters.map((monster) => (
            <MonsterCard monster={monster} key={monster.slug} />
          ))}
        </div>
        <section
          className="bestiary-mysteries"
          aria-labelledby="mystery-title"
          id="mystery-bounties"
        >
          <header>
            <h2 id="mystery-title">Mystery Bounties</h2>
            <p>Nine more monsters await. Their secrets stay at the table.</p>
          </header>
          <div className="bestiary-mystery-grid">
            {Array.from({ length: 9 }, (_, i) => (
              <figure key={i}>
                <img
                  src={`${ASSET_ROOT}/mystery/mystery-${i + 1}.webp`}
                  alt={`Unrevealed Bounty ${i + 1}: a monster silhouette on a concealed Bounty card`}
                  width={600}
                  height={1000}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </section>
      </section>
      <BestiaryFooter />
    </main>
  );
}

export function MonsterCard({ monster }: { monster: Monster }) {
  return (
    <Link
      to="/bestiary/$monster"
      params={{ monster: monster.slug }}
      className="monster-card"
      aria-label={`Meet the ${monster.name}`}
    >
      <div className="monster-card-art">
        <img
          src={monster.bountyImage}
          alt={`${monster.name} Bounty card`}
          width={600}
          height={1030}
          loading="lazy"
        />
      </div>
      <div className="monster-card-copy">
        <h3>{monster.name}</h3>
        <p>{monster.hook}</p>
        <strong>
          Know your quarry <ArrowRight size={15} />
        </strong>
      </div>
    </Link>
  );
}

export function MonsterProfilePage({ monster }: { monster: Monster }) {
  const { previous, next } = getMonsterNeighbors(monster.slug);

  return (
    <main className="site-shell bestiary-site monster-profile">
      <BestiaryHeader />
      <article>
        <header className="monster-hero monster-hero-scene">
          <img
            src={monster.backgroundImage}
            alt={monster.imageAlt}
            width={1920}
            height={1101}
            fetchPriority="high"
          />
          <div className="monster-hero-shade" />
          <div className="monster-hero-copy mx-auto max-w-[90rem] px-5 lg:px-10">
            <Link to="/bestiary" className="monster-back-link">
              <ArrowLeft size={16} /> The bestiary
            </Link>
            <h1>{monster.name}</h1>
            <p>{monster.hook}</p>
          </div>
        </header>

        <div className="monster-profile-body mx-auto max-w-[90rem] px-5 lg:px-10">
          <section className="monster-field-notes" aria-labelledby="know-your-quarry">
            <div>
              <p className="eyebrow">Guild field notes</p>
              <h2 id="know-your-quarry">Know your quarry.</h2>
              {monster.lore.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <dl className="monster-facts">
              <div>
                <dt>Temperament</dt>
                <dd>{monster.temperament}</dd>
              </div>
              <div>
                <dt>Known habitat</dt>
                <dd>{monster.habitat}</dd>
              </div>
            </dl>
          </section>

          <aside className="monster-bounty-panel" aria-label={`${monster.name} bounty details`}>
            <img
              src={monster.bountyImage}
              alt={`${monster.name} Bounty card`}
              width={600}
              height={1030}
              loading="lazy"
            />
            <div>
              <p className="eyebrow">Bounty record</p>
              <h2>What the Guild knows</h2>
              <div className="monster-behavior">
                <span>Hunt instructions</span>
                <h3>Every Bounty has its own rules.</h3>
                <p>
                  Use the current card shown here for Health, Reputation, behavior, and timing.
                  Specific card instructions override the general rules.
                </p>
              </div>
              <Link to="/" hash="rulebook" className="quiet-link">
                <BookOpen size={15} /> Read the current rulebook
              </Link>
            </div>
          </aside>
        </div>
      </article>

      <nav
        className="monster-neighbors mx-auto max-w-[90rem] px-5 lg:px-10"
        aria-label="More monsters"
      >
        <div>
          {previous ? (
            <Link to="/bestiary/$monster" params={{ monster: previous.slug }}>
              <ArrowLeft />
              <span>
                Previous quarry<small>{previous.name}</small>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to="/bestiary/$monster" params={{ monster: next.slug }}>
              <span>
                Next quarry<small>{next.name}</small>
              </span>
              <ArrowRight />
            </Link>
          ) : (
            <span />
          )}
        </div>
        <Link to="/bestiary" className="button button-gold">
          View all monsters
        </Link>
      </nav>
      <BestiaryFooter />
    </main>
  );
}
