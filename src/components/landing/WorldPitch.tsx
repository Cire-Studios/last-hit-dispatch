import { ArrowRight } from "lucide-react";
import "./world-pitch.css";
const R = "/last-hit";
export function WorldPitch() {
  return (
    <>
      <section id="hunt" className="world-scene world-forest" aria-labelledby="forest-title">
        <img
          className="world-backdrop"
          src={`${R}/monsters/backgrounds/moss-troll.webp`}
          alt="A Moss Troll rising from the roots of an ancient forest"
          loading="lazy"
        />
        <div className="world-wash" />
        <div className="world-caption">
          <span>Beyond the Guild walls</span>
          <span>Quarry / Moss Troll</span>
        </div>
        <div className="world-copy" data-reveal>
          <p className="lh-kicker">Shared monsters. Competing hunters.</p>
          <h2 id="forest-title">
            Compete for
            <br />
            <em>monster Bounties.</em>
          </h2>
          <p>
            Work the same quarry as your rivals. Every wound brings it closer to defeat. Whoever
            lands the last hit gets the claim.
          </p>
        </div>
        <div
          className="world-board"
          data-reveal
          role="img"
          aria-label="Last Hit Bounty Board with three open contracts and rival hunters in the attack lineups"
        >
          <img
            className="world-board-base"
            src={`${R}/current/full-bounty-board.webp`}
            alt=""
            width={2400}
            height={1218}
            loading="lazy"
          />
        </div>
        <p className="world-footnote">One table. Plenty of unfinished business.</p>
      </section>
      <section id="plans" className="world-scene world-crystal" aria-labelledby="plans-title">
        <img
          className="world-backdrop"
          src={`${R}/monsters/backgrounds/crystal-basilisk.webp`}
          alt="Crystal Basilisk among jagged mineral formations"
          loading="lazy"
        />
        <div className="world-wash" />
        <div className="world-caption">
          <span>Among the crystal seams</span>
          <span>Quarry / Crystal Basilisk</span>
        </div>
        <div className="world-copy" data-reveal>
          <p className="lh-kicker">Target &amp; Attention cards</p>
          <h2 id="plans-title">
            Secret planning.
            <br />
            <em>Simultaneous reveal.</em>
          </h2>
          <p>
            Choose your Bounty in secret. Commit Attention for priority in choosing your position.
            Then find out who had their eye on the same prize.
          </p>
        </div>
        <div
          className="world-plans"
          data-reveal
          aria-label="Green’s concealed Target and Attention cards beside Purple’s revealed Target B and Attention 4"
        >
          {[
            ["2", "target-back"],
            ["2", "attention-back"],
            ["4", "target-b"],
            ["4", "attention-4"],
          ].map(([player, card], i) => (
            <img
              key={card}
              className={`world-plan-card plan-${i}`}
              src={`${R}/cards/players/${player}/${card}.webp`}
              alt={`${player === "2" ? "Green" : "Purple"} ${card.replaceAll("-", " ")}`}
              loading="lazy"
            />
          ))}
          <span>Keep them guessing.</span>
        </div>
      </section>
      <section id="timing" className="world-scene world-embers" aria-labelledby="timing-title">
        <img
          className="world-backdrop"
          src={`${R}/monsters/backgrounds/ember-drake.webp`}
          alt="Ember Drake in a scorched wilderness"
          loading="lazy"
        />
        <div className="world-wash" />
        <div className="world-caption">
          <span>Where the embers settle</span>
          <span>Quarry / Ember Drake</span>
        </div>
        <div className="world-copy" data-reveal>
          <p className="lh-kicker">Last hits earn Reputation</p>
          <h2 id="timing-title">
            Choose your
            <br />
            <em>attack position.</em>
          </h2>
          <p>
            Choose when you strike. Go too early and you could leave the perfect opening. Land the
            last hit to claim the Bounty and earn its Reputation.
          </p>
          <a href="/bestiary" className="world-link">
            Meet your next Bounty <ArrowRight size={18} />
          </a>
        </div>
        <div className="world-finish" data-reveal>
          <div className="world-finish-card">
            <img
              src={`${R}/current/bounty-sandworm.webp`}
              alt="Sandworm Bounty with five damage recorded"
              loading="lazy"
            />
            {["green", "purple", "purple", "orange", "green"].map((color, i) => (
              <img
                className="world-fixed-cube"
                key={i}
                style={{ top: `${88.5 - i * 7.82}%` }}
                src={`${R}/components/pieces/cube-${color}.webp`}
                alt={`${color} damage`}
                loading="lazy"
              />
            ))}
          </div>
          <img
            className="world-last-pawn"
            src={`${R}/components/pieces/pawn-orange.webp`}
            alt="Orange hunter waiting for the final blow"
            loading="lazy"
          />
          <div className="world-finish-note">
            <span>The opening you waited for.</span>
            <strong>Make it count.</strong>
          </div>
        </div>
      </section>
      <section id="abilities" className="world-abilities" aria-labelledby="abilities-title">
        <div className="world-abilities-copy">
          <p className="lh-kicker">Optional ways to play</p>
          <h2 id="abilities-title">Special Abilities</h2>
          <p>
            Draft an ability for your hunter before the first hunt. Keep it ready for the moment
            your rivals think they have you figured out.
          </p>
          <p>
            The Tactician can swap places with a nearby hunter in the attack lineup. A carefully
            chosen position is only safe until someone changes it.
          </p>
        </div>
        <div className="world-abilities-art" aria-label="Special Ability card selection">
          {["marksman", "pickpocket", "tactician"].map((name) => (
            <img
              key={name}
              src={`${R}/current/ability-${name}.webp`}
              alt={`${name[0].toUpperCase()}${name.slice(1)} Special Ability card`}
              width={700}
              height={1167}
              loading="lazy"
            />
          ))}
        </div>
      </section>
      <section className="world-bestiary" aria-label="Explore the world of Last Hit">
        <div>
          <p className="lh-kicker">The Guild’s contracts</p>
          <h2>Meet the monsters.</h2>
          <a className="world-link" href="/bestiary">
            Explore the bestiary <ArrowRight size={18} />
          </a>
        </div>
        <div className="world-monster-windows">
          {[
            { slug: "sandworm", name: "Sandworm" },
            { slug: "mire-hydra", name: "Mire Hydra" },
            { slug: "razorwing-harpy", name: "Razorwing Harpy" },
          ].map((m) => (
            <a href={`/bestiary/${m.slug}`} key={m.slug}>
              <img src={`${R}/monsters/backgrounds/${m.slug}.webp`} alt={m.name} loading="lazy" />
              <span>
                {m.name}
                <ArrowRight size={17} />
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
