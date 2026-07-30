import { ArrowDown, ArrowRight, BookOpen, RotateCcw, Shield, Sparkles, Users } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { SignupForm } from "@/components/SignupForm";
import rulebookAsset from "@/assets/rulebook.pdf.asset.json";

const ASSET_ROOT = "/last-hit";
const RULEBOOK_URL = rulebookAsset.url;

const playerSets = [
  { number: 1, color: "red", label: "Red", accent: "#9d2f2b" },
  { number: 2, color: "green", label: "Green", accent: "#39755b" },
  { number: 3, color: "blue", label: "Blue", accent: "#315da8" },
  { number: 4, color: "purple", label: "Purple", accent: "#6a3f91" },
  { number: 5, color: "white", label: "White", accent: "#ded9ca" },
  { number: 6, color: "orange", label: "Orange", accent: "#c66f2a" },
];

const mats = [
  ["grave-hound", "Grave Hound"],
  ["crystal-basilisk", "Crystal Basilisk"],
  ["ironhide-boar", "Ironhide Boar"],
  ["feral-imp", "Feral Imp"],
  ["gilded-manticore", "Gilded Manticore"],
  ["razorwing-harpy", "Razorwing Harpy"],
  ["hill-ogre", "Hill Ogre"],
  ["moss-troll", "Moss Troll"],
  ["sandworm", "Sandworm"],
  ["stone-golem", "Stone Golem"],
  ["mire-hydra", "Mire Hydra"],
  ["ember-drake", "Ember Drake"],
].map(([slug, label]) => ({
  src: `${ASSET_ROOT}/mats/${slug}.webp`,
  alt: `${label} Hunter Mat`,
  label,
}));

const bounties = [
  ["feral-imp-bounty", "Feral Imp"],
  ["razorwing-harpy-bounty", "Razorwing Harpy"],
  ["hill-ogre-bounty", "Hill Ogre"],
  ["grave-hound-bounty", "Grave Hound"],
  ["ironhide-boar-bounty", "Ironhide Boar"],
  ["stone-golem-bounty", "Stone Golem"],
  ["moss-troll-bounty", "Moss Troll"],
  ["gilded-manticore-bounty", "Gilded Manticore"],
  ["sandworm-bounty", "Sandworm"],
  ["crystal-basilisk-bounty", "Crystal Basilisk"],
  ["mire-hydra-bounty", "Mire Hydra"],
  ["ember-drake-bounty", "Ember Drake"],
].map(([slug, label]) => ({
  src: `${ASSET_ROOT}/components/${slug}.webp`,
  alt: `${label} Bounty card`,
  label,
}));

const boardHotspots = [
  {
    id: "lineup",
    label: "Attack Lineup",
    detail: "Front to Back",
    x: "13.2%",
    y: "40%",
  },
  {
    id: "bounty",
    label: "Bounty Slot",
    detail: "Monster and Damage",
    x: "26%",
    y: "36%",
  },
  {
    id: "boons",
    label: "Boon Slots",
    detail: "Rewards for Neglect",
    x: "24.7%",
    y: "73%",
  },
  {
    id: "reputation",
    label: "Reputation Track",
    detail: "Race to 15",
    x: "70.6%",
    y: "90.5%",
  },
];

export function AttentionFirstLanding() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.14 },
    );

    const revealNodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    revealNodes.forEach((node) => revealObserver.observe(node));

    return () => revealObserver.disconnect();
  }, []);

  return (
    <main id="top" className="site-shell attention-first-site">
      <SiteNavigation />
      <Hero />
      <GameOverview />
      <AttentionHook />
      <HuntPressures />
      <Rulebook />
      <ComponentLadder />
      <Playtest />
      <FinalCallToAction />
      <SiteFooter />
    </main>
  );
}

