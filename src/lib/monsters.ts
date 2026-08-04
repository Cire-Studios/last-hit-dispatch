export type MonsterTier = "Minor" | "Standard" | "Premium" | "Elite" | "Legendary";

export type Monster = {
  slug: string;
  name: string;
  tier: MonsterTier;
  health: number | null;
  reputation: number;
  hook: string;
  lore: string[];
  temperament: string;
  habitat: string;
  warningSigns: string[];
  huntingAdvice: string[];
  behavior: { name: string; summary: string; verified: boolean; flavor?: boolean };
  bountyImage: string;
  backgroundImage: string;
  imageAlt: string;
};

const assetRoot = "/last-hit";

function art(slug: string) {
  return {
    bountyImage: `${assetRoot}/components/${slug}-bounty.webp`,
    backgroundImage: `${assetRoot}/monsters/backgrounds/${slug}.webp`,
  };
}

export const monsters: Monster[] = [
  {
    slug: "feral-imp",
    name: "Feral Imp",
    tier: "Minor",
    health: 4,
    reputation: 2,
    hook: "Small claws, quick feet, and a talent for turning confidence into confusion.",
    lore: [
      "A Feral Imp rarely wins by strength. It wins by making a hunter look the wrong way at exactly the wrong moment.",
      "Imps haunt abandoned camps and forgotten storehouses, collecting bright scraps as trophies. A single imp is a nuisance; an imp that knows it is being hunted is a test of patience.",
    ],
    temperament: "Restless, mocking, and bold whenever it believes it has found an escape.",
    habitat: "Ruined outposts, cellar tunnels, and the warm hollows beneath old roads.",
    warningSigns: [
      "Missing buckles and polished trinkets",
      "Quick laughter from an empty room",
      "Tiny tracks that double back without warning",
    ],
    huntingAdvice: [
      "Watch the exits before drawing steel.",
      "Do not let its noise separate you from the lineup.",
      "Save a little certainty for the moment it finally stands still.",
    ],
    behavior: {
      name: "Skittish",
      summary:
        "After an attack, if exactly 1 Health remains, the Feral Imp escapes. Discard all Damage and Boons, place it at the bottom of the Bounty Deck, and leave its slot empty until Reset & Refill. Cancel all remaining attacks against it.",
      verified: true,
    },
    ...art("feral-imp"),
    imageAlt: "Feral Imp crouched among scraps and stolen trinkets",
  },
  {
    slug: "razorwing-harpy",
    name: "Razorwing Harpy",
    tier: "Minor",
    health: 4,
    reputation: 2,
    hook: "The shadow arrives first. The talons are never far behind.",
    lore: [
      "Razorwings circle high enough to become a rumor against the clouds, then descend in a blur of hooked feathers and cutting wind.",
      "They favor hunters who watch the ground too closely. By the time the flock's cry rolls down the cliff face, the first strike has already been chosen.",
    ],
    temperament: "Patient at a distance, merciless once prey breaks formation.",
    habitat: "Wind-carved cliffs, ruined towers, and high passes littered with old nests.",
    warningSigns: [
      "Long scratches on exposed stone",
      "A sudden silence among smaller birds",
      "Feathers sharp enough to score leather",
    ],
    huntingAdvice: [
      "Keep the whole sky in view.",
      "Stay close enough that no hunter becomes an easy solitary target.",
      "Strike when it commits to a descent, not while it circles.",
    ],
    behavior: {
      name: "Swap",
      summary:
        "After an attack, if fewer than 3 Health remain and the Harpy is not defeated, discard its staged Boons and set it aside. Draw the next Bounty into its slot, then return the Harpy to the top of the Bounty Deck with its accumulated Damage.",
      verified: true,
    },
    ...art("razorwing-harpy"),
    imageAlt: "Razorwing Harpy descending with bladed wings spread wide",
  },
  {
    slug: "hill-ogre",
    name: "Hill Ogre",
    tier: "Standard",
    health: 6,
    reputation: 3,
    hook: "It came down from the hills hungry. The Guild supplied a price.",
    lore: [
      "A Hill Ogre is not subtle, but subtlety is unnecessary when every path bends beneath your stride. It follows livestock trails downhill and leaves broken walls where gates once stood.",
      "The creature's appetite is legendary. So is its stubbornness: once an ogre chooses a prize, noise, pain, and good sense seldom persuade it to turn aside.",
    ],
    temperament:
      "Single-minded, territorial, and quick to answer resistance with overwhelming force.",
    habitat: "Rocky uplands, shepherd roads, and shallow caves overlooking settled valleys.",
    warningSigns: [
      "Trees broken above a hunter's reach",
      "Boulders shifted from old resting places",
      "Deep footprints pointed steadily downhill",
    ],
    huntingAdvice: [
      "Keep your distance until its attention is fixed.",
      "Leave room to move; an ogre punishes crowded ground.",
      "Its intentions are plain—use that certainty before it uses its strength.",
    ],
    behavior: {
      name: "No special behavior",
      summary: "It came down from the hills hungry. The Guild supplied a price.",
      verified: true,
      flavor: true,
    },
    ...art("hill-ogre"),
    imageAlt: "Massive Hill Ogre carrying a crude club",
  },
  {
    slug: "grave-hound",
    name: "Grave Hound",
    tier: "Standard",
    health: 5,
    reputation: 3,
    hook: "A patient tracker that remembers every trail leading home.",
    lore: [
      "Grave Hounds prowl the boundary between abandoned roads and older resting places. Their low call carries through stone as easily as air.",
      "They do not chase every scent. They choose one, follow it without fatigue, and wait for fear to make the quarry careless.",
    ],
    temperament: "Coldly persistent, quiet, and most dangerous when apparently driven away.",
    habitat: "Barrow fields, old battle roads, and forests where the soil has been disturbed.",
    warningSigns: [
      "Pawprints that stop at bare stone",
      "A low howl with no answering echo",
      "Cold breath in otherwise still air",
    ],
    huntingAdvice: [
      "Assume it knows where you have been.",
      "Do not mistake retreat for surrender.",
      "Make the decisive strike before the trail turns back toward you.",
    ],
    behavior: {
      name: "Always on Guard",
      summary:
        "Never stage Boons beneath this Bounty. If an effect would cause the Grave Hound to gain a Boon, ignore that effect.",
      verified: true,
    },
    ...art("grave-hound"),
    imageAlt: "Grave Hound stalking through a mist-covered burial ground",
  },
  {
    slug: "ironhide-boar",
    name: "Ironhide Boar",
    tier: "Standard",
    health: 5,
    reputation: 3,
    hook: "A living battering ram protected by plates of scarred hide.",
    lore: [
      "An Ironhide Boar grows a second armor from every failed hunt. Mud, resin, stone, and old scars harden across its shoulders until even seasoned hunters question where to strike.",
      "It announces a charge by scraping one forehoof through the earth. That warning is brief, but it is honest.",
    ],
    temperament: "Defiant, direct, and eager to charge whatever refuses to yield ground.",
    habitat: "Dense woodland, churned riverbanks, and fields at the edge of old forests.",
    warningSigns: [
      "Bark stripped at shoulder height",
      "Furrows ending in shattered stone",
      "A metallic rasp beneath heavy breathing",
    ],
    huntingAdvice: [
      "Do not waste your opening against its strongest angle.",
      "Let the hide break before committing everything.",
      "A straight charge is predictable; surviving it is the difficult part.",
    ],
    behavior: {
      name: "Breakable Hide",
      summary:
        "While more than 3 Health remains, reduce the Final Damage of each attack by 1, to a minimum of 0. At 3 or fewer Health, the hide no longer reduces Damage.",
      verified: true,
    },
    ...art("ironhide-boar"),
    imageAlt: "Ironhide Boar armored in thick overlapping plates",
  },
  {
    slug: "stone-golem",
    name: "Stone Golem",
    tier: "Premium",
    health: 7,
    reputation: 4,
    hook: "It does not rage. It advances, one ruinous step at a time.",
    lore: [
      "No guild record agrees on who shaped the first Stone Golem. The oldest accounts simply describe one walking out of a collapsed sanctuary with its purpose intact and its makers gone.",
      "A golem wastes no motion. Every turn, lifted arm, and grinding step serves a command no living hunter has heard.",
    ],
    temperament: "Unhurried, tireless, and completely indifferent to intimidation.",
    habitat: "Collapsed temples, mountain roads, and quarries abandoned without explanation.",
    warningSigns: [
      "Regular impacts felt through the ground",
      "Fresh stone dust without quarry work",
      "Carved fragments arranged in a straight path",
    ],
    huntingAdvice: [
      "Plan for a long fight.",
      "Study its rhythm before choosing your opening.",
      "Do not confuse slowness with hesitation.",
    ],
    behavior: {
      name: "Stone Cycle",
      summary:
        "During Monster Effects, alternate between Normal and Hardened states. While Hardened, reduce Final Damage by 1, to a minimum of 0. The Stone Golem begins Normal.",
      verified: true,
    },
    ...art("stone-golem"),
    imageAlt: "Ancient Stone Golem striding from ruined masonry",
  },
  {
    slug: "moss-troll",
    name: "Moss Troll",
    tier: "Premium",
    health: 6,
    reputation: 4,
    hook: "The forest keeps what falls within it—and sometimes teaches it to rise again.",
    lore: [
      "Moss Trolls sleep so deeply that saplings take root across their backs. Travelers have rested beside one and only learned their mistake when the hillside opened its eyes.",
      "Wounds vanish beneath wet moss and new growth. A hunt that loses momentum soon becomes a hunt that must begin again.",
    ],
    temperament: "Drowsy until provoked, then relentless in defense of its ground.",
    habitat: "Rain-soaked forests, overgrown bridges, and ravines where sunlight rarely reaches.",
    warningSigns: [
      "Moss growing against the direction of light",
      "Freshly broken trunks without tracks",
      "A hillside that seems to breathe",
    ],
    huntingAdvice: [
      "Once the attack begins, do not let the pressure fade.",
      "Treat every pause as time the troll can reclaim.",
      "Bring enough force to finish what you start.",
    ],
    behavior: {
      name: "Regeneration",
      summary:
        "During Monster Effects, remove 1 Damage from this Bounty. If it has no Damage, nothing happens.",
      verified: true,
    },
    ...art("moss-troll"),
    imageAlt: "Moss Troll rising from a rain-darkened forest",
  },
  {
    slug: "gilded-manticore",
    name: "Gilded Manticore",
    tier: "Premium",
    health: 5,
    reputation: 4,
    hook: "Its golden hide has inspired far more greed than caution.",
    lore: [
      "The Gilded Manticore shines like treasure in torchlight, and that is the first trap. Hunters who stare at the prize forget the tail, the wings, and the intelligence watching behind a lion's eyes.",
      "It collects trophies from those who arrive thinking only of their reward. Many of those trophies still bear guild marks.",
    ],
    temperament: "Proud, calculating, and quick to exploit rivalry among its pursuers.",
    habitat: "Sunlit ruins, high desert vaults, and lairs surrounded by conspicuous treasure.",
    warningSigns: [
      "Golden hairs caught on broken stone",
      "Valuables left where they are too easy to see",
      "Three different sets of tracks entering one lair",
    ],
    huntingAdvice: [
      "Watch the creature, not the prize.",
      "Expect it to turn hunter against hunter.",
      "Agree on nothing you are unwilling to defend once the bounty is near.",
    ],
    behavior: {
      name: "No special behavior",
      summary: "Its golden hide has inspired far more greed than caution.",
      verified: true,
      flavor: true,
    },
    ...art("gilded-manticore"),
    imageAlt: "Gilded Manticore guarding trophies in a ruined lair",
  },
  {
    slug: "sandworm",
    name: "Sandworm",
    tier: "Elite",
    health: 7,
    reputation: 4,
    hook: "The desert hunts in silence. Feel the earth tremble, then move.",
    lore: [
      "A Sandworm can cross a dune sea without breaking the surface. Its passage appears first as a faint shiver in a cup, a sliding pebble, or a line in the sand moving against the wind.",
      "It attacks from below and disappears the same way, leaving hunters to wonder whether the ground is safe or merely waiting.",
    ],
    temperament: "Ambush-driven, territorial, and sensitive to every careless footfall.",
    habitat: "Open dunes, dry lake beds, and trade roads built over deep sand.",
    warningSigns: [
      "Ripples crossing sand against the wind",
      "Half-buried bones with no scavenger marks",
      "A tremor that follows moving feet",
    ],
    huntingAdvice: [
      "Track the ground, not the horizon.",
      "Be ready for the target to vanish from reach.",
      "Time your commitment around the moments it surfaces.",
    ],
    behavior: {
      name: "Burrow",
      summary:
        "During Monster Effects, alternate between Surfaced and Burrowed. The Sandworm begins Surfaced. It cannot be targeted and gains no Neglect Boon while Burrowed.",
      verified: true,
    },
    ...art("sandworm"),
    imageAlt: "Sandworm erupting from a desert dune",
  },
  {
    slug: "crystal-basilisk",
    name: "Crystal Basilisk",
    tier: "Elite",
    health: 7,
    reputation: 5,
    hook: "Break the gaze. Shatter the crystal hide. Strike true—or be stone.",
    lore: [
      "Crystal Basilisks grow brighter with age as mineral plates replace scale and scar. In darkness, an elder can resemble a vein of moonlit ore until it turns its head.",
      "Its gaze is the greater danger. Hunters who falter beneath it feel resolve harden into stillness long before flesh follows.",
    ],
    temperament: "Still, watchful, and devastating when challenged face-to-face.",
    habitat: "Crystal caverns, exposed fault lines, and mines abandoned after sudden silence.",
    warningSigns: [
      "Animal shapes preserved in pale stone",
      "Prismatic light with no visible source",
      "Scratches that glitter instead of shedding dust",
    ],
    huntingAdvice: [
      "Never depend on a weak strike to carry the moment.",
      "Commit enough force to break through cleanly.",
      "Respect the gaze even when another hunter appears more threatening.",
    ],
    behavior: {
      name: "Petrifying Gaze",
      summary:
        "After a hunter deals 0 Final Damage, move all of that hunter's Available Attention to Spent. Petrifying Gaze does not resolve if the attack is canceled.",
      verified: true,
    },
    ...art("crystal-basilisk"),
    imageAlt: "Crystal Basilisk coiled in a glittering cavern",
  },
  {
    slug: "mire-hydra",
    name: "Mire Hydra",
    tier: "Elite",
    health: null,
    reputation: 5,
    hook: "Many heads. Endless hunger. One monster that refuses simple answers.",
    lore: [
      "A Mire Hydra turns still water into a maze of false ripples. One head watches, another waits beneath the surface, and a third studies whichever hunter believes they have found the opening.",
      "No two accounts agree on how many heads a mature hydra possesses. The survivors agree only that counting them during the fight is a poor use of time.",
    ],
    temperament: "Opportunistic, many-minded, and impossible to distract in only one direction.",
    habitat: "Blackwater marshes, drowned roads, and reed-choked ruins.",
    warningSigns: [
      "Several wakes moving around one still point",
      "Reeds bitten cleanly at different heights",
      "Calls answered from too many directions",
    ],
    huntingAdvice: [
      "Expect the hunt to grow more complicated before it ends.",
      "Coordinate around the whole creature, not the nearest head.",
      "Leave room for the bounty's unusual endurance.",
    ],
    behavior: {
      name: "Many-Headed",
      summary:
        "Defeat the Mire Hydra by covering all six numbered heads, not by dealing Damage. Each die covers its matching head. Momentum adds 1 and Split Attention subtracts 1 from each die; Off Guard adjusts one die by 1. The hunter who covers the last head claims the Bounty.",
      verified: true,
    },
    ...art("mire-hydra"),
    imageAlt: "Many-headed Mire Hydra emerging from a moonlit swamp",
  },
  {
    slug: "ember-drake",
    name: "Ember Drake",
    tier: "Legendary",
    health: 9,
    reputation: 6,
    hook: "When the sky burns orange, find cover before you seek glory.",
    lore: [
      "An Ember Drake carries the heat of a forge beneath every scale. Its wings scatter sparks across the battlefield, and its breath turns old timber and brave plans into the same drifting ash.",
      "A drake remembers injury. More dangerously, it remembers the hunter responsible and has the patience to settle that account from the air.",
    ],
    temperament: "Proud, vengeful, and fully aware of the fear created by its shadow.",
    habitat: "Volcanic ridges, burned fortresses, and mountain vaults warm through winter.",
    warningSigns: [
      "Ash falling beneath a clear sky",
      "Stone warm long after sunset",
      "A vast shadow followed by the smell of iron",
    ],
    huntingAdvice: [
      "Plan for fire that reaches farther than one hunter.",
      "Do not spend every advantage before the drake commits.",
      "Legendary glory demands a lineup that can survive the answer.",
    ],
    behavior: {
      name: "Fire Sweep",
      summary:
        "After Attack Lineups are finalized and before attacks, roll one die. On 1–4, remove the hunter in that lineup position and cancel their attack; their Attention remains Spent. On 5–6, or if that position is empty, nothing happens.",
      verified: true,
    },
    ...art("ember-drake"),
    imageAlt: "Ember Drake sweeping over a burning mountain stronghold",
  },
];

export const monsterTiers: MonsterTier[] = ["Minor", "Standard", "Premium", "Elite", "Legendary"];

export function getMonster(slug: string) {
  return monsters.find((monster) => monster.slug === slug);
}

export function getMonsterNeighbors(slug: string) {
  const index = monsters.findIndex((monster) => monster.slug === slug);
  if (index < 0) return { previous: undefined, next: undefined };
  return {
    previous: index > 0 ? monsters[index - 1] : undefined,
    next: index < monsters.length - 1 ? monsters[index + 1] : undefined,
  };
}
