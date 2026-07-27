import { defineTool } from "@lovable.dev/mcp-js";

import { overview } from "../content";

export default defineTool({
  name: "get_game_overview",
  title: "Get game overview",
  description:
    "Get the public overview of the board game Last Hit: pitch, player count, playtime, age, weight, and win condition.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(overview, null, 2) }],
    structuredContent: overview,
  }),
});
