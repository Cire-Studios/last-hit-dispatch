import { defineTool } from "@lovable.dev/mcp-js";

import { mechanics } from "../content";

export default defineTool({
  name: "list_mechanics",
  title: "List core mechanics",
  description:
    "List the core mechanics of Last Hit: secret planning, lineup positioning, dice and Boons, Reputation and Gold, and Market purchases and recovery.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(mechanics, null, 2) }],
    structuredContent: { mechanics },
  }),
});
