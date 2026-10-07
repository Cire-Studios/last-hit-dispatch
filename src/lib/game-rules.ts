// Current rules supplied by the designer on 2026-10-07.
export const RULEBOOK_URL =
  "https://drive.google.com/file/d/1TNlSw2ln0nFlq5_lukn2jfPtGX4k1TK4/view";

export const roundSequence = [
  {
    phase: "Plan",
    detail: "Secretly choose a target and commit 1–6 Available Attention, or play PRE + PARE.",
  },
  {
    phase: "Reveal",
    detail:
      "Reveal together. Hunters spend their commitment; PREPARING hunters refresh up to 2 Attention.",
  },
  {
    phase: "Position",
    detail:
      "Up to four hunters qualify per Bounty. Place from lowest to highest Priority; later hunters insert anywhere. Draw tied hunters’ pawns to resolve ties.",
  },
  {
    phase: "Hunt",
    detail:
      "Resolve A through C, First to Last. Roll, use eligible Boons, record damage, and resolve claims immediately.",
  },
  {
    phase: "Victory Check",
    detail:
      "If anyone has 15+ Reputation after all hunts, end the game. Most Reputation wins; skip the remaining phases.",
  },
  {
    phase: "Visit the Market",
    detail: "Everyone may buy Boons and convert 2 Available Attention into 1 Gold.",
  },
  {
    phase: "Update Bounties",
    detail:
      "Process A through C: resolve occupied slots’ end-of-round behavior or refill empty slots as allowed. An empty board and deck ends the game.",
  },
  {
    phase: "Refresh Attention",
    detail:
      "Hunting refreshes up to 2 Spent Attention; PREPARE refreshes all. Return cards and pawns, with PRE + PARE on a one-round cooldown.",
  },
];

export const marketBoons = [
  {
    name: "Shield",
    asset: "shield",
    price: 0,
    effect: "Cancel a hostile Reroll or −1 Damage Boon targeting your attack.",
  },
  {
    name: "Reroll",
    asset: "reroll",
    price: 1,
    effect: "Reroll one eligible Attack Die. Keep the new result.",
  },
  {
    name: "−1 Damage",
    asset: "minus-one",
    price: 1,
    effect: "Reduce an eligible attack’s damage by 1 before recording.",
  },
  {
    name: "+1 Damage",
    asset: "plus-one",
    price: 2,
    effect: "Add 1 damage to an eligible attack before recording.",
  },
  {
    name: "Boost",
    asset: "boost",
    price: 2,
    effect: "Refresh up to 2 Attention, or add 2 temporary commitment before positioning.",
  },
  {
    name: "Extra Die",
    asset: "extra-die",
    price: 3,
    effect: "Roll one additional die and add its result. Only one Extra Die Boon per attack.",
  },
];
