import { ArrowDown, ArrowRight, BookOpen } from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { RULEBOOK_URL } from "@/lib/game-rules";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useCookieConsent } from "@/components/cookie-consent-context";
import { useSignup } from "@/components/signup-context";
import { BoxSpread } from "./BoxSpread";
import { ComponentInventory } from "./ComponentInventory";
import { WorldPitch } from "./WorldPitch";
import "./landing-experience.css";

const ASSET_ROOT = "/last-hit";
const playerSets = [
  { number: 1, color: "red", label: "Red", accent: "#9d2f2b" },
  { number: 2, color: "green", label: "Green", accent: "#39755b" },
  { number: 3, color: "blue", label: "Blue", accent: "#315da8" },
  { number: 4, color: "purple", label: "Purple", accent: "#6a3f91" },
  { number: 5, color: "white", label: "White", accent: "#ded9ca" },
  { number: 6, color: "orange", label: "Orange", accent: "#c66f2a" },
];

export function AttentionFirstLanding() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return (
    <main id="top" className="site-shell lh-landing lh-world-edition">
      <SiteNavigation />
      <Hero />
      <WorldPitch />
      <OnTheTable />
      <GuildInvitation />
      <SiteFooter />
    </main>
  );
}

function Hero() {
  const { openSignup } = useSignup();
  return (
    <section className="lh-hero" aria-labelledby="hero-title">
      <img
        className="lh-hero-world"
        src={`${ASSET_ROOT}/guild-hall.webp`}
        alt=""
        fetchPriority="high"
      />
      <div className="lh-hero-shade" />
      <div className="lh-hero-inner lh-wrap">
        <div className="lh-hero-copy">
          <p className="lh-kicker">A competitive monster-hunting board game</p>
          <p className="lh-wordmark">Last Hit</p>
          <h1 id="hero-title">Hunt monsters. Compete for the last hit.</h1>
          <p className="lh-hero-pitch">
            Your rivals help wear down the monster. They also want the Bounty. Plan your hunt,
            choose your moment, and finish what everyone else started.
          </p>
          <div className="lh-hero-actions">
            <button
              className="button button-gold"
              type="button"
              onClick={() => openSignup({ source: "hero", preset: "updates" })}
            >
              Get launch updates <ArrowRight size={17} />
            </button>
            <a className="lh-text-link" href="#hunt">
              Beyond the Guild <ArrowDown size={16} />
            </a>
          </div>
          <p className="lh-prelaunch">
            <i />
            In development · Playtesting now
          </p>
        </div>
        <div className="lh-hero-product">
          <div className="lh-product-halo" />
          <img
            className="lh-hero-box"
            src={`${ASSET_ROOT}/game-box.webp`}
            alt="Last Hit board game box"
            width={1254}
            height={1254}
            fetchPriority="high"
          />
        </div>
      </div>
      <div className="lh-game-facts lh-wrap" aria-label="Game details">
        <div>
          <strong>2–6</strong>
          <span>Players</span>
        </div>
        <div>
          <strong>35–60</strong>
          <span>Minutes</span>
        </div>
        <div>
          <strong>12+</strong>
          <span>Ages</span>
        </div>
        <p>
          Secret plans <i /> Shared Bounties <i /> Ruthless timing
        </p>
      </div>
    </section>
  );
}

