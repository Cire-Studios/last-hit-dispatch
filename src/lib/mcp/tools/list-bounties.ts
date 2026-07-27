import { defineTool } from "@lovable.dev/mcp-js";

import { bounties } from "../content";

export default defineTool({
  name: "list_bounties",
  title: "List starter bounties",
  description:
    "List the starter bounty monsters shown on the Last Hit landing page, with their health and Reputation values.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(bounties, null, 2) }],
    structuredContent: { bounties },
  }),
});
