import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Twitter, Youtube, MessagesSquare, Menu, X, FileDown } from "lucide-react";
import { SignupModal, type SignupInterest } from "@/components/SignupModal";

import coverAsset from "@/assets/cover.webp.asset.json";
import boardAsset from "@/assets/board.webp.asset.json";
import playerBoardAsset from "@/assets/player-board.webp.asset.json";
import sigilAsset from "@/assets/sigil.webp.asset.json";
import rulebookAsset from "@/assets/rulebook.pdf.asset.json";

import sceneTroll from "@/assets/scene-troll.webp.asset.json";
import sceneDrake from "@/assets/scene-drake.webp.asset.json";
import sceneBasilisk from "@/assets/scene-basilisk.webp.asset.json";
import sceneHydra from "@/assets/scene-hydra.webp.asset.json";

import cardA from "@/assets/card-a.webp.asset.json";
import cardB from "@/assets/card-b.webp.asset.json";
import cardC from "@/assets/card-c.webp.asset.json";
import card3 from "@/assets/card-3.webp.asset.json";
import cardBackTarget from "@/assets/card-back-target.webp.asset.json";
import cardBackAttention from "@/assets/card-back-attention.webp.asset.json";

import boonReroll from "@/assets/boon-reroll.webp.asset.json";
import boonExtraDice from "@/assets/boon-extra-dice.webp.asset.json";
import boonDamage from "@/assets/boon-damage.webp.asset.json";
import boonRefresh from "@/assets/boon-refresh.webp.asset.json";
import boonAttention from "@/assets/boon-attention.webp.asset.json";

import bFeralImp from "@/assets/b-feral-imp.webp.asset.json";
import bRazorwingHarpy from "@/assets/b-razorwing-harpy.webp.asset.json";
import bIronhideBoar from "@/assets/b-ironhide-boar.webp.asset.json";
import bGraveHound from "@/assets/b-grave-hound.webp.asset.json";
import bMossTroll from "@/assets/b-moss-troll.webp.asset.json";
import bGildedManticore from "@/assets/b-gilded-manticore.webp.asset.json";
import bStoneGolem from "@/assets/b-stone-golem.webp.asset.json";
import bCrystalBasilisk from "@/assets/b-crystal-basilisk.webp.asset.json";
import bMireHydra from "@/assets/b-mire-hydra.webp.asset.json";
import bEmberDrake from "@/assets/b-ember-drake.webp.asset.json";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Last Hit — A Bounty-Hunter Board Game by Cire Studios" },
      {
        name: "description",
        content:
          "Last Hit is a 2–6 player bounty-hunter board game of secret plans, split attention, and the killing blow. See the art, mechanics, and components — and sign up for launch updates.",
      },
      { property: "og:title", content: "Last Hit — A Bounty-Hunter Board Game" },
      {
        property: "og:description",
        content:
          "Everyone fights. Only one gains glory. A 2–6 player game of secret plans, split attention, and the killing blow.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const mechanics = [
  {
    step: "I",
    title: "Program in Secret",
    body: "Pair a Target card (A/B/C) with an Attention card (1–6). Nobody sees your plan until the reveal.",
  },
  {
    step: "II",
    title: "Position the Lineup",
    body: "Lowest Attention places into the lineup first — blind. Highest Attention places last, slotting anywhere they want once every rival is committed.",
  },
  {
    step: "III",
    title: "Split Attention",
    body: "After a rival rolls, the table may spend Attention to shave damage away and steal the killing blow.",
  },
  {
    step: "IV",
    title: "Land the Last Hit",
    body: "Damage stays on the monster. Only the hunter who lands the final strike claims the Reputation.",
  },
];

const bounties = [
  { img: bFeralImp.url, name: "Feral Imp", tier: "Minor", hp: 4, rep: 2 },
  { img: bRazorwingHarpy.url, name: "Razorwing Harpy", tier: "Minor", hp: 4, rep: 2 },
  { img: bIronhideBoar.url, name: "Ironhide Boar", tier: "Standard", hp: 5, rep: 3 },
  { img: bGraveHound.url, name: "Grave Hound", tier: "Standard", hp: 5, rep: 3 },
  { img: bMossTroll.url, name: "Moss Troll", tier: "Premium", hp: 6, rep: 4 },
  { img: bGildedManticore.url, name: "Gilded Manticore", tier: "Premium", hp: 5, rep: 4 },
  { img: bStoneGolem.url, name: "Stone Golem", tier: "Premium", hp: 7, rep: 4 },
  { img: bCrystalBasilisk.url, name: "Crystal Basilisk", tier: "Elite", hp: 7, rep: 5 },
  { img: bMireHydra.url, name: "Mire Hydra", tier: "Elite", hp: null, rep: 5 },
  { img: bEmberDrake.url, name: "Ember Drake", tier: "Legendary", hp: 9, rep: 6 },
];

