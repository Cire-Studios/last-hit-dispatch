// Public marketing content for the Last Hit landing page, shared by MCP tools.

export const overview = {
  title: "Last Hit",
  tagline: "Everyone Fights. Only One Gains Glory.",
  studio: "Cire Studios",
  studioUrl: "https://cirestudios.dev",
  site: "https://lasthit.cirestudios.dev",
  players: "2–6",
  playtime: "35–60 minutes",
  age: "12+",

  weight: "Medium",
  winCondition: "First hunter to 15 Reputation earns the title of Master Hunter.",
  pitch:
    "Last Hit is a bounty-hunter board game of secret plans, split attention, and the killing blow. Damage stays on every monster you strike, but the Reputation goes to the hunter who lands the final blow. Commit your Attention in secret, shape the attack lineup, and bargain, bluff, and split your rivals' focus at exactly the right moment.",
};

export const mechanics = [
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

export const roundSequence = [
  { phase: "Recover", detail: "Reclaim up to 2 Attention." },
  { phase: "Program", detail: "Secretly pair Target + Attention." },
  { phase: "Reveal", detail: "Cards flip. Attention is spent." },
  { phase: "Position", detail: "Low Attention slots first; High slots last, anywhere." },
  { phase: "Hunt", detail: "Boon → Momentum → Roll → Split." },
  {
    phase: "Claim",
    detail: "Killing blow takes the glory. Otherwise damage carries into the next round.",
  },
];

export const bounties = [
  { name: "Moss Troll", health: 6, reputation: 4 },
  { name: "Ember Drake", health: 9, reputation: 6 },
  { name: "Crystal Basilisk", health: 7, reputation: 5 },
];

export const components = [
  { quantity: "20", label: "Bounty Cards", note: "Feral imps to ember drakes" },
  { quantity: "30", label: "Boon Tokens", note: "Second Chance, Off Guard, Exposed, Refresh" },
  { quantity: "6", label: "Hunter Kits", note: "Meeple, Attention cubes, Momentum, cards" },
  { quantity: "1", label: "Attack Die", note: "d6 — the killing blow lives here" },
  { quantity: "1", label: "Central Board", note: "Bounty slots and attack lineups" },
];

export const developmentStatus = {
  stage: "In development",
  notes: [
    "The game is a work in progress.",
    "Current art is placeholder and does not reflect the final result.",
    "Mechanics balance is still being tuned.",
    "Additional rules around core gameplay are still being worked out.",
  ],
  howToHelp:
    "Playtesters and launch-update subscribers can sign up on the landing page at https://lasthit.cirestudios.dev",
};
