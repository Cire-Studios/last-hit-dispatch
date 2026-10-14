import { ArrowDown, ArrowLeft, ArrowRight, Sword } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./hunt-story.css";

const ROOT = "/last-hit";
const hunters = [
  { color: "green", name: "Green", player: 2, attention: 2, damage: 3 },
  { color: "purple", name: "Purple", player: 4, attention: 4, damage: 2 },
  { color: "orange", name: "Orange", player: 6, attention: 6, damage: 1 },
];
const steps = [
  {
    id: "plan",
    label: "Plan",
    title: "Choose your Bounty in secret.",
    text: "A Target card chooses the Bounty. An Attention card commits how much you’ll spend to get your choice of position.",
  },
  {
    id: "reveal",
    label: "Reveal",
    title: "Everyone had the same idea.",
    text: "Three hunters reveal Target B. The Hill Ogre has company—and the hunter who committed the most Attention gets the last choice of where to stand.",
  },
  {
    id: "lineup",
    label: "Lineup",
    title: "Choose when you strike.",
    text: "Green takes the front. Purple joins behind. Orange chooses to go last, betting the others will leave just enough Ogre to finish.",
  },
  {
    id: "green-roll",
    label: "Green · Roll",
    title: "Green opens the hunt.",
    text: "Three swords. A strong first attack, but the Ogre can take more than that.",
  },
  {
    id: "green-damage",
    label: "Green · Damage",
    title: "The first wounds belong to Green.",
    text: "Three green cubes fill the Health track from the bottom. The monster is halfway down, and two hunters are still waiting.",
  },
  {
    id: "purple-roll",
    label: "Purple · Roll",
    title: "Purple gets the next shot.",
    text: "Two swords. Almost enough to finish the job. Almost.",
  },
  {
    id: "purple-damage",
    label: "Purple · Damage",
    title: "One Health left.",
    text: "Purple’s cubes stack above Green’s. All that work is now an opening for the last hunter in line.",
  },
  {
    id: "orange-roll",
    label: "Orange · Roll",
    title: "Orange only needs one.",
    text: "One sword. Going last was a gamble. This time, it pays off.",
  },
  {
    id: "orange-damage",
    label: "Orange · Damage",
    title: "That’s the last hit.",
    text: "The orange cube reaches the skull. The Hill Ogre falls—and Orange gets the claim.",
  },
  {
    id: "claim",
    label: "Claim",
    title: "Orange takes the Bounty.",
    text: "Three Reputation for the final blow. Green earns three Gold and Purple earns two for the damage they left behind. There’s always another hunt.",
  },
];
const colors = ["green", "green", "green", "purple", "purple", "orange"];

