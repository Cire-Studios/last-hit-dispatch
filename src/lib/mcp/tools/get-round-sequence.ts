import { defineTool } from "@lovable.dev/mcp-js";

import { roundSequence } from "../content";

export default defineTool({
  name: "get_round_sequence",
  title: "Get round sequence",
  description:
    "Get the ordered phases of a single round in Last Hit, from Recover through Claim.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(roundSequence, null, 2) }],
    structuredContent: { phases: roundSequence },
  }),
});
