import { defineTool } from "@lovable.dev/mcp-js";

import { developmentStatus } from "../content";

export default defineTool({
  name: "get_development_status",
  title: "Get development status",
  description:
    "Get the current public development status of Last Hit, including what is still in progress and how to get involved as a playtester.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(developmentStatus, null, 2) }],
    structuredContent: developmentStatus,
  }),
});
