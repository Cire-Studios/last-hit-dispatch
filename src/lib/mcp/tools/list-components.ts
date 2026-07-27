import { defineTool } from "@lovable.dev/mcp-js";

import { components } from "../content";

export default defineTool({
  name: "list_components",
  title: "List box components",
  description: "List what comes in the Last Hit box: cards, tokens, hunter kits, die, and board.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(components, null, 2) }],
    structuredContent: { components },
  }),
});