const scenes = [
  { img: sceneTroll.url, label: "The Moss Fens" },
  { img: sceneDrake.url, label: "Emberreach" },
  { img: sceneBasilisk.url, label: "The Glass Hollow" },
  { img: sceneHydra.url, label: "Mirewater" },
];

const boons = [
  { img: boonReroll.url, label: "Reroll" },
  { img: boonExtraDice.url, label: "Extra Die" },
  { img: boonDamage.url, label: "+1 Damage" },
  { img: boonRefresh.url, label: "Refresh" },
  { img: boonAttention.url, label: "+1 Attention" },
];

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState<string>("hero");
  const [modalDefaults, setModalDefaults] = useState<SignupInterest[]>(["updates"]);

  const openSignup = (source: string, defaults: SignupInterest[] = ["updates"]) => {
    setModalSource(source);
    setModalDefaults(defaults);
    setMenuOpen(false);
    setModalOpen(true);
  };

  const navLinks: Array<[string, string]> = [
    ["#contract", "The Game"],
    ["#mechanics", "Mechanics"],
    ["#bounties", "Bounties"],
    ["#components", "Components"],
    ["#in-development", "Progress"],
  ];

  return (
    <main className="plank-bg min-h-screen overflow-x-hidden text-foreground">
      {/* STICKY NAV */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="#top" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <img
              src={sigilAsset.url}
              alt=""
              width={40}
              height={40}
              className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
            />
            <span className="text-display truncate text-[0.65rem] uppercase tracking-[0.25em] text-lantern sm:text-sm sm:tracking-[0.3em]">
              Last Hit
            </span>
          </a>
          <div className="hidden gap-7 text-xs uppercase tracking-widest text-muted-foreground lg:flex">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className="transition hover:text-lantern">
                {label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => openSignup("nav", ["updates"])}
            className="text-display hidden shrink-0 rounded-sm border border-lantern/40 bg-lantern/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lantern transition hover:bg-lantern/20 lg:inline-block"
          >
            Get Notified
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="shrink-0 rounded-sm border border-lantern/40 p-2 text-lantern lg:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
        {menuOpen && (
          <div className="absolute inset-x-0 top-full border-b border-border/40 bg-background/95 shadow-[var(--shadow-plank)] backdrop-blur-md lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-sm uppercase tracking-widest text-muted-foreground">
              {navLinks.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-sm px-3 py-3 hover:bg-lantern/10 hover:text-lantern"
                >
                  {label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => openSignup("nav-mobile", ["updates"])}
                className="text-display rounded-sm border border-lantern/40 bg-lantern/10 px-3 py-3 text-left uppercase tracking-widest text-lantern hover:bg-lantern/20"
              >
                Get Notified
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden pt-20 sm:pt-24">
        <img
          src={sceneTroll.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
        <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-lantern)" }} />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div className="min-w-0">
            <p className="text-display text-[0.65rem] uppercase tracking-[0.4em] text-lantern/80 sm:text-xs sm:tracking-[0.5em]">
              A Cire Studios Board Game · In Development
            </p>
            <h1 className="text-display ember-glow mt-5 text-5xl font-bold leading-[0.95] text-foreground sm:text-7xl lg:text-8xl">
              LAST HIT
            </h1>
            <p className="mt-5 max-w-xl text-xl italic text-parchment sm:text-2xl">
              Everyone fights. Only one gains glory.
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Damage stays on every monster you strike — but the Reputation goes to the hunter who
              lands the final blow. Commit your Attention in secret, shape the attack lineup, and
              split your rivals' focus at exactly the right moment.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-5 sm:grid-cols-4">
              <Stat label="Hunters" value="2–6" />
              <Stat label="Playtime" value="35–60m" />
              <Stat label="Age" value="12+" />
              <Stat label="Weight" value="Medium" />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => openSignup("hero", ["updates"])}
                className="text-display rounded-sm px-7 py-4 text-xs uppercase tracking-[0.28em] text-primary-foreground shadow-[var(--shadow-lantern)] transition hover:brightness-110 sm:text-sm"
                style={{ background: "var(--gradient-ember)" }}
              >
                Get Launch Updates
              </button>
              <a
                href={rulebookAsset.url}
                download="Last-Hit-Rulebook.pdf"
                className="text-display inline-flex items-center justify-center gap-3 rounded-sm border border-lantern/40 px-7 py-4 text-xs uppercase tracking-[0.28em] text-lantern transition hover:bg-lantern/10 sm:text-sm"
              >
                <FileDown size={16} strokeWidth={1.75} />
                Read the Rulebook
              </a>
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="overflow-hidden rounded-sm shadow-[var(--shadow-plank)]">
              <img
                src={coverAsset.url}
                alt="Last Hit board game cover: two hunters studying a lantern-lit bounty board"
                width={1080}
                height={1350}
                className="w-full"
              />
            </div>
          </figure>
        </div>
      </section>

      {/* CONTRACT / PITCH */}
      <section id="contract" className="relative border-t border-border/60 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 sm:px-6 md:grid-cols-[1.15fr_1fr] md:items-start md:gap-14">
          <div className="min-w-0">
            <p className="text-display text-[0.65rem] uppercase tracking-[0.4em] text-ember sm:text-xs sm:tracking-[0.5em]">
              § 1 — The Game
            </p>
            <h2 className="text-display mt-4 text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
              Hunt together.
              <br />
              <span className="italic text-lantern">Betray at the last second.</span>
            </h2>
            <p className="mt-7 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Every attack draws the table closer to a payday, and every attack might hand that
              payday to somebody else. Bargain, bluff, and time the killing blow.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              First hunter to 15 Reputation earns the title of{" "}
              <span className="italic text-lantern">Master Hunter</span>.
            </p>

            <figure className="mt-10 overflow-hidden rounded-sm shadow-[var(--shadow-plank)]">
              <img
                src={boardAsset.url}
                alt="The Last Hit central board with three bounty lanes and a reputation track"
                width={1800}
                height={914}
                loading="lazy"
                className="w-full"
              />
              <figcaption className="bg-background/70 px-4 py-3 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
                The central bounty board — three lanes, one reputation track
              </figcaption>
            </figure>
          </div>

          <ParchmentCard>
            <p className="text-display text-[0.65rem] uppercase tracking-[0.3em] text-ember sm:text-xs sm:tracking-[0.35em]">
              Round Sequence
            </p>
            <ol className="mt-6 space-y-3 text-ink">
              {[
                ["Recover", "Reclaim up to 2 Attention."],
                ["Program", "Secretly pair Target + Attention."],
                ["Reveal", "Cards flip. Attention is spent."],
                ["Position", "Low Attention slots first; High slots last, anywhere."],
                ["Hunt", "Boon → Momentum → Roll → Split."],
                [
                  "Claim",
                  "Killing blow takes the glory. Otherwise damage carries into the next round.",
                ],
              ].map(([name, body], i) => (
                <li key={name} className="flex gap-4 border-b border-ink/10 pb-3 last:border-0">
                  <span className="text-display w-6 shrink-0 text-lg text-wax">{i + 1}</span>
                  <div className="min-w-0">
                    <div className="text-display text-sm uppercase tracking-wider">{name}</div>
                    <div className="text-sm italic text-ink/70">{body}</div>
                  </div>
                </li>
              ))}
            </ol>
          </ParchmentCard>
        </div>
      </section>

      {/* MECHANICS */}
      <section
        id="mechanics"
        className="relative border-y border-border/60 bg-card/40 py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="text-center">
            <p className="text-display text-[0.65rem] uppercase tracking-[0.4em] text-ember sm:text-xs sm:tracking-[0.5em]">
              § 2 — How It Plays
            </p>
            <h2 className="text-display mt-4 text-3xl text-foreground sm:text-4xl md:text-5xl">
              Four Decisions Per Round
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              What turns a cooperative monster hunt into an open contract nobody trusts.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mechanics.map((m) => (
              <div
                key={m.title}
                className="group relative rounded-sm border border-border bg-background/60 p-6 backdrop-blur-sm transition hover:border-lantern/60"
              >
                <div className="text-display absolute -top-4 left-6 rounded-sm bg-background px-3 py-1 text-xs uppercase tracking-[0.3em] text-lantern">
                  Step {m.step}
                </div>
                <h3 className="text-display mt-4 text-xl text-foreground">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
              </div>
            ))}
          </div>

          {/* Cards showcase */}
          <div className="mt-16 grid grid-cols-1 items-center gap-10 rounded-sm border border-border bg-background/40 p-6 sm:p-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="min-w-0">
              <h3 className="text-display text-xl uppercase tracking-[0.2em] text-lantern">
                Target + Attention
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Each hunter holds a Target deck (A, B, C — one per bounty lane) and an Attention
                deck numbered 1 through 6. Every round you commit one of each, face down. The
                Attention you spend is gone until you Recover it.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Spend big and you dictate where you land in the attack lineup. Spend small and you
                keep resources for the Split — shaving damage off a rival's roll to steal the
                killing blow.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
              {[
                { img: cardA.url, label: "Target A" },
                { img: cardB.url, label: "Target B" },
                { img: cardC.url, label: "Target C" },
                { img: card3.url, label: "Attention 3" },
                { img: cardBackTarget.url, label: "Target back" },
                { img: cardBackAttention.url, label: "Attention back" },
              ].map((c, i) => (
                <img
                  key={c.label}
                  src={c.img}
                  alt={`${c.label} card`}
                  loading="lazy"
                  className="w-full rounded-[3px] shadow-[var(--shadow-plank)] transition hover:-translate-y-1"
                  style={{ transform: `rotate(${((i % 3) - 1) * 2}deg)` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 rounded-sm border border-border bg-background/40 p-6 sm:p-8 md:grid-cols-3">
            <MechanicHighlight
              title="Attention is Currency"
              body="Six cards. That's all you have. Spend them to strike, to shave a rival's damage, or to buy your position in the lineup."
            />
            <MechanicHighlight
              title="Boons Reward Patience"
              body="Ignored monsters grow more dangerous — and more rewarding. Reroll, Extra Die, +1 Damage, Refresh, +1 Attention."
            />
            <MechanicHighlight
              title="Momentum Compounds"
              body="Land a non-lethal hit, bank the tension. Cash it in as +1 damage per token when the final strike is on the table."
            />
          </div>
        </div>
      </section>

      {/* BOUNTIES */}
      <section id="bounties" className="relative py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="text-center">
            <p className="text-display text-[0.65rem] uppercase tracking-[0.4em] text-ember sm:text-xs sm:tracking-[0.5em]">
              § 3 — Wanted
            </p>
            <h2 className="text-display mt-4 text-3xl text-foreground sm:text-4xl md:text-5xl">
              The Bounty Roster
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              From feral imps to legendary drakes. The richer the Reputation, the more hunters a
              contract attracts — and the harder it is to land the last hit yourself.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-5 sm:gap-7 md:grid-cols-3 lg:grid-cols-5">
            {bounties.map((b) => (
              <figure key={b.name} className="group min-w-0">
                <div className="overflow-hidden rounded-sm transition group-hover:-translate-y-1">
                  <img
                    src={b.img}
                    alt={`${b.name} bounty card`}
                    width={900}
                    height={1500}
                    loading="lazy"
                    className="w-full"
                  />
                </div>
                <figcaption className="mt-3 text-center">
                  <div className="text-display text-sm text-foreground sm:text-base">{b.name}</div>
                  <div className="text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground/70">
                    {b.tier} Bounty
                  </div>
                  <div className="mt-1.5 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {b.hp !== null && (
                      <span>
                        <span className="text-ember">♥</span> {b.hp}
                      </span>
                    )}
                    <span>
                      <span className="text-lantern">◆</span> {b.rep} Rep
                    </span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* COMPONENTS */}
      <section id="components" className="relative border-y border-border/60 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="text-center">
            <p className="text-display text-[0.65rem] uppercase tracking-[0.4em] text-ember sm:text-xs sm:tracking-[0.5em]">
              § 4 — In the Box
            </p>
            <h2 className="text-display mt-4 text-3xl text-foreground sm:text-4xl md:text-5xl">
              What You'll Unpack
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <figure className="overflow-hidden rounded-sm shadow-[var(--shadow-plank)]">
              <img
                src={playerBoardAsset.url}
                alt="A Last Hit hunter player board showing card slots and available and spent Attention tracks"
                width={1600}
                height={917}
                loading="lazy"
                className="w-full"
              />
              <figcaption className="bg-background/70 px-4 py-3 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Hunter player board — one per hunter, themed to its region
              </figcaption>
            </figure>

            <ul className="divide-y divide-border">
              {[
                { qty: "20", label: "Bounty Cards", note: "Feral imps to legendary ember drakes" },
                { qty: "6", label: "Hunter Player Boards", note: "Attention tracks and card slots" },
                { qty: "1", label: "Central Board", note: "Three bounty lanes + reputation track" },
                { qty: "54", label: "Target & Attention Cards", note: "A/B/C lanes and 1–6 focus" },
                { qty: "30", label: "Boon Tokens", note: "Reroll, Extra Die, +1 Damage, Refresh" },
                { qty: "1", label: "Attack Die", note: "d6 — the killing blow lives here" },
              ].map((c) => (
                <li key={c.label} className="flex items-baseline gap-5 py-4">
                  <span className="text-display w-14 shrink-0 text-2xl text-lantern sm:text-3xl">
                    {c.qty}
                  </span>
                  <div className="min-w-0">
                    <div className="text-display uppercase tracking-wider text-foreground">
                      {c.label}
                    </div>
                    <div className="text-sm italic text-muted-foreground">{c.note}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Boon tokens */}
          <div className="mt-14 rounded-sm border border-border bg-background/40 p-6 sm:p-8">
            <p className="text-display text-center text-xs uppercase tracking-[0.3em] text-lantern">
              Boon Tokens
            </p>
            <div className="mt-6 flex flex-wrap items-start justify-center gap-6 sm:gap-10">
              {boons.map((b) => (
                <figure key={b.label} className="w-20 text-center sm:w-24">
                  <img src={b.img} alt={`${b.label} boon token`} loading="lazy" className="w-full" />
                  <figcaption className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                    {b.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WORLD / SCENES */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="text-center">
            <p className="text-display text-[0.65rem] uppercase tracking-[0.4em] text-ember sm:text-xs sm:tracking-[0.5em]">
              § 5 — The Hunting Grounds
            </p>
            <h2 className="text-display mt-4 text-3xl text-foreground sm:text-4xl md:text-5xl">
              Where the Contracts Take You
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {scenes.map((s) => (
              <figure
                key={s.label}
                className="group relative overflow-hidden rounded-sm shadow-[var(--shadow-plank)]"
              >
                <img
                  src={s.img}
                  alt={`${s.label} environment art from Last Hit`}
                  width={1800}
                  height={1032}
                  loading="lazy"
                  className="w-full transition duration-500 group-hover:scale-[1.03]"
                />
                <figcaption className="text-display absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent px-4 pb-3 pt-10 text-xs uppercase tracking-[0.3em] text-lantern">
                  {s.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* IN DEVELOPMENT */}
      <section id="in-development" className="relative border-y border-border/60 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <figure className="overflow-hidden rounded-sm shadow-[var(--shadow-plank)]">
            <img
              src={sceneBasilisk.url}
              alt="Concept environment art for Last Hit"
              loading="lazy"
              className="w-full"
            />
          </figure>
          <div className="min-w-0">
            <p className="text-display text-[0.65rem] uppercase tracking-[0.4em] text-ember sm:text-xs sm:tracking-[0.5em]">
              § 6 — In Development
            </p>
            <h2 className="text-display mt-4 text-3xl text-foreground sm:text-4xl md:text-5xl">
              Still a Work in Progress
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Last Hit is actively in development. Expect things to change as we get closer to
              launch.
            </p>
            <ul className="mt-7 space-y-3 text-muted-foreground">
              {[
                "Art is being finalized and may still change",
                "Mechanics and balance are still being tuned",
                "Additional rules and edge cases around core gameplay are being tested",
                "Component list and final bounty roster are not locked in",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="text-lantern">◆</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 border-t border-border pt-6">
              <p className="text-display text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Current Rulebook
              </p>
              <a
                href={rulebookAsset.url}
                download="Last-Hit-Rulebook.pdf"
                className="text-display mt-4 inline-flex items-center gap-3 rounded-sm border border-lantern/40 bg-lantern/10 px-5 py-3 text-xs uppercase tracking-[0.3em] text-lantern transition hover:bg-lantern/20"
              >
                <FileDown size={16} strokeWidth={1.75} />
                Download Rulebook (PDF)
              </a>
              <p className="mt-3 text-xs italic text-muted-foreground">
                Draft rules — subject to change before launch.
              </p>
            </div>

            <div className="mt-9 border-t border-border pt-6">
              <p className="text-display text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Follow Along
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  { label: "Instagram", href: "#", Icon: Instagram },
                  { label: "Twitter / X", href: "#", Icon: Twitter },
                  { label: "YouTube", href: "#", Icon: Youtube },
                  { label: "Discord", href: "#", Icon: MessagesSquare },
                ].map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="group flex h-11 w-11 items-center justify-center rounded-sm border border-border bg-background/60 text-muted-foreground transition hover:border-lantern/60 hover:text-lantern"
                  >
                    <Icon size={18} strokeWidth={1.75} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNUP */}
      <section id="signup" className="relative overflow-hidden py-20 md:py-28">
        <img
          src={sceneDrake.url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-lantern)" }} />

        <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-6">
          <img
            src={sigilAsset.url}
            alt=""
            width={80}
            height={80}
            className="mx-auto h-16 w-16 sm:h-20 sm:w-20"
          />
          <p className="text-display mt-6 text-[0.65rem] uppercase tracking-[0.4em] text-ember sm:text-xs sm:tracking-[0.5em]">
            Enlistment Papers
          </p>
          <h2 className="text-display ember-glow mt-4 text-3xl text-foreground sm:text-4xl md:text-5xl">
            Take the Contract
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
            We'll send word when Last Hit hits the crowdfunding board — no spam, no filler, only the
            horn call.
          </p>

          <div className="mt-9 flex justify-center">
            <button
              type="button"
              onClick={() => openSignup("signup-section", ["updates"])}
              className="text-display rounded-sm px-9 py-4 text-xs uppercase tracking-[0.28em] text-primary-foreground shadow-[var(--shadow-lantern)] transition hover:brightness-110 sm:text-sm"
              style={{ background: "var(--gradient-ember)" }}
            >
              Sign the Ledger
            </button>
          </div>
        </div>
      </section>

      {/* PLAYTESTERS */}
      <section
        id="playtest"
        className="relative overflow-hidden border-t border-border/60 py-20 md:py-28"
      >
        <img
          src={sceneHydra.url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/70" />

        <div className="relative mx-auto max-w-xl px-5 text-center sm:px-6">
          <h2 className="text-display ember-glow text-3xl text-foreground sm:text-4xl md:text-5xl">
            Playtesters Wanted!
          </h2>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => openSignup("playtest-section", ["playtest", "updates"])}
              className="text-display rounded-sm px-9 py-4 text-xs uppercase tracking-[0.28em] text-primary-foreground shadow-[var(--shadow-lantern)] transition hover:brightness-110 sm:text-sm"
              style={{ background: "var(--gradient-ember)" }}
            >
              Enlist as Playtester
            </button>
          </div>

          <p className="mt-5 text-sm italic text-muted-foreground">
            Help shape Last Hit before launch — remote or in-person sessions, print-and-play kits,
            and a name in the final rulebook.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex min-w-0 items-center gap-3">
              <img src={sigilAsset.url} alt="" width={28} height={28} className="h-7 w-7" />
              <span className="text-display truncate text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Last Hit
              </span>
            </div>
            <p className="text-xs italic text-muted-foreground">
              © {new Date().getFullYear()} · Field-Test Edition
            </p>
          </div>
          <div className="mt-6 border-t border-border/40 pt-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              A production of{" "}
              <a
                href="https://cirestudios.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                Cire Studios
              </a>
            </p>
          </div>
        </div>
      </footer>

      <SignupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source={modalSource}
        defaultInterests={modalDefaults}
      />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-display text-xl text-lantern sm:text-2xl">{value}</div>
      <div className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function MechanicHighlight({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-w-0">
      <h4 className="text-display text-sm uppercase tracking-[0.25em] text-lantern">{title}</h4>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function ParchmentCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="parchment-panel relative rounded-sm p-6 pt-9 sm:p-8 sm:pt-10">
      <span
        aria-hidden="true"
        className="iron-nail absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full"
      />
      {children}
    </div>
  );
}
