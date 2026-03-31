import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { plantDB } from "../database.js";

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
          text: JSON.stringify({
            status: "empty",
            message: "No plants in roster yet. Add some plants first."
          })
        }]
      };
    }

    // Return all plant care profiles so Claude can reason about what needs doing
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          status: "ok",
          days_ahead: (args.days_ahead as number) ?? 7,
          plant_count: plants.length,
          plants: plants.map(p => ({
            name: p.nickname ?? p.name,
            location: p.location,
            care_profile: p.care_profile
          })),
          instruction: "Group tasks by type (watering, feeding, pruning). Suggest 1-2 optimal garden sessions. Format as a clear action plan."
        }, null, 2)
      }]
    };
  }

  throw new Error(`Unhandled batch tool: ${toolName}`);
}