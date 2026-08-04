// Public marketing content for the Last Hit landing page, shared by MCP tools.

import { monsters } from "@/lib/monsters";

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
  winCondition:
    "After all Attack Lineups resolve, the game ends if one or more hunters have at least 15 Reputation or every Bounty card has been claimed. The hunter with the most Reputation wins. Ties go to the most claimed Bounties, then the most claimed Bounties of the highest tier, then First Hunter order. Reaching 15 first does not guarantee victory.",
  pitch:
    "Last Hit is a bounty-hunter board game of secret plans, Attention management, and competing for the last hit. Damage stays on every Bounty you attack, but the Reputation goes to the hunter whose attack defeats it. Commit Attention to determine Priority, insert your pawn into the Attack Lineup when your turn comes, and use Split Attention to reduce a rival's Provisional Damage.",
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
    body: "Committed Attention determines Priority. Starting with the lowest Priority, the first hunter takes Front; every later hunter may insert at Front, between hunters, or at Back, shifting existing pawns toward Back.",
  },
  {
    step: "III",
    title: "Resolve Each Attack",
    body: "In Attack Lineup order, determine whether to draw a Boon, choose Momentum, roll, announce Provisional Damage, let rivals on that Bounty spend remaining Available Attention, then apply Final Damage.",
  },
  {
    step: "IV",
    title: "Land the Last Hit",
    body: "Damage stays on the monster. Only the hunter who lands the final strike claims the Reputation.",
  },
];

export const roundSequence = [
  { phase: "Recover", detail: "Return up to 2 spent Attention." },
  { phase: "Plan", detail: "Secretly pair one Target card with one Attention card." },
  { phase: "Reveal", detail: "Reveal the chosen cards and spend the committed Attention." },
  {
    phase: "Position",
    detail:
      "In reverse Priority order, the first hunter takes Front and each later hunter inserts anywhere in the Attack Lineup.",
  },
  {
    phase: "Hunt",
    detail:
      "Resolve each hunter's Boon, Momentum, roll, Split Attention, and Final Damage in Attack Lineup order.",
  },
  {
    phase: "Victory Check",
    detail:
      "After every Attack Lineup resolves, 15+ Reputation or every Bounty card claimed triggers the end of the game.",
  },
  { phase: "Monster Effects", detail: "Resolve the effects of surviving monsters." },
  { phase: "Resolve PREPARE", detail: "Resolve hunters who played PREPARE." },
  { phase: "Neglect", detail: "Resolve unattended Bounties." },
  { phase: "Reset & Refill", detail: "Clear the round, refill the board, and pass First Hunter." },
];

export const bounties = monsters.map(({ name, tier, health, reputation }) => ({
  name,
  tier,
  health,
  reputation,
}));

export const components = [
  { quantity: "1", label: "Rulebook", note: "Complete rules and examples" },
  { quantity: "1", label: "Bounty Board", note: "Three Bounty positions and shared tracks" },
  { quantity: "12", label: "Hunter Mats", note: "A distinct hunter on every mat" },
  { quantity: "6", label: "Hunter Pawns", note: "One for each player" },
  { quantity: "6", label: "Colored Cubes", note: "One player-color cube per hunter" },
  { quantity: "2", label: "Dice", note: "Used to resolve attacks" },
  { quantity: "71", label: "Damage & Momentum Tokens", note: "Track wounds and combat momentum" },
  { quantity: "45", label: "Small Attention Cubes", note: "Commit and spend Attention" },
  { quantity: "1", label: "First Hunter Token", note: "Marks the round's First Hunter" },
  { quantity: "45", label: "Boon Tokens", note: "One-use tactical advantages" },
  { quantity: "66", label: "Player Cards", note: "Targets, Attention, PREPARE, and PARE" },
  { quantity: "13", label: "Achievement Cards", note: "Public Reputation opportunities" },
  { quantity: "6", label: "Round Reference Cards", note: "One rules reminder per player" },
  { quantity: "30", label: "Monster Bounty Cards", note: "The guild's rotating contracts" },
  { quantity: "9", label: "Guild Role Cards", note: "Asymmetric roles within the guild" },
  {
    quantity: "4",
    label: "Monster Behavior Reference Cards",
    note: "Quick references for monster behavior",
  },
];

export const developmentStatus = {
  stage: "Prelaunch playtesting",
  notes: [
    "The v2.1 rulebook and finished production art guide the current public preview.",
    "Cire Studios is recruiting playtesters and collecting launch-update signups.",
    "Playtester signup is email-only; follow-up qualification happens separately.",
  ],
  howToHelp:
    "Playtesters and launch-update subscribers can sign up on the landing page at https://lasthit.cirestudios.dev",
};