export function HuntShowcase() {
  const [active, setActive] = useState(0);
  const [inStory, setInStory] = useState(false);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = section.current;
      if (!root) return;
      const bounds = root.getBoundingClientRect();
      setInStory(
        bounds.top < window.innerHeight * 0.45 && bounds.bottom > window.innerHeight * 0.5,
      );
      const nodes = root.querySelectorAll<HTMLElement>(".lh-journey-beat");
      let closest = 0;
      let distance = Infinity;
      nodes.forEach((node, i) => {
        const r = node.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
        if (d < distance) {
          distance = d;
          closest = i;
        }
      });
      setActive(closest);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  const jump = (index: number) => {
    const target =
      index === steps.length
        ? document.getElementById("box")
        : document.getElementById(`lh-journey-${steps[index].id}`);
    target?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: index === steps.length ? "start" : "center",
    });
  };
  return (
    <section
      id="hunt"
      className="lh-journey-story"
      ref={section}
      aria-labelledby="lh-journey-title"
    >
      <header className="lh-journey-intro lh-wrap">
        <p className="lh-kicker">Follow a hunt</p>
        <h2 id="lh-journey-title">
          The Ogre won’t
          <br />
          defeat itself.
        </h2>
        <p>
          Three rivals have their eye on the same Bounty.
          <br />
          Scroll to see who walks away with it.
        </p>
        <ArrowDown size={24} aria-hidden="true" />
      </header>
      <div className="lh-journey-story-grid">
        <nav className="lh-journey-rail" aria-label="Hunt progress">
          <p>The hunt</p>
          {steps.map((step, i) => (
            <a
              key={step.id}
              href={`#lh-journey-${step.id}`}
              aria-current={active === i ? "step" : undefined}
              onClick={(e) => {
                e.preventDefault();
                jump(i);
              }}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {step.label}
            </a>
          ))}
        </nav>
        <div className="lh-journey-beats">
          {steps.map((step, i) => (
            <article
              className={`lh-journey-beat ${active === i ? "is-current" : ""}`}
              id={`lh-journey-${step.id}`}
              key={step.id}
              aria-labelledby={`title-${step.id}`}
            >
              <div>
                <p className="lh-kicker">
                  {String(i + 1).padStart(2, "0")} / {step.label}
                </p>
                <h3 id={`title-${step.id}`}>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="lh-journey-stage-shell">
          <HuntStage active={active} />
        </div>
      </div>
      <nav
        className={`lh-journey-mobile-nav ${inStory ? "is-visible" : ""}`}
        aria-label="Hunt step controls"
        inert={!inStory}
      >
        <button
          type="button"
          onClick={() => jump(active - 1)}
          disabled={active === 0}
          aria-label="Previous hunt step"
        >
          <ArrowLeft size={20} />
        </button>
        <span>
          <small>{String(active + 1).padStart(2, "0")} / 10</small>
          {steps[active].label}
        </span>
        <button
          type="button"
          onClick={() => jump(active + 1)}
          aria-label={active === 9 ? "See what’s in the box" : "Next hunt step"}
        >
          <ArrowRight size={20} />
        </button>
      </nav>
    </section>
  );
}

function HuntStage({ active }: { active: number }) {
  const hunterIndex = Math.min(2, Math.max(0, Math.floor((active - 3) / 2)));
  const hunter = hunters[hunterIndex];
  const damage = active >= 8 ? 6 : active >= 6 ? 5 : active >= 4 ? 3 : 0;
  const previousDamage = active === 8 ? 5 : active === 6 ? 3 : 0;
  const isRoll = active === 3 || active === 5 || active === 7;
  return (
    <div className={`lh-journey-stage phase-${active}`}>
      <div className="lh-journey-stage-caption">
        <span>Hill Ogre</span>
        <span>Bounty B · 3 Reputation</span>
      </div>
      {active < 2 ? (
        <div className="lh-journey-planning" key={active}>
          {hunters.map((h, i) => (
            <figure key={h.color} style={{ "--arrival": `${i * 140}ms` } as CSSProperties}>
              <div className="lh-journey-card-pair">
                <img
                  src={`${ROOT}/cards/players/${h.player}/${active === 0 ? "target-back" : "target-b"}.webp`}
                  alt={`${h.name}: ${active === 0 ? "hidden Target" : "Target B"}`}
                />
                <img
                  src={`${ROOT}/cards/players/${h.player}/${active === 0 ? "attention-back" : `attention-${h.attention}`}.webp`}
                  alt={`${h.name}: ${active === 0 ? "hidden Attention" : `${h.attention} Attention`}`}
                />
              </div>
              <figcaption>
                <i className={`hunter-dot ${h.color}`} />
                {h.name}
                <small>
                  {active === 0 ? "Target + Attention" : `Bounty B · ${h.attention} Attention`}
                </small>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : active === 2 ? (
        <div className="lh-journey-lineup-reveal">
          <img
            className="lh-journey-lineup-art"
            src={`${ROOT}/current/lineup.webp`}
            alt="Attack Lineup, from First to Last"
          />
          {hunters.map((h, i) => (
            <div
              className="lh-journey-lineup-hunter"
              key={h.color}
              style={{ top: `${18 + i * 21.3}%`, "--arrival": `${i * 550}ms` } as CSSProperties}
            >
              <img
                src={`${ROOT}/components/pieces/pawn-${h.color}.webp`}
                alt={`${h.name} in position ${i + 1}`}
              />
              <span>
                {h.name}
                <small>{["First to attack", "Second to attack", "Third to attack"][i]}</small>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="lh-journey-attack-scene">
          <div className="lh-journey-bounty">
            <img
              className="lh-journey-bounty-art"
              src={`${ROOT}/current/bounty-hill-ogre.webp`}
              alt="Hill Ogre Bounty: six Health, three Reputation"
            />
            {colors.slice(0, active === 9 ? 0 : damage).map((color, i) => (
              <img
                key={i}
                className={`lh-journey-damage-cube ${!isRoll && i >= previousDamage ? "new-damage" : ""}`}
                style={
                  {
                    top: `${88.5 - i * 7.82}%`,
                    "--arrival": `${(i - previousDamage) * 240}ms`,
                  } as CSSProperties
                }
                src={`${ROOT}/components/pieces/cube-${color}.webp`}
                alt={`${color} damage`}
              />
            ))}
            {active === 9 && <span className="lh-journey-claimed">Claimed by Orange</span>}
          </div>
          {active < 9 ? (
            <div className="lh-journey-attack-detail" key={active}>
              <div className="lh-journey-attacker">
                <img src={`${ROOT}/components/pieces/pawn-${hunter.color}.webp`} alt="" />
                <span>
                  {hunter.name}
                  <small>{isRoll ? "Attack roll" : "Damage recorded"}</small>
                </span>
              </div>
              {isRoll ? (
                <>
                  <img
                    className="lh-journey-rolling-die"
                    src={`${ROOT}/current/attack-die-v2.webp`}
                    alt="Custom Attack Die rolling"
                  />
                  <div className="lh-journey-roll-result" aria-label={`${hunter.damage} swords`}>
                    <strong>{hunter.damage}</strong>
                    <span>
                      {Array.from({ length: hunter.damage }, (_, i) => (
                        <Sword key={i} size={23} />
                      ))}
                    </span>
                  </div>
                </>
              ) : (
                <div className="lh-journey-health-left">
                  <strong>{6 - damage}</strong>
                  <span>{damage === 6 ? "Health · Defeated" : "Health remaining"}</span>
                </div>
              )}
              <div className="lh-journey-turn-order" aria-label="Attack order">
                {hunters.map((h, i) => (
                  <img
                    key={h.color}
                    className={i === hunterIndex ? "current" : ""}
                    src={`${ROOT}/components/pieces/pawn-${h.color}.webp`}
                    alt={`${h.name}${i === hunterIndex ? ", attacking" : ""}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="lh-journey-rewards">
              <img src={`${ROOT}/current/disc-orange.webp`} alt="Orange Reputation Tracker" />
              <strong>+3</strong>
              <span>Reputation for Orange</span>
              <div>
                <p>
                  <i className="hunter-dot green" />
                  Green <b>3 Gold</b>
                </p>
                <p>
                  <i className="hunter-dot purple" />
                  Purple <b>2 Gold</b>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="lh-journey-stage-foot">
        <span>One hunt, from plan to claim</span>
        <span>{String(active + 1).padStart(2, "0")} / 10</span>
      </div>
    </div>
  );
}
