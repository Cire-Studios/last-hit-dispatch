import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Instagram, Twitter, Youtube, MessagesSquare, Menu, X } from "lucide-react";
import heroImg from "@/assets/hero-guildhall.jpg";
import trollImg from "@/assets/bounty-troll.jpg";
import drakeImg from "@/assets/bounty-drake.jpg";
import golemImg from "@/assets/bounty-golem.jpg";
import componentsImg from "@/assets/components-flatlay.jpg";
import sigilImg from "@/assets/guild-sigil.png";
import inspiration1 from "@/assets/inspiration-1.png";
import inspiration2 from "@/assets/inspiration-2.png";
import inspiration3 from "@/assets/inspiration-3.png";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { property: "og:image", content: "https://id-preview--c1f58e46-bfd6-45aa-aa60-d97a1a8e286a.lovable.app/og.jpg" },
    ].filter(() => false), // omit until real og:image hosted; keeps root defaults
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
  { img: trollImg, name: "Moss Troll", hp: 6, rep: 4 },
  { img: drakeImg, name: "Ember Drake", hp: 9, rep: 6 },
  { img: golemImg, name: "Crystal Basilisk", hp: 7, rep: 5 },
];

const components = [
  { qty: "20", label: "Bounty Cards", note: "Feral imps to ember drakes" },
  { qty: "30", label: "Boon Tokens", note: "Second Chance, Off Guard, Exposed, Refresh" },
  { qty: "6", label: "Hunter Kits", note: "Meeple, Attention cubes, Momentum, cards" },
  { qty: "1", label: "Attack Die", note: "d6 — the killing blow lives here" },
  { qty: "1", label: "Central Board", note: "Bounty slots and attack lineups" },
  { qty: "∞", label: "Bad Faith", note: "Bring your own" },
];

