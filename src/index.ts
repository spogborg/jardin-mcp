import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { plantTools, handlePlantTool } from "./tools/plant-tools.js";

// Create the MCP server
const server = new Server(
  { name: "garden-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Register all available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [...plantTools] };
});

// Route tool calls to the right handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name.startsWith("plant_")) {
    return handlePlantTool(name, args ?? {});
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start the server using stdio (how Claude Code communicates with it)
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Garden MCP server running");
}

main().catch(console.error);