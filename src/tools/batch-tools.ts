import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { plantDB } from "../database.js";

// Add this helper at the top of every tools file, just below the imports
function safeText(obj: unknown): string {
  const text = JSON.stringify(obj, null, 2);
  return text && text.trim().length > 0 ? text : "{}";
}

export const batchTools: Tool[] = [
  {
    name: "task_batch",
    description: "Read all plants and generate a batched garden session plan — groups watering, feeding, pruning tasks together to save time. Claude should suggest the best day based on the schedule.",
    inputSchema: {
      type: "object",
      properties: {
        days_ahead: {
          type: "number",
          description: "How many days ahead to plan for. Default 7."
        }
      }
    }
  }
];

export async function handleBatchTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<{ content: Array<{ type: string; text: string }> }> {

  if (toolName === "task_batch") {
    const plants = await plantDB.list();

    if (plants.length === 0) {
      return {
        content: [{
          type: "text",
          text: safeText({
            status: "empty",
            message: "No plants in roster yet. Add some plants first."
          })
        }]
      };
    }

    // Return all plant care profiles so Claude can reason about what needs doing
   // Replace this entire block inside the task_batch handler:
return {
  content: [{
    type: "text",
    text: safeText({
      status: "ok",
      days_ahead: (args.days_ahead as number) ?? 7,
      plant_count: plants.length,
      plants: plants.map(p => ({
        name: p.nickname ?? p.name,
        location: p.location,
        care_profile: p.care_profile
      }))
    })
  }]
};
  }

  throw new Error(`Unhandled batch tool: ${toolName}`);
}