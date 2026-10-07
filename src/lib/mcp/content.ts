// Public marketing content for the Last Hit landing page, shared by MCP tools.

import { monsters } from "@/lib/monsters";
export { roundSequence } from "@/lib/game-rules";

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
    "After all hunts, 15+ Reputation ends the game. An empty board and deck during Update Bounties also ends it. Highest Reputation wins. Ties: most claimed Bounties, then compare their earned Reputation values sorted highest to lowest, then draw a tied hunter’s pawn.",
  pitch:
    "Secretly choose a Bounty and commit Attention for positioning. Roll to attack and use Boons within your lineup. The last hit normally claims Reputation; other hunters earn Gold for their remaining colored damage cubes. Buy Boons at the Market and choose when to PREPARE for your next hunt.",
};

export const mechanics = [
  {
    step: "I",
    title: "Plan in Secret",
    body: "Choose a target and commit 1–6 Available Attention, or PREPARE to skip the hunt and recover.",
  },
  {
    step: "II",
    title: "Position the Lineup",
    body: "Priority is commitment plus temporary Boost bonuses. Only the top four qualify. Place lowest to highest; later hunters insert anywhere. Priority never adds damage.",
  },
  {
    step: "III",
    title: "Roll and React",
    body: "Attack First to Last with a die showing 0, 1, 1, 2, 2, 3. Eligible hunters in the same lineup may use Boons before damage is recorded. Only one Extra Die Boon per attack.",
  },
  {
    step: "IV",
    title: "Claim or Collect",
    body: "The last hit normally claims the Bounty and Reputation. Every other hunter earns 1 Gold per colored cube still on it. The claimant and ownerless filler earn no Gold.",
  },
  {
    step: "V",
    title: "Shop and Refresh",
    body: "Buy Boons, holding at most 3. Convert 2 Available Attention to 1 Gold during the Market. Hunting refreshes up to 2 Attention at round’s end; PREPARE refreshes all and cannot be used in consecutive rounds.",
  },
];

export const bounties = monsters.map(({ name, bountyImage }) => ({
  name,
  card: `https://lasthit.cirestudios.dev${bountyImage}`,
  note: "Use the current card for Health, Reputation, behavior, and exceptions.",
}));

export const components = [
  {
    quantity: "30",
    label: "Monster Bounty Cards",
    note: "Each card defines its own behavior and rewards",
  },
  {
    quantity: "1 per hunter",
    label: "Hunter Mat, Lineup Pawn, Reputation Tracker",
    note: "Reputation starts at 0",
  },
  {
    quantity: "6 per hunter",
    label: "Personal Attention Cubes",
    note: "Move between Available and Spent",
  },
  { quantity: "12 per hunter", label: "Colored Attack Cubes", note: "Record damage and its owner" },
  {
    quantity: "11 per hunter",
    label: "Planning Cards",
    note: "Targets A/B/C/PRE and commitments 1–6/PARE",
  },
  { quantity: "1 per hunter at setup", label: "Gold", note: "Earn and spend Gold between hunts" },
  {
    quantity: "6 types",
    label: "Boons",
    note: "Shield, Reroll, −1 Damage, +1 Damage, Boost, Extra Die",
  },
  {
    quantity: "Shared",
    label: "Bounty Board, Attack Dice, bag, Gold and black cubes",
    note: "Black cubes provide ownerless damage filler and state markers",
  },
  {
    quantity: "Optional",
    label: "Special Abilities",
    note: "Draft before play; PREPARE readies exhausted abilities",
  },
];

export const developmentStatus = {
  stage: "Prelaunch playtesting",
  notes: [
    "The current rules specification and current Drive artwork guide the public preview.",
    "Cire Studios is recruiting playtesters and collecting launch-update signups.",
    "Playtester signup is email-only; follow-up qualification happens separately.",
  ],
  howToHelp:
    "Playtesters and launch-update subscribers can sign up on the landing page at https://lasthit.cirestudios.dev",
};