function OnTheTable() {
  return (
    <section id="box" className="lh-table-section">
      <div className="lh-wrap">
        <header className="lh-section-heading">
          <div>
            <p className="lh-kicker">On the table</p>
            <h2>What’s in the box.</h2>
          </div>
          <p>The Bounties, the dice, and six rival hunters’ worth of trouble.</p>
        </header>
        <BoxSpread />
        <ComponentInventory />
        <div className="lh-player-sets-open">
          <PlayerComponents />
        </div>
        <div id="rulebook" className="lh-rulebook-strip">
          <div>
            <BookOpen size={28} />
            <div>
              <h3>Want the full rules?</h3>
              <p>The rulebook covers everything from your first hunt to optional ways to play.</p>
            </div>
          </div>
          <a className="button" href={RULEBOOK_URL} target="_blank" rel="noreferrer">
            Read the rulebook <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

function GuildInvitation() {
  const { openSignup } = useSignup();
  return (
    <section id="playtest" className="lh-invitation">
      <img
        src={`${ASSET_ROOT}/guild-hall.webp`}
        className="lh-invitation-bg"
        alt=""
        loading="lazy"
      />
      <div className="lh-wrap lh-invitation-content">
        <img className="lh-seal" src={`${ASSET_ROOT}/crest.webp`} alt="" loading="lazy" />
        <p className="lh-kicker">From the Guild</p>
        <h2>Follow Last Hit.</h2>
        <p>
          Last Hit is in playtesting. Sign up for launch news, or join the playtest list and help
          shape the game before it reaches the table.
        </p>
        <div className="lh-invitation-actions">
          <button
            className="button button-gold"
            onClick={() => openSignup({ source: "final-cta", preset: "updates" })}
          >
            Get launch updates <ArrowRight size={17} />
          </button>
          <button
            className="button"
            onClick={() => openSignup({ source: "playtest", preset: "playtest" })}
          >
            Join the playtest list
          </button>
        </div>
        <a className="lh-feedback-link" href="/feedback">
          Already played? Send your feedback <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}

function SiteNavigation() {
  const { openSignup } = useSignup();

  return (
    <header className="site-nav">
      <nav className="mx-auto flex max-w-[90rem] items-center justify-between gap-5 px-5 py-3 lg:px-10">
        <a href="#top" className="brand-mark" aria-label="Last Hit home">
          <img
            src={`${ASSET_ROOT}/crest.webp`}
            alt=""
            width={36}
            height={36}
            fetchPriority="high"
            decoding="async"
          />
          <span>Last Hit</span>
        </a>
        <div className="hidden items-center gap-7 lg:flex">
          {[
            ["#hunt", "The Hunt"],
            ["/bestiary", "Bestiary"],
            ["#rulebook", "Rulebook"],
            ["#box", "On the Table"],
          ].map(([href, label]) => (
            <a className="nav-link" href={href} key={href}>
              {label}
            </a>
          ))}
        </div>
        <button
          className="button button-small button-gold desktop-nav-follow"
          type="button"
          onClick={() => openSignup({ source: "header", preset: "updates" })}
        >
          Follow Last Hit
        </button>
        <MobileNavigation
          signupSource="mobile-header"
          links={[
            { href: "#hunt", label: "The Hunt" },
            { href: "/bestiary", label: "Bestiary" },
            { href: "#rulebook", label: "Rulebook" },
            { href: "#box", label: "On the Table" },
            { href: "#playtest", label: "Playtest" },
            { href: "/feedback", label: "Feedback" },
          ]}
        />
      </nav>
    </header>
  );
}

function PlayerComponents() {
  const [selectedNumber, setSelectedNumber] = useState(1);
  const selected = playerSets.find((set) => set.number === selectedNumber) ?? playerSets[0];
  const targetDeck = [
    ["target-back", "Target deck back"],
    ["target-a", "Target A"],
    ["target-b", "Target B"],
    ["target-c", "Target C"],
    ["pre", "PRE"],
  ];
  const attentionDeck = [
    ["attention-back", "Attention deck back"],
    ["attention-1", "Attention 1"],
    ["attention-2", "Attention 2"],
    ["attention-3", "Attention 3"],
    ["attention-4", "Attention 4"],
    ["attention-5", "Attention 5"],
    ["attention-6", "Attention 6"],
    ["pare", "PARE"],
  ];

  return (
    <ComponentRow className="player-components-row" visualSide="left">
      <div
        className="player-set-visual"
        style={{ "--player-accent": selected.accent } as CSSProperties}
        key={selected.number}
        aria-live="polite"
      >
        <div className="player-deck-showcase">
          <figure className="player-deck player-target-deck">
            <figcaption>Target / PRE</figcaption>
            <div className="player-deck-cards">
              {targetDeck.map(([slug, label]) => (
                <img
                  src={`${ASSET_ROOT}/cards/players/${selected.number}/${slug}.webp`}
                  alt={`${selected.label} ${label} card`}
                  loading="lazy"
                  key={slug}
                />
              ))}
            </div>
          </figure>
          <figure className="player-deck player-attention-deck">
            <figcaption>Attention / PARE</figcaption>
            <div className="player-deck-cards">
              {attentionDeck.map(([slug, label]) => (
                <img
                  src={`${ASSET_ROOT}/cards/players/${selected.number}/${slug}.webp`}
                  alt={`${selected.label} ${label} card`}
                  loading="lazy"
                  key={slug}
                />
              ))}
            </div>
          </figure>
        </div>
        <div className="player-piece-tray">
          <figure className="player-attack-supply">
            <div
              className="player-attack-grid"
              role="img"
              aria-label={`12 ${selected.label.toLowerCase()} Attack Cubes`}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <img
                  key={index}
                  src={`${ASSET_ROOT}/components/pieces/cube-${selected.color}.webp`}
                  alt=""
                  loading="lazy"
                />
              ))}
            </div>
            <figcaption>12 Attack Cubes</figcaption>
          </figure>
          <figure className="player-tracker-piece">
            <img
              src={`${ASSET_ROOT}/current/disc-${selected.color}.webp`}
              alt={`${selected.label} Reputation Tracker disc`}
              loading="lazy"
            />
            <figcaption>Reputation Tracker</figcaption>
          </figure>
          <figure className="player-lineup-piece">
            <img
              src={`${ASSET_ROOT}/components/pieces/pawn-${selected.color}.webp`}
              alt={`${selected.label} Lineup Pawn`}
              loading="lazy"
            />
            <figcaption>Lineup Pawn</figcaption>
          </figure>
        </div>
      </div>
      <ComponentCopy eyebrow="Choose your color" title="Six player sets.">
        <p className="component-punch-line">
          Your own planning cards, Lineup Pawn, Reputation Tracker, and twelve Attack Cubes leave no
          doubt about who did the damage.
        </p>
        <div className="player-set-selector" role="radiogroup" aria-label="Choose a player set">
          {playerSets.map((set) => (
            <button
              type="button"
              role="radio"
              aria-checked={selected.number === set.number}
              className={selected.number === set.number ? "is-active" : ""}
              style={{ "--swatch": set.accent } as CSSProperties}
              onClick={() => setSelectedNumber(set.number)}
              key={set.number}
            >
              <i aria-hidden="true" />
              <strong>{set.number}</strong>
              <span>{set.label}</span>
            </button>
          ))}
        </div>
      </ComponentCopy>
    </ComponentRow>
  );
}

function ComponentRow({
  id,
  visualSide,
  className,
  children,
}: {
  id?: string;
  visualSide: "left" | "right";
  className: string;
  children: ReactNode;
}) {
  return (
    <article
      id={id}
      className={`component-row component-visual-${visualSide} ${className}`}
      data-reveal
    >
      <div className="component-row-inner">{children}</div>
    </article>
  );
}

function ComponentCopy({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="component-row-copy">
      <p className="eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function SiteFooter() {
  const { openCookieSettings } = useCookieConsent();

  return (
    <footer className="site-footer">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-9 text-center sm:flex-row sm:text-left lg:px-10">
        <a href="#top" className="brand-mark">
          <img
            src={`${ASSET_ROOT}/crest.webp`}
            alt=""
            width={34}
            height={34}
            loading="lazy"
            decoding="async"
          />
          <span>Last Hit</span>
        </a>
        <p>Designed by Eric Jones · © {new Date().getFullYear()} Cire Studios LLC</p>
        <nav className="site-footer-links" aria-label="Footer navigation">
          <a href="/feedback">Send feedback</a>
          <a href="/privacy">Privacy Policy</a>
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