function SiteNavigation() {
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
            ["#hunt", "How It Plays"],
            ["#rulebook", "Rulebook"],
            ["#box", "Inside the Box"],
            ["#playtest", "Playtest"],
          ].map(([href, label]) => (
            <a className="nav-link" href={href} key={href}>
              {label}
            </a>
          ))}
        </div>
        <a className="button button-small button-gold" href="#join">
          Get launch updates
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section">
      <img
        className="hero-atmosphere"
        src={`${ASSET_ROOT}/guild-hall.webp`}
        alt=""
        width={1915}
        height={821}
        fetchPriority="high"
      />
      <div className="hero-vignette" />
      <div className="hero-content mx-auto grid min-h-[850px] max-w-[90rem] items-center gap-14 px-5 pb-20 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-24 lg:pt-36">
        <div className="relative z-10 max-w-3xl" data-reveal>
          <p className="eyebrow">
            <span className="status-dot" />
            Prelaunch · Playtesting now
          </p>
          <h1 className="hero-title">
            Hunt monsters.
            <span>Outplan your rivals.</span>
          </h1>
          <p className="hero-lede">
            Last Hit is a competitive monster-hunting board game. Choose a Bounty in secret, control
            your place in the Attack Lineup, and defeat monsters to earn Reputation.
          </p>
          <div className="stat-row" aria-label="Game details">
            <Stat icon={<Users />} value="2–6" label="Hunters" />
            <Stat icon={<Shield />} value="12+" label="Ages" />
            <Stat icon={<Sparkles />} value="35–60" label="Minutes" />
          </div>
          <div id="join" className="hero-signup scroll-mt-28">
            <p className="signup-heading">Be first to hear when Last Hit launches.</p>
            <SignupForm interests={["updates"]} source="hero" buttonLabel="Get launch updates" />
            <a href="#playtest" className="quiet-link">
              Join the playtest list <ArrowDown size={14} />
            </a>
          </div>
        </div>

        <div className="hero-art" data-reveal>
          <div className="game-box-wrap" aria-label="Last Hit board game box">
            <div className="game-box">
              <img
                src={`${ASSET_ROOT}/game-box.webp`}
                alt="Last Hit competitive monster-hunting board game box"
                width={1254}
                height={1254}
                fetchPriority="high"
              />
            </div>
            <div className="box-glow" />
          </div>
          <div className="hero-note">
            <span aria-hidden="true">◆</span>
            Three Bounties. Hidden plans. One Reputation race.
          </div>
        </div>
      </div>
      <a className="scroll-cue" href="#hunt" aria-label="See how Last Hit works">
        <span>See how a round works</span>
        <ArrowDown size={18} />
      </a>
    </section>
  );
}