function Landing() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [ptEmail, setPtEmail] = useState("");
  const [ptStatus, setPtStatus] = useState<"idle" | "success">("idle");
  const [menuOpen, setMenuOpen] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const list = JSON.parse(localStorage.getItem("lasthit_signups") || "[]");
      list.push({ email, ts: Date.now() });
      localStorage.setItem("lasthit_signups", JSON.stringify(list));
    } catch {
      /* ignore */
    }
    setStatus("success");
  };

  const onPlaytest = (e: FormEvent) => {
    e.preventDefault();
    if (!ptEmail) return;
    try {
      const list = JSON.parse(localStorage.getItem("lasthit_playtesters") || "[]");
      list.push({ email: ptEmail, ts: Date.now() });
      localStorage.setItem("lasthit_playtesters", JSON.stringify(list));
    } catch {
      /* ignore */
    }
    setPtStatus("success");
  };

  return (
    <main className="plank-bg min-h-screen overflow-x-hidden text-foreground">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <img
          src={heroImg}
          alt="A guild hall bounty board lit by lanterns, layered with commission papers depicting monsters"
          width={1920}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/50 to-background" />
        <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-lantern)" }} />

        <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <img src={sigilImg} alt="" width={40} height={40} className="h-9 w-9 shrink-0 opacity-90 sm:h-10 sm:w-10" />
            <span className="text-display truncate text-[0.65rem] uppercase tracking-[0.25em] text-lantern sm:text-sm sm:tracking-[0.35em]">
              Bounty Hunters' Guild
            </span>
          </div>
          <div className="hidden gap-8 text-sm uppercase tracking-widest text-muted-foreground md:flex">
            <a href="#contract" className="hover:text-lantern transition">The Contract</a>
            <a href="#mechanics" className="hover:text-lantern transition">Mechanics</a>
            <a href="#bounties" className="hover:text-lantern transition">Bounties</a>
            <a href="#components" className="hover:text-lantern transition">Components</a>
          </div>
          <a
            href="#signup"
            className="text-display hidden shrink-0 rounded-sm border border-lantern/40 bg-lantern/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-lantern transition hover:bg-lantern/20 md:inline-block"
          >
            Get Notified
          </a>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="shrink-0 rounded-sm border border-lantern/40 p-2 text-lantern md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
        {menuOpen && (
          <div className="relative z-20 mx-auto max-w-7xl px-4 pb-4 md:hidden">
            <div className="flex flex-col gap-1 rounded-sm border border-border bg-background/95 p-4 text-sm uppercase tracking-widest text-muted-foreground backdrop-blur">
              {[
                ["#contract", "The Contract"],
                ["#mechanics", "Mechanics"],
                ["#bounties", "Bounties"],
                ["#components", "Components"],
                ["#signup", "Get Notified"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-sm px-3 py-2 hover:bg-lantern/10 hover:text-lantern"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-20 pb-32 text-center md:pt-32">
          <p className="text-display text-xs uppercase tracking-[0.5em] text-lantern/80">
            Open Contract · Field-Test Edition
          </p>
          <h1 className="text-display mt-6 text-6xl font-bold leading-none text-foreground md:text-8xl lg:text-9xl ember-glow">
            LAST HIT
          </h1>
          <div className="mt-6 flex items-center gap-4 text-parchment-dark">
            <span className="h-px w-16 bg-lantern/40" />
            <span className="text-display text-xs uppercase tracking-[0.4em]">
              2–6 Hunters · 25–60 min
            </span>
            <span className="h-px w-16 bg-lantern/40" />
          </div>
          <p className="mt-10 max-w-2xl text-xl italic text-parchment md:text-2xl">
            "Everyone fights. Only one gets paid."
          </p>
          <p className="mt-6 max-w-xl text-base text-muted-foreground">
            A cutthroat bounty-hunter board game of secret plans, whispered bargains, and the
            perfectly-timed killing blow.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a
              href="#signup"
              className="text-display rounded-sm px-8 py-4 text-sm uppercase tracking-[0.3em] text-primary-foreground shadow-[var(--shadow-lantern)] transition hover:brightness-110"
              style={{ background: "var(--gradient-ember)" }}
            >
              Claim a Seat at the Table
            </a>
            <a
              href="#contract"
              className="text-display rounded-sm border border-lantern/40 px-8 py-4 text-sm uppercase tracking-[0.3em] text-lantern hover:bg-lantern/10 transition"
            >
              Read the Contract
            </a>
          </div>
        </div>
      </section>

      {/* CONTRACT / PITCH */}
      <section id="contract" className="relative py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="text-display text-xs uppercase tracking-[0.5em] text-ember">
              § 1 — The Contract
            </p>
            <h2 className="text-display mt-4 text-4xl leading-tight text-foreground md:text-6xl">
              Hunt together.<br />
              <span className="italic text-lantern">Betray at the last second.</span>
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              Damage stays on every monster you strike — but the Reputation goes to the hunter who
              lands the final blow. Every attack draws the table closer to a payday, and every
              attack might hand that payday to somebody else.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Commit your Attention in secret. Shape the attack order. Bargain, bluff, and split
              your rivals' focus at exactly the right moment. First to 15 Reputation earns the
              title of <span className="text-lantern italic">Master Hunter</span>.
            </p>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4 border-t border-border pt-6 text-sm sm:gap-8">
              <Stat label="Hunters" value="2–6" />
              <Stat label="Playtime" value="25–60m" />
              <Stat label="Age" value="13+" />
              <Stat label="Weight" value="Medium" />
            </div>
          </div>

          <ParchmentCard>
            <p className="text-display text-xs uppercase tracking-[0.35em] text-ember">
              Round Sequence
            </p>
            <ol className="mt-6 space-y-3 text-ink">
              {[
                ["Recover", "Reclaim up to 2 Attention."],
                ["Program", "Secretly pair Target + Attention."],
                ["Reveal", "Cards flip. Attention is spent."],
                ["Position", "Low Attention slots first; High slots last, anywhere."],
                ["Hunt", "Boon → Momentum → Roll → Split."],
                ["Claim", "The last hit takes it all."],
              ].map(([name, body], i) => (
                <li key={name} className="flex gap-4 border-b border-ink/10 pb-3 last:border-0">
                  <span className="text-display w-6 text-lg text-wax">{i + 1}</span>
                  <div>
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
      <section id="mechanics" className="relative border-y border-border/60 bg-card/40 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-display text-xs uppercase tracking-[0.5em] text-ember">
              § 2 — Field Rules
            </p>
            <h2 className="text-display mt-4 text-4xl text-foreground md:text-5xl">
              How the Hunt Unfolds
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Four decisions that turn a cooperative monster hunt into an open contract nobody
              trusts.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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

          <div className="mt-16 grid grid-cols-1 gap-8 rounded-sm border border-border bg-background/40 p-8 md:grid-cols-3">
            <MechanicHighlight
              title="Attention is Currency"
              body="Six cubes. That's all you have. Spend them to strike, to shave a rival's damage, or to buy your position in the lineup."
            />
            <MechanicHighlight
              title="Boons Reward Patience"
              body="Ignored monsters grow more dangerous — and more rewarding. Second Chance, Off Guard, Exposed, Refresh."
            />
            <MechanicHighlight
              title="Momentum Compounds"
              body="Land a non-lethal hit, bank the tension. Cash it in as +1 damage per token when the final strike is on the table."
            />
          </div>
        </div>
      </section>

      {/* BOUNTIES */}
      <section id="bounties" className="relative py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-display text-xs uppercase tracking-[0.5em] text-ember">
              § 3 — Wanted
            </p>
            <h2 className="text-display mt-4 text-4xl text-foreground md:text-5xl">
              The Starter Contracts
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Twenty commissions ride in the deck. Same health, different Reputation — the richer
              the bounty, the more hunters it attracts.
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {bounties.map((b, i) => (
              <figure
                key={b.name}
                className="group relative"
                style={{ transform: `rotate(${(i - 1) * 1.5}deg)` }}
              >
                <span
                  aria-hidden="true"
                  className="iron-nail absolute -top-2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full"
                />
                <div className="overflow-hidden rounded-sm shadow-[var(--shadow-plank)] transition group-hover:-translate-y-1">
                  <img
                    src={b.img}
                    alt={`${b.name} bounty poster`}
                    width={900}
                    height={1200}
                    loading="lazy"
                    className="h-[420px] w-full object-cover"
                  />
                </div>
                <figcaption className="mt-6 text-center">
                  <div className="text-display text-2xl text-foreground">{b.name}</div>
                  <div className="mt-2 flex justify-center gap-6 text-sm text-muted-foreground">
                    <span><span className="text-ember">✦</span> {b.hp} Health</span>
                    <span><span className="text-lantern">◆</span> {b.rep} Reputation</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* COMPONENTS */}
      <section id="components" className="relative border-y border-border/60 py-28">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
          <div className="relative overflow-hidden rounded-sm shadow-[var(--shadow-plank)]">
            <img
              src={componentsImg}
              alt="A flat-lay of Last Hit board game components on a tavern table"
              width={1600}
              height={1104}
              loading="lazy"
              className="w-full object-cover"
            />
          </div>
          <div>
            <p className="text-display text-xs uppercase tracking-[0.5em] text-ember">
              § 4 — In the Box
            </p>
            <h2 className="text-display mt-4 text-4xl text-foreground md:text-5xl">
              What You'll Unpack
            </h2>
            <p className="mt-4 text-muted-foreground">
              Painted meeples, weathered card stock, and just enough tokens to keep the whole
              table honest.
            </p>

            <ul className="mt-10 divide-y divide-border">
              {components.map((c) => (
                <li key={c.label} className="flex items-baseline gap-6 py-4">
                  <span className="text-display w-14 flex-shrink-0 text-3xl text-lantern">
                    {c.qty}
                  </span>
                  <div>
                    <div className="text-display uppercase tracking-wider text-foreground">
                      {c.label}
                    </div>
                    <div className="text-sm italic text-muted-foreground">{c.note}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* IN DEVELOPMENT */}
      <section id="in-development" className="relative border-y border-border/60 py-28">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <figure className="relative overflow-hidden rounded-sm shadow-[var(--shadow-plank)]">
            <span
              aria-hidden="true"
              className="iron-nail absolute top-3 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full"
            />
            <img
              src={inspiration2}
              alt="Storyboard of Last Hit characters, monsters, and bounty commissions pinned across the guild wall"
              loading="lazy"
              className="w-full object-cover"
            />
          </figure>
          <div>
            <p className="text-display text-xs uppercase tracking-[0.5em] text-ember">
              § 5 — In Development
            </p>
            <h2 className="text-display mt-4 text-4xl text-foreground md:text-5xl">
              Still a Work in Progress
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Last Hit is actively in development. Expect things to change as we get closer to launch.
            </p>
            <ul className="mt-8 space-y-3 text-muted-foreground">
              <li className="flex gap-3"><span className="text-lantern">◆</span> Current art is placeholder and does not reflect the final look</li>
              <li className="flex gap-3"><span className="text-lantern">◆</span> Mechanics and balance are still being tuned</li>
              <li className="flex gap-3"><span className="text-lantern">◆</span> Additional rules and edge cases around core gameplay are being tested</li>
              <li className="flex gap-3"><span className="text-lantern">◆</span> Component list and final bounty roster are not locked in</li>
            </ul>

            <div className="mt-10 border-t border-border pt-6">
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
      <section id="signup" className="relative overflow-hidden py-32">
        <div className="absolute inset-0">
          <img
            src={inspiration1}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-lantern)" }} />

        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <img src={sigilImg} alt="" width={80} height={80} className="mx-auto h-20 w-20 opacity-90" />
          <p className="text-display mt-6 text-xs uppercase tracking-[0.5em] text-ember">
            Enlistment Papers
          </p>
          <h2 className="text-display mt-4 text-4xl text-foreground md:text-6xl ember-glow">
            Take the Contract
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
            Leave your name at the guild hall. We'll send word when Last Hit hits the crowdfunding
            board — no spam, no filler, only the horn call.
          </p>

          {status === "success" ? (
            <div className="parchment-panel mx-auto mt-10 max-w-md rounded-sm p-8">
              <div className="wax-seal mx-auto mb-4 h-14 w-14 rounded-full" />
              <p className="text-display text-lg uppercase tracking-wider text-ink">
                Your Mark is Set
              </p>
              <p className="mt-3 text-sm italic text-ink/70">
                The guild will send word by raven when the hunt begins.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hunter@guild.hall"
                className="flex-1 rounded-sm border border-border bg-background/80 px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-lantern focus:outline-none focus:ring-1 focus:ring-lantern"
              />
              <button
                type="submit"
                className="text-display rounded-sm px-8 py-4 text-sm uppercase tracking-[0.3em] text-primary-foreground shadow-[var(--shadow-lantern)] transition hover:brightness-110"
                style={{ background: "var(--gradient-ember)" }}
              >
                Sign
              </button>
            </form>
          )}

          <p className="mt-6 text-xs italic text-muted-foreground/70">
            "Everyone fights. Only one gets paid."
          </p>
        </div>
      </section>

      {/* PLAYTESTERS */}
      <section id="playtest" className="relative overflow-hidden border-t border-border/60 py-32">
        <div className="absolute inset-0">
          <img
            src={inspiration3}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-90"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/70" />

        <div className="relative mx-auto max-w-xl px-6 text-center">
          <h2 className="text-display text-4xl text-foreground md:text-6xl ember-glow">
            Playtesters Wanted!
          </h2>

          {ptStatus === "success" ? (
            <p className="text-display mt-8 text-lg uppercase tracking-wider text-lantern">
              Contract pulled — we'll be in touch.
            </p>
          ) : (
            <form onSubmit={onPlaytest} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={ptEmail}
                onChange={(e) => setPtEmail(e.target.value)}
                placeholder="tester@guild.hall"
                className="flex-1 rounded-sm border border-border bg-background/80 px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-lantern focus:outline-none focus:ring-1 focus:ring-lantern"
              />
              <button
                type="submit"
                className="text-display rounded-sm px-8 py-4 text-sm uppercase tracking-[0.3em] text-primary-foreground shadow-[var(--shadow-lantern)] transition hover:brightness-110"
                style={{ background: "var(--gradient-ember)" }}
              >
                Sign Up
              </button>
            </form>
          )}

          <p className="mt-5 text-sm italic text-muted-foreground">
            Help shape Last Hit before launch — remote or in-person sessions, print-and-play kits, and a name in the final rulebook.
          </p>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="border-t border-border/60 py-10 text-center">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <img src={sigilImg} alt="" width={28} height={28} className="h-7 w-7 opacity-80" />
              <span className="text-display text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Last Hit · Bounty Hunters' Guild
              </span>
            </div>
            <p className="text-xs italic text-muted-foreground">
              © {new Date().getFullYear()} · Field-Test Edition v1.4
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-display text-2xl text-lantern">{value}</div>
      <div className="text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function MechanicHighlight({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h4 className="text-display text-sm uppercase tracking-[0.25em] text-lantern">{title}</h4>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function ParchmentCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="parchment-panel relative rounded-sm p-8 pt-10">
      <span
        aria-hidden="true"
        className="iron-nail absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full"
      />
      {children}
    </div>
  );
}
