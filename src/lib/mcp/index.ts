import { defineMcp } from "@lovable.dev/mcp-js";

import getDevelopmentStatus from "./tools/get-development-status";
import getGameOverview from "./tools/get-game-overview";
import getRoundSequence from "./tools/get-round-sequence";
import listBounties from "./tools/list-bounties";
import listComponents from "./tools/list-components";
import listMechanics from "./tools/list-mechanics";

export default defineMcp({
  name: "last-hit-mcp",
  title: "Last Hit",
  version: "0.1.0",
  instructions:
    "Public information about Last Hit, a 2–6 player bounty-hunter board game in development at Cire Studios. Use these tools to answer questions about the game's pitch, core mechanics, round sequence, starter bounties, box components, and development status. All data is the same public marketing content published on the landing page.",
  tools: [
    getGameOverview,
    listMechanics,
    getRoundSequence,
    listBounties,
    listComponents,
    getDevelopmentStatus,
  ],
});
