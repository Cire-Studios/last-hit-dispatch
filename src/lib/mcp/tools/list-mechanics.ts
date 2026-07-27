import { defineTool } from "@lovable.dev/mcp-js";

import { mechanics } from "../content";

export default defineTool({
  name: "list_mechanics",
  title: "List core mechanics",
  description:
    "List the four core mechanics of Last Hit: programming in secret, positioning the attack lineup, splitting attention, and landing the last hit.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(mechanics, null, 2) }],
    structuredContent: { mechanics },
  }),
});
