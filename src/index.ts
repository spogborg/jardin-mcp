import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { plantTools, handlePlantTool } from "./tools/plant-tools.js";
import { batchTools, handleBatchTool } from "./tools/batch-tools.js";
import { calendarTools, handleCalendarTool } from "./tools/calendar-tools.js";

const server = new Server(
  { name: "garden-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Register all tools from all modules
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [...plantTools, ...batchTools, ...calendarTools] };
});

// Route each tool call to the right handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name.startsWith("plant_"))    return handlePlantTool(name, args ?? {});
  if (name.startsWith("task_"))     return handleBatchTool(name, args ?? {});
  if (name.startsWith("calendar_")) return handleCalendarTool(name, args ?? {});
  if (name.startsWith("reminder_")) return handleCalendarTool(name, args ?? {});

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Garden MCP server running — tools: plants, batch, calendar, reminders");
}

main().catch(console.error);