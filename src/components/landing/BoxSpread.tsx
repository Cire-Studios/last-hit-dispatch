import "./box-spread.css";
const R = "/last-hit";
export function BoxSpread() {
  return (
    <div className="kit-bundle" aria-label="Last Hit game box and staged component collection">
      <img
        className="kit-bundle-package"
        src={`${R}/game-box.webp`}
        alt="Last Hit game box"
        loading="lazy"
      />
      <img
        className="kit-bundle-market"
        src={`${R}/current/standard-market.webp?v=20261007c`}
        alt="Standard Market side of the double-sided Market board"
        loading="lazy"
      />
      <div className="kit-bundle-board">
        <img src={`${R}/current/board.webp`} alt="Bounty Board" loading="lazy" />
      </div>
      <div className="kit-bundle-cards" aria-label="A selection of Monster Bounty cards">
        {["moss-troll", "ember-drake", "sandworm"].map((slug) => (
          <img
            key={slug}
            src={`${R}/current/bounty-${slug}.webp`}
            alt={`${slug.replaceAll("-", " ")} Bounty`}
            loading="lazy"
          />
        ))}
      </div>
      <div className="kit-bundle-hunter">
        <img
          className="kit-bundle-mat"
          src={`${R}/current/mat-moss-troll.webp`}
          alt="Hunter Mat"
          loading="lazy"
        />
        <div className="kit-bundle-plans">
          <img
            src={`${R}/cards/players/2/target-b.webp`}
            alt="Green Target B card"
            loading="lazy"
          />
          <img
            src={`${R}/cards/players/2/attention-4.webp`}
            alt="Green Attention 4 card"
            loading="lazy"
          />
        </div>
      </div>
      <div className="kit-bundle-pieces">
        <div className="kit-bundle-large-pieces">
          <img src={`${R}/current/attack-die-v2.webp`} alt="Custom Attack Die" loading="lazy" />
          <img
            src={`${R}/components/pieces/pawn-green.webp`}
            alt="Green Lineup Pawn"
            loading="lazy"
          />
          <img
            src={`${R}/current/disc-purple.webp`}
            alt="Purple Reputation Tracker"
            loading="lazy"
          />
        </div>
        <div className="kit-bundle-supply" aria-label="Attack Cubes and Attention Cubes">
          {["cube-green", "cube-purple", "cube-orange", "cube-blue"].map((name, i) => (
            <img key={i} src={`${R}/components/pieces/${name}.webp`} alt="" loading="lazy" />
          ))}
          <img src={`${R}/current/attention-cube.webp`} alt="Attention Cube" loading="lazy" />
          <img src={`${R}/current/attention-cube.webp`} alt="" loading="lazy" />
        </div>
        <div className="kit-bundle-tokens">
          <img src={`${R}/current/shield.webp?v=20261007b`} alt="Shield Boon" loading="lazy" />
          <img
            src={`${R}/current/extra-die.webp?v=20261007b`}
            alt="Extra Die Boon"
            loading="lazy"
          />
          <img src={`${R}/current/gold.webp`} alt="Gold" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