function GameOverview() {
  const steps = [
    ["01", "Choose", "Secretly select Bounty A, B, or C."],
    ["02", "Commit", "Choose 1–6 Attention. Reveal together."],
    ["03", "Position", "Use Priority to build each Attack Lineup."],
    ["04", "Attack", "Resolve attacks from Front to Back."],
    ["05", "Claim", "Defeat a monster to take its Bounty and Reputation."],
  ];

  return (
    <section id="hunt" className="section game-overview-section scroll-mt-20">
      <div className="mx-auto max-w-[90rem] px-5 lg:px-10">
        <header className="game-overview-heading" data-reveal>
          <div>
            <p className="eyebrow">What is Last Hit?</p>
            <h2 className="section-title">
              Competitive monster hunting.
              <span>Everyone plans at once.</span>
            </h2>
          </div>
          <p>
            Several Bounties are available. Every hunter secretly chooses where to hunt and how much
            Attention to commit. Rivals may meet at the same monster—or avoid one another
            completely.
          </p>
        </header>

        <div className="game-overview-table" data-reveal>
          <div className="game-overview-board">
            <img
              className="game-overview-board-art"
              src={`${ASSET_ROOT}/bounty-board.webp`}
              alt="Bounty Board with three active hunts"
              loading="lazy"
            />
            {[
              ["feral-imp-bounty", "Feral Imp", "a"],
              ["hill-ogre-bounty", "Hill Ogre", "b"],
              ["sandworm-bounty", "Sandworm", "c"],
            ].map(([slug, label, slot]) => (
              <img
                className={`game-overview-bounty game-overview-bounty-${slot}`}
                src={`${ASSET_ROOT}/components/${slug}.webp`}
                alt={`${label} Bounty in slot ${slot.toUpperCase()}`}
                loading="lazy"
                key={slug}
              />
            ))}
            {[
              ["green", "a", 0],
              ["purple", "b", 0],
              ["orange", "b", 1],
              ["blue", "c", 0],
            ].map(([color, slot, index]) => (
              <img
                className={`game-overview-pawn game-overview-pawn-${slot}`}
                src={`${ASSET_ROOT}/components/pieces/pawn-${color}.webp`}
                alt=""
                loading="lazy"
                style={{ "--overview-pawn": index } as CSSProperties}
                key={color}
              />
            ))}
          </div>
          <div className="game-overview-table-copy">
            <span>Active Bounties</span>
            <strong>2</strong>
            <small>with 2–3 hunters</small>
            <strong>3</strong>
            <small>with 4–6 hunters</small>
          </div>
        </div>

        <ol className="game-loop-steps" aria-label="How a round works" data-reveal>
          {steps.map(([number, title, body]) => (
            <li key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <small>{body}</small>
            </li>
          ))}
        </ol>

        <div className="game-overview-win" data-reveal>
          <div className="game-overview-claim">
            <img
              src={`${ASSET_ROOT}/components/feral-imp-bounty.webp`}
              alt="Claimed Feral Imp Bounty"
              loading="lazy"
            />
            <ArrowRight aria-hidden="true" />
            <div>
              <span>Your attack defeats the monster</span>
              <strong>Claim the Bounty.</strong>
              <strong>Gain its Reputation.</strong>
            </div>
          </div>
          <div className="game-overview-victory">
            <span>Victory Check</span>
            <strong>Most Reputation wins.</strong>
            <p>
              The game ends when a hunter has at least 15 Reputation or all Bounties have been
              claimed. Finish every Attack Lineup before checking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AttentionHook() {
  const plans = [
    {
      player: 2,
      color: "green",
      label: "Green",
      mat: "moss-troll",
      matLabel: "Moss Troll",
      commitment: 2,
      remaining: 4,
      order: "Places first",
      attentionAsset: "attention-2",
    },
    {
      player: 4,
      color: "purple",
      label: "Purple",
      mat: "hill-ogre",
      matLabel: "Hill Ogre",
      commitment: 4,
      remaining: 2,
      order: "Places second",
      attentionAsset: "attention-4",
    },
    {
      player: 6,
      color: "orange",
      label: "Orange",
      mat: "ember-drake",
      matLabel: "Ember Drake",
      commitment: 6,
      remaining: 0,
      order: "Places last",
      attentionAsset: "attention-6",
    },
  ];

  return (
    <section id="attention" className="section attention-hook-section scroll-mt-20">
      <div className="mx-auto max-w-[90rem] px-5 lg:px-10">
        <div className="attention-hook-intro" data-reveal>
          <div className="attention-resource-mark" aria-label="Each hunter manages 6 Attention">
            <div aria-hidden="true">
              {Array.from({ length: 6 }, (_, index) => (
                <img
                  src={`${ASSET_ROOT}/components/pieces/attention-cube.webp`}
                  alt=""
                  style={{ "--resource-cube": index } as CSSProperties}
                  key={index}
                />
              ))}
            </div>
            <strong>6</strong>
            <span>Attention per hunter</span>
          </div>
          <div className="attention-hook-heading">
            <p className="eyebrow">The decision behind every plan</p>
            <h2 className="section-title">
              How much Attention
              <span>will you commit?</span>
            </h2>
            <p className="attention-hook-explainer">
              Commitment determines Priority. Attention you keep remains available to reduce a
              rival&apos;s attack later in the round.
            </p>
            <div className="attention-hook-phrases" aria-label="How Attention works">
              <strong>Commit more → place later</strong>
              <strong>Keep more → interfere later</strong>
              <strong>All plans reveal together</strong>
            </div>
          </div>
        </div>

        <article
          id="attention-plan"
          className="attention-hook-chapter attention-plan-chapter scroll-mt-20"
          data-reveal
        >
          <header className="attention-chapter-heading">
            <span>Secret choice</span>
            <h3>Choose a Bounty and commit 1–6 Attention.</h3>
            <p>The table reveals together. Committed cubes become Spent.</p>
          </header>
          <div className="hook-plan-mats" aria-label="Three hunters reveal the same target">
            {plans.map((plan, planIndex) => (
              <HookPlanMat plan={plan} planIndex={planIndex} key={plan.color} />
            ))}
          </div>
          <p className="hook-stage-caption">
            These three hunters chose the same Bounty. Their commitments now determine Priority.
          </p>
        </article>

        <article
          id="attention-position"
          className="attention-hook-chapter attention-position-chapter scroll-mt-20"
          data-reveal
        >
          <div className="attention-position-visual">
            <p className="tableau-label">Example: three hunters chose the same Bounty</p>
            <div
              className="priority-placement-demo"
              role="img"
              aria-label="Example placement: Green committed 2 Attention, Purple committed 4, and Orange committed 6. Green places first. Purple places second and inserts at the Front, shifting Green back. Orange places last and inserts between them, shifting Green to third. The final lineup is Purple, Orange, then Green. Hunters may commit any amount from 1 to 6."
            >
              <div className="priority-order-demo" aria-hidden="true">
                <p className="priority-demo-heading">
                  <span>Step 1</span>
                  <strong>Determine placement order</strong>
                </p>
                <div className="priority-queue">
                  {plans.map((plan) => (
                    <div
                      className={`priority-queue-item priority-queue-${plan.color}`}
                      key={plan.color}
                    >
                      <span>{plan.order}</span>
                      <img
                        src={`${ASSET_ROOT}/components/pieces/pawn-${plan.color}.webp`}
                        alt=""
                        loading="lazy"
                      />
                      <div>
                        <strong>{plan.label}</strong>
                        <small>Committed {plan.commitment} Attention</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="attention-position-lineup" aria-hidden="true">
                <p className="priority-demo-heading">
                  <span>Step 2</span>
                  <strong>Build the Attack Lineup</strong>
                </p>
                <div className="hook-lineup">
                  <img
                    className="hook-lineup-art"
                    src={`${ASSET_ROOT}/components/attack-lineup.webp`}
                    alt=""
                    loading="lazy"
                  />
                  <div className="hook-lineup-pawns">
                    {plans.map((plan, index) => (
                      <span
                        className={`lineup-pawn lineup-pawn-${plan.color}`}
                        style={{ "--pawn-index": index } as CSSProperties}
                        key={plan.color}
                      >
                        <img
                          src={`${ASSET_ROOT}/components/pieces/pawn-${plan.color}.webp`}
                          alt=""
                          loading="lazy"
                        />
                        <small>{plan.commitment} ATT</small>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lineup-placement-steps" aria-hidden="true">
              <p>
                <strong>Placement order</strong>
                <span>Green → Purple → Orange</span>
              </p>
              <p>
                <strong>Green places first</strong>
                <span>At the Front</span>
              </p>
              <p>
                <strong>Purple inserts at Front</strong>
                <span>Green shifts Back</span>
              </p>
              <p>
                <strong>Orange inserts between them</strong>
                <span>Green shifts Back</span>
              </p>
              <p>
                <strong>Final Lineup</strong>
                <span>Purple → Orange → Green</span>
              </p>
            </div>
          </div>
          <div className="attention-position-copy">
            <span>Priority</span>
            <h3>More Attention means higher Priority—and later placement.</h3>
            <div className="priority-example-note">
              <strong>Commit any amount from 1–6.</strong>
              <span>This example uses 2, 4, and 6 to make the order easy to follow.</span>
            </div>
            <p>
              Qualifying hunters place in reverse Priority order. Each later hunter may insert at
              the Front, between rivals, or at the Back.
            </p>
          </div>
        </article>

        <article
          id="attention-split"
          className="attention-hook-chapter attention-split-chapter scroll-mt-20"
          data-reveal
        >
          <div className="attention-split-copy">
            <span>Split Attention</span>
            <h3>Saved Attention can reduce a rival&apos;s attack.</h3>
            <p>
              After Provisional Damage is announced, other hunters in that Attack Lineup may spend
              Available Attention. Each cube reduces the attack by 1 Damage.
            </p>
          </div>
          <div className="attention-split-table">
            <div className="split-bounty">
              <img
                src={`${ASSET_ROOT}/components/feral-imp-bounty.webp`}
                alt="Feral Imp Bounty with 4 Health and 2 Reputation"
                loading="lazy"
              />
              <div className="split-provisional">
                <span>Provisional Damage</span>
                <strong>4</strong>
              </div>
            </div>
            <div className="split-choice">
              <div className="split-choice-cubes" aria-hidden="true">
                {[0, 1].map((index) => (
                  <img
                    src={`${ASSET_ROOT}/components/pieces/attention-cube.webp`}
                    alt=""
                    style={{ "--split-cube": index } as CSSProperties}
                    key={index}
                  />
                ))}
              </div>
              <div className="interference-branches">
                <div>
                  <span>They hold</span>
                  <strong>4 Damage</strong>
                  <small>Feral Imp defeated</small>
                </div>
                <i aria-hidden="true">or</i>
                <div className="is-split">
                  <span>They Split 2</span>
                  <strong>2 Damage</strong>
                  <small>Feral Imp survives</small>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function HuntPressures() {
  const pressures = [
    {
      id: "bounties",
      eyebrow: "Choose where to compete",
      title: "Several Bounties are in play.",
      body: "Commit in secret and guess where your rivals will strike — crowd the same monster, or slip off to another.",
      images: ["moss-troll-bounty", "sandworm-bounty", "hill-ogre-bounty"],
    },
    {
      id: "boons",
      eyebrow: "Neglect",
      title: "Ignored Bounties gain Boons.",
      body: "A surviving Bounty that nobody targeted stages a face-down Boon for a future attacker.",
      images: ["boons/damage", "boons/reroll", "boons/extra-die"],
    },
    {
      id: "momentum",
      eyebrow: "Dice and Momentum",
      title: "Attacks are uncertain. Momentum adds control.",
      body: "Spend Momentum before rolling. Each token adds 1 Damage to the attack.",
      images: ["pieces/die", "momentum"],
    },
    {
      id: "behaviors",
      eyebrow: "Monster Behaviors",
      title: "Most monsters change how they are hunted.",
      body: "Behaviors can alter targeting, damage, positioning, or what happens when a monster survives.",
      images: ["crystal-basilisk-bounty", "stone-golem-bounty", "ember-drake-bounty"],
    },
  ];

  return (
    <section className="section hunt-pressures-section">
      <div className="mx-auto max-w-[90rem] px-5 lg:px-10">
        <header className="hunt-pressures-heading" data-reveal>
          <p className="eyebrow">What changes from hunt to hunt</p>
          <h2 className="section-title">
            Choose your target.
            <span>Manage the risks.</span>
          </h2>
          <p>
            Attention decides where you stand. The Bounties, dice, Boons, and Monster Behaviors
            decide what that position is worth.
          </p>
        </header>
        <div className="hunt-pressure-grid">
          {pressures.map((pressure) => (
            <article
              className={`hunt-pressure hunt-pressure-${pressure.id}`}
              data-reveal
              key={pressure.id}
            >
              <div className="hunt-pressure-art" aria-hidden="true">
                {pressure.images.map((image) => (
                  <img
                    src={`${ASSET_ROOT}/components/${image}.webp`}
                    alt=""
                    loading="lazy"
                    key={image}
                  />
                ))}
              </div>
              <div>
                <span>{pressure.eyebrow}</span>
                <h3>{pressure.title}</h3>
                <p>{pressure.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HookPlanMat({
  plan,
  planIndex,
}: {
  plan: {
    player: number;
    color: string;
    label: string;
    mat: string;
    matLabel: string;
    commitment: number;
    remaining: number;
    order: string;
    attentionAsset: string;
  };
  planIndex: number;
}) {
  return (
    <figure
      className={`hook-hunter-plan hook-plan-${plan.color}`}
      style={{ "--plan-index": planIndex } as CSSProperties}
    >
      <div className="hook-hunter-mat">
        <img
          className="hook-hunter-mat-art"
          src={`${ASSET_ROOT}/mats/${plan.mat}.webp`}
          alt={`${plan.matLabel} Hunter Mat`}
          loading="lazy"
        />
        <div className="hook-mat-plan-cards">
          <FlipCard
            back={`${ASSET_ROOT}/cards/players/${plan.player}/target-back.webp`}
            front={`${ASSET_ROOT}/cards/players/${plan.player}/target-b.webp`}
            alt={`${plan.label} reveals Target B`}
          />
          <FlipCard
            back={`${ASSET_ROOT}/cards/players/${plan.player}/attention-back.webp`}
            front={`${ASSET_ROOT}/cards/players/${plan.player}/${plan.attentionAsset}.webp`}
            alt={`${plan.label} commits ${plan.commitment} Attention`}
          />
        </div>
        <div className="hook-mat-attention" aria-label={`${plan.commitment} Attention committed`}>
          {Array.from({ length: 6 }, (_, index) => (
            <img
              className={index < plan.commitment ? "is-committed" : "is-saved"}
              src={`${ASSET_ROOT}/components/pieces/attention-cube.webp`}
              alt=""
              style={{ "--attention-index": index } as CSSProperties}
              key={index}
            />
          ))}
        </div>
      </div>
      <figcaption>
        <strong>{plan.commitment} committed</strong>
        <span>{plan.remaining} saved</span>
      </figcaption>
    </figure>
  );
}

function FlipCard({ back, front, alt }: { back: string; front: string; alt: string }) {
  return (
    <div className="hook-card-flip">
      <div className="hook-card-inner">
        <img className="hook-card-back" src={back} alt="" loading="lazy" />
        <img className="hook-card-front" src={front} alt={alt} loading="lazy" />
      </div>
    </div>
  );
}

function Rulebook() {
  return (
    <section id="rulebook" className="section rulebook-section scroll-mt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div data-reveal>
          <p className="eyebrow">Official rulebook · Version 2.1</p>
          <h2 className="section-title">
            Learn the standard game.
            <span>Add optional modes.</span>
          </h2>
          <p className="rulebook-copy">
            Setup, all ten phases, Monster Behaviors, victory, Guild Roles, Achievements, and
            alternate modes.
          </p>
          <a className="button button-gold" href={RULEBOOK_URL} target="_blank" rel="noreferrer">
            <BookOpen size={18} />
            Read rulebook v2.1
          </a>
        </div>
        <div className="rulebook-spread" data-reveal aria-label="Preview pages from the rulebook">
          {[1, 12, 14].map((page) => (
            <img
              key={page}
              src={`${ASSET_ROOT}/rulebook/page-${page}.webp`}
              alt={`Last Hit rulebook page ${page}`}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ComponentLadder() {
  return (
    <section id="box" className="component-ladder scroll-mt-20">
      <header className="component-ladder-heading mx-auto max-w-[90rem] px-5 lg:px-10" data-reveal>
        <div className="component-ladder-heading-copy">
          <p className="eyebrow">Inside Last Hit</p>
          <h2 className="section-title">
            See every component
            <span>in the core box.</span>
          </h2>
        </div>
        <div className="component-ladder-box-art">
          <img
            src={`${ASSET_ROOT}/game-box.webp`}
            alt="Last Hit board game box"
            width="1254"
            height="1254"
            loading="lazy"
          />
        </div>
      </header>
      <PlayerComponents />
      <HunterMats />
      <AttentionCubes />
      <BountyBoard />
      <BountyCards />
      <TokenSupplies />
      <Boons />
      <FirstHunter />
      <GuildRoles />
      <Achievements />
    </section>
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
        <img
          className="player-set-pawn"
          src={`${ASSET_ROOT}/components/pieces/pawn-${selected.color}.webp`}
          alt={`${selected.label} Hunter pawn`}
          loading="lazy"
        />
        <img
          className="player-set-cube"
          src={`${ASSET_ROOT}/components/pieces/cube-${selected.color}.webp`}
          alt={`${selected.label} Reputation cube`}
          loading="lazy"
        />
      </div>
      <ComponentCopy eyebrow="Six player sets" title="Choose a Bounty. Commit Attention.">
        <p className="component-punch-line">
          Each player set includes a Target deck, Attention deck, pawn, and Reputation cube.
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

function HunterMats() {
  const { index, cycling, cycle } = useRotatingIndex(mats.length);
  const visible = getVisibleItems(mats, index);

  return (
    <ComponentRow className="hunter-mats-row" visualSide="right">
      <ComponentCopy eyebrow="12 Hunter Mats" title="Plan cards. Attention. Cooldowns.">
        <p className="component-punch-line">
          Each mat has spaces for your Target and Attention cards, Available and Spent Attention,
          and PRE cooldown.
        </p>
        <CycleControl
          label="Cycle Hunter Mats"
          itemName={mats[index].label}
          position={`${index + 1} of ${mats.length}`}
          disabled={cycling}
          onClick={cycle}
        />
      </ComponentCopy>
      <OffsetStack items={visible} cycling={cycling} kind="mats" />
    </ComponentRow>
  );
}

function AttentionCubes() {
  return (
    <ComponentRow id="attention-cubes" className="attention-cubes-row" visualSide="left">
      <div
        className="attention-mat-detail"
        aria-label="4 Available Attention and 2 Spent Attention"
      >
        <img
          className="attention-mat-detail-art"
          src={`${ASSET_ROOT}/mats/grave-hound.webp`}
          alt="Grave Hound Hunter Mat Available and Spent Attention areas"
          loading="lazy"
        />
        <div className="attention-mat-detail-cubes" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <img
              className={index < 4 ? "is-available" : "is-spent"}
              src={`${ASSET_ROOT}/components/pieces/attention-cube.webp`}
              alt=""
              loading="lazy"
              key={index}
            />
          ))}
        </div>
        <div className="attention-mat-detail-counts">
          <span>
            <strong>4</strong> Available
          </span>
          <span>
            <strong>2</strong> Spent
          </span>
        </div>
      </div>
      <ComponentCopy eyebrow="45 Attention Cubes" title="Manage your Attention each round.">
        <p className="component-punch-line">
          Move cubes between Available and Spent on your Hunter Mat.
        </p>
      </ComponentCopy>
    </ComponentRow>
  );
}

function BountyBoard() {
  const [active, setActive] = useState(boardHotspots[0].id);
  const activeHotspot = boardHotspots.find((hotspot) => hotspot.id === active) ?? boardHotspots[0];

  return (
    <ComponentRow className="bounty-board-row" visualSide="right">
      <ComponentCopy
        eyebrow="1 Bounty Board"
        title="Track Bounties, lineups, Boons, and Reputation."
      >
        <div className="board-hotspot-legend" aria-label="Bounty Board areas">
          {boardHotspots.map((hotspot) => (
            <button
              type="button"
              aria-pressed={active === hotspot.id}
              onMouseEnter={() => setActive(hotspot.id)}
              onFocus={() => setActive(hotspot.id)}
              onClick={() => setActive(hotspot.id)}
              key={hotspot.id}
            >
              <i aria-hidden="true" />
              <span>
                <strong>{hotspot.label}</strong>
                <small>{hotspot.detail}</small>
              </span>
            </button>
          ))}
        </div>
        <p className="board-active-label" aria-live="polite">
          <strong>{activeHotspot.label}</strong>
          <span>{activeHotspot.detail}</span>
        </p>
      </ComponentCopy>
      <div className="board-inspection">
        <img
          src={`${ASSET_ROOT}/bounty-board.webp`}
          alt="Finished Last Hit Bounty Board"
          loading="lazy"
        />
        {boardHotspots.map((hotspot) => (
          <button
            type="button"
            className={`board-hotspot-dot ${active === hotspot.id ? "is-active" : ""}`}
            style={{ "--hotspot-x": hotspot.x, "--hotspot-y": hotspot.y } as CSSProperties}
            aria-label={`${hotspot.label}: ${hotspot.detail}`}
            aria-pressed={active === hotspot.id}
            onMouseEnter={() => setActive(hotspot.id)}
            onFocus={() => setActive(hotspot.id)}
            onClick={() => setActive(hotspot.id)}
            key={hotspot.id}
          >
            <span />
          </button>
        ))}
      </div>
    </ComponentRow>
  );
}

function BountyCards() {
  const { index, cycling, busy, cycle } = useRotatingIndex(bounties.length, 500);
  const visible = getVisibleItems(bounties, index);

  useEffect(() => {
    const nextCard = new Image();
    nextCard.decoding = "async";
    nextCard.src = bounties[(index + visible.length) % bounties.length].src;
    void nextCard.decode().catch(() => undefined);
  }, [index, visible.length]);

  return (
    <ComponentRow className="bounty-cards-row" visualSide="left">
      <OffsetStack items={visible} cycling={cycling} kind="bounties" />
      <ComponentCopy eyebrow="30 Monster Bounties" title="Stats, Reputation, and Monster Behavior.">
        <p className="component-punch-line">
          If the monster survives the round, resolve the Behavior printed on its card.
        </p>
        <CycleControl
          label="Cycle Bounty cards"
          itemName={bounties[index].label}
          position={`${index + 1} of ${bounties.length} shown`}
          disabled={busy}
          onClick={cycle}
        />
      </ComponentCopy>
    </ComponentRow>
  );
}

function TokenSupplies() {
  return (
    <ComponentRow className="token-supplies-row" visualSide="right">
      <ComponentCopy eyebrow="71 Damage & Momentum Tokens" title="Damage. Momentum.">
        <div className="token-copy-lines">
          <span>Damage stays.</span>
          <span>Momentum boosts attacks.</span>
        </div>
        <div className="component-count-pair">
          <strong>71</strong> Damage &amp; Momentum
        </div>
      </ComponentCopy>
      <div className="token-pile-stage">
        <TokenPile
          className="damage-one-pile"
          label="1 Damage"
          assets={["damage-1", "damage-1", "damage-1", "damage-1", "damage-1"]}
        />
        <TokenPile
          className="damage-three-pile"
          label="3 Damage"
          assets={["damage-3", "damage-3", "damage-3", "damage-3"]}
        />
        <TokenPile
          className="momentum-pile"
          label="Momentum"
          assets={["momentum", "momentum", "momentum", "momentum"]}
        />
      </div>
    </ComponentRow>
  );
}

function Boons() {
  const boonFaces = [
    ["extra-attention", "Gain 1 Attention Boon"],
    ["extra-attention-2", "Gain 2 Attention Boon"],
    ["reroll", "Reroll Boon"],
    ["extra-die", "Extra die Boon"],
    ["refresh", "Refresh Boon"],
    ["damage", "Damage Boon"],
  ];

  return (
    <ComponentRow id="boons" className="boons-row" visualSide="left">
      <div
        className="boon-showcase"
        aria-label="One face-down Boon and all six possible Boon faces"
      >
        <figure className="boon-back-feature">
          <img
            src={`${ASSET_ROOT}/components/boons/back.webp`}
            alt="Face-down Boon token"
            loading="lazy"
          />
          <figcaption>Face-down</figcaption>
        </figure>
        <div className="boon-face-scatter">
          {boonFaces.map(([asset, label], index) => (
            <img
              src={`${ASSET_ROOT}/components/boons/${asset}.webp`}
              alt={label}
              loading="lazy"
              style={{ "--boon-delay": `${index * 70}ms` } as CSSProperties}
              key={asset}
            />
          ))}
        </div>
      </div>
      <ComponentCopy eyebrow="45 Boon Tokens" title="Six possible Boon effects.">
        <p className="component-punch-line">
          Neglected Bounties collect face-down Boons. Hunters draw them as that Attack Lineup
          resolves.
        </p>
      </ComponentCopy>
    </ComponentRow>
  );
}

function TokenPile({
  className,
  label,
  assets,
}: {
  className: string;
  label: string;
  assets: string[];
}) {
  return (
    <div className={`token-pile ${className}`}>
      <span>{label}</span>
      {assets.map((asset, index) => (
        <img
          src={`${ASSET_ROOT}/components/${asset}.webp`}
          alt=""
          loading="lazy"
          style={{ "--token-delay": `${index * 70}ms` } as CSSProperties}
          key={`${asset}-${index}`}
        />
      ))}
    </div>
  );
}

function FirstHunter() {
  return (
    <ComponentRow className="first-hunter-row" visualSide="right">
      <ComponentCopy eyebrow="1 First Hunter Token" title="Break ties. Pass it on." />
      <div className="first-hunter-stage">
        <div aria-hidden="true" />
        <img
          src={`${ASSET_ROOT}/components/first-hunter.webp`}
          alt="First Hunter token"
          loading="lazy"
        />
      </div>
    </ComponentRow>
  );
}

function GuildRoles() {
  return (
    <ComponentRow className="guild-roles-row" visualSide="left">
      <div className="ladder-card-fan role-card-fan">
        {[
          ["berserker", "Berserker Guild Role"],
          ["veteran", "Veteran Guild Role"],
          ["strategist", "Strategist Guild Role"],
        ].map(([role, label]) => (
          <img
            src={`${ASSET_ROOT}/modes/guild-roles/${role}.webp`}
            alt={label}
            loading="lazy"
            key={role}
          />
        ))}
      </div>
      <ComponentCopy
        eyebrow="9 Guild Roles"
        title="Use an ability. Exhaust the Role. PREPARE to refresh."
      />
    </ComponentRow>
  );
}

function Achievements() {
  return (
    <ComponentRow className="achievements-row" visualSide="right">
      <ComponentCopy eyebrow="13 Achievements" title="Bonus objectives reward extra Reputation.">
        <p className="component-punch-line">
          Achievements add decisions beyond claiming Bounties. Only the hunter who fulfills the last
          requirement earns the reward.
        </p>
      </ComponentCopy>
      <div className="ladder-card-fan achievement-card-fan">
        {[
          ["attention", "Dying for Attention Achievement"],
          ["leader", "Leader of the Pack Achievement"],
          ["adrenaline", "Adrenaline Achievement"],
          ["hitter", "Heavy Hitter Achievement"],
          ["special", "Something Special Achievement"],
        ].map(([achievement, label]) => (
          <img
            src={`${ASSET_ROOT}/modes/achievements/${achievement}.webp`}
            alt={label}
            loading="lazy"
            key={achievement}
          />
        ))}
      </div>
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

function OffsetStack({
  items,
  cycling,
  kind,
}: {
  items: Array<{ src: string; alt: string; label: string }>;
  cycling: boolean;
  kind: "mats" | "bounties";
}) {
  return (
    <div
      className={`offset-stack offset-stack-${kind} ${cycling ? "is-cycling" : ""}`}
      aria-label={`${items[0].label} and upcoming ${kind}`}
    >
      {items.map((item, index) => (
        <img
          src={item.src}
          alt={index === 0 ? item.alt : ""}
          loading="lazy"
          style={{ "--stack-index": index } as CSSProperties}
          key={item.src}
        />
      ))}
    </div>
  );
}

function CycleControl({
  label,
  itemName,
  position,
  disabled,
  onClick,
}: {
  label: string;
  itemName: string;
  position: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="cycle-control">
      <p aria-live="polite">
        <strong>{itemName}</strong>
        <span>{position}</span>
      </p>
      <button type="button" onClick={onClick} disabled={disabled} aria-label={label}>
        <RotateCcw />
        Cycle
      </button>
    </div>
  );
}

function useRotatingIndex(length: number, settleDuration = 0) {
  const [index, setIndex] = useState(0);
  const [cycling, setCycling] = useState(false);
  const [settling, setSettling] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    },
    [],
  );

  const cycle = () => {
    if (cycling || settling) return;
    if (reducedMotion) {
      setIndex((current) => (current + 1) % length);
      return;
    }
    setCycling(true);
    timerRef.current = setTimeout(() => {
      setIndex((current) => (current + 1) % length);
      setCycling(false);
      if (settleDuration > 0) {
        setSettling(true);
        settleTimerRef.current = setTimeout(() => {
          setSettling(false);
        }, settleDuration);
      }
    }, 420);
  };

  return { index, cycling, busy: cycling || settling, cycle };
}

function getVisibleItems<T>(items: T[], start: number) {
  return Array.from({ length: Math.min(4, items.length) }, (_, offset) => {
    return items[(start + offset) % items.length];
  });
}

function Playtest() {
  return (
    <section id="playtest" className="section playtest-section scroll-mt-20">
      <div className="playtest-art" aria-hidden="true">
        <img src={`${ASSET_ROOT}/mats/ember-drake.webp`} alt="" loading="lazy" />
      </div>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="relative z-10" data-reveal>
          <p className="eyebrow">Playtesters wanted</p>
          <h2 className="section-title">
            Help us test
            <span>Last Hit.</span>
          </h2>
          <p>
            Play the current build and tell us what is clear, confusing, balanced, or unexpectedly
            strong.
          </p>
        </div>
        <div className="playtest-form-card" data-reveal>
          <h3>Request a seat at the table</h3>
          <p>We&apos;ll contact you about upcoming playtests and launch progress.</p>
          <SignupForm
            interests={["playtest", "updates"]}
            source="playtest"
            buttonLabel="Join the playtest list"
            stacked
          />
        </div>
      </div>
    </section>
  );
}

function FinalCallToAction() {
  return (
    <section className="final-cta section">
      <div className="final-crest" aria-hidden="true">
        <img src={`${ASSET_ROOT}/crest.webp`} alt="" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center" data-reveal>
        <p className="eyebrow justify-center">Launch updates</p>
        <h2 className="section-title">
          Follow
          <span>Last Hit.</span>
        </h2>
        <p>Get launch news, finished-art updates, and future playtest announcements by email.</p>
        <div className="final-signup">
          <SignupForm interests={["updates"]} source="final-cta" buttonLabel="Get launch updates" />
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
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
        <a href="https://cirestudios.dev" target="_blank" rel="noreferrer">
          Cire Studios <ArrowRight size={14} />
        </a>
      </div>
    </footer>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="hero-stat">
      <span>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  );
}
