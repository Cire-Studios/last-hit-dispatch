import type { CSSProperties } from "react";
import "./component-inventory.css";
const colors = ["red", "green", "blue", "purple", "white", "orange"];
const pieces = (type: string) => colors.map((color) => `components/pieces/${type}-${color}.webp`);
const items = [
  {
    name: "21 Unique Monsters",
    detail: "Each Bounty card reveals a monster’s health, behavior, and Reputation reward.",
    layout: "cards",
    images: ["moss-troll", "crystal-basilisk", "sandworm", "ember-drake"].map(
      (s) => `current/bounty-${s}.webp`,
    ),
  },
  {
    name: "Bounty Board",
    detail: "The Guild’s open contracts, attack lineups, and Reputation track.",
    layout: "board",
    images: ["current/board.webp"],
  },
  {
    name: "9 Hunter Mats",
    detail: "A place for each hunter’s supplies and spoils.",
    layout: "mats",
    images: ["grave-hound", "hill-ogre", "moss-troll"].map((s) => `current/mat-${s}.webp`),
  },
  {
    name: "Custom Attack Dice",
    detail: "Every roll could leave the next hunter a perfect opening.",
    layout: "dice",
    images: ["current/attack-die-v2.webp", "current/attack-die-v2.webp"],
  },
  {
    name: "Boons",
    detail: "Shield, Reroll, Boost, Extra Die, and damage modifiers.",
    layout: "tokens",
    images: ["shield", "reroll", "boost", "minus-one", "plus-one", "extra-die"].map(
      (s) => `current/${s}.webp?v=20261007b`,
    ),
  },
  {
    name: "66 planning cards",
    detail: "Target and Attention cards for every hunter.",
    layout: "cards",
    images: ["1/target-a", "2/attention-3", "4/target-b", "6/attention-6"].map(
      (s) => `cards/players/${s}.webp`,
    ),
  },
  {
    name: "72 Attack Cubes",
    detail: "Twelve in each hunter’s color to mark their damage.",
    layout: "cubes",
    images: [...pieces("cube"), ...pieces("cube")],
  },
  {
    name: "Attention Cubes",
    detail: "Six per hunter, plus a separate shared supply.",
    layout: "attention",
    images: Array(6).fill("current/attention-cube.webp") as string[],
  },
  {
    name: "6 Lineup Pawns",
    detail: "One in each color to choose your place in the attack.",
    layout: "pawns",
    images: pieces("pawn"),
  },
  {
    name: "6 Reputation Trackers",
    detail: "Matching colored discs to track your Reputation.",
    layout: "discs",
    images: colors.map((s) => `current/disc-${s}.webp`),
  },
  {
    name: "Gold",
    detail: "Collect your rewards and spend them on Boons for the next hunt.",
    layout: "gold",
    images: Array(5).fill("current/gold.webp") as string[],
  },
  {
    name: "Draw Bag",
    detail: "Draw hunters’ pawns to break ties in Priority.",
    layout: "bag",
    images: ["current/bag.webp"],
  },
  {
    name: "10 Special Ability Cards",
    detail: "Optional hunter abilities for a different way to compete.",
    layout: "abilities",
    images: ["marksman", "pickpocket", "tactician"].map((name) => `current/ability-${name}.webp`),
  },
];
export function ComponentInventory() {
  return (
    <div id="components" className="kit-inventory">
      <section
        id="component-market"
        className="kit-market"
        aria-labelledby="market-component-title"
      >
        <header>
          <h3 id="market-component-title">Double-sided Market</h3>
          <p>
            Spend your Gold on Boons. Choose the Standard Market or the Wandering Merchant for your
            game.
          </p>
        </header>
        <div className="kit-market-sides">
          <figure>
            <img
              src="/last-hit/current/standard-market.webp?v=20261007c"
              alt="Standard Market side of the Market board"
              loading="lazy"
            />
            <figcaption>Standard Market</figcaption>
          </figure>
          <figure>
            <img
              src="/last-hit/current/wandering-merchant.webp?v=20261007c"
              alt="Wandering Merchant side of the Market board"
              loading="lazy"
            />
            <figcaption>Wandering Merchant</figcaption>
          </figure>
        </div>
      </section>

      {items.map((item) => (
        <figure
          id={`component-${item.layout}`}
          key={item.name}
          className={`kit-item kit-${item.layout}`}
        >
          <div className="kit-art" role="img" aria-label={item.name}>
            {item.images.map((src, i) => (
              <img
                key={`${src}-${i}`}
                src={`/last-hit/${src}`}
                alt=""
                loading="lazy"
                style={{ "--i": i, "--n": item.images.length } as CSSProperties}
              />
            ))}
          </div>
          <figcaption>
            <h3>{item.name}</h3>
            <p>{item.detail}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
