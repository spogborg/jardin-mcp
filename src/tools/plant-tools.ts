import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { plantDB } from "../database.js";

export const plantTools: Tool[] = [
  {
    name: "plant_add",
    description: "Save a plant and its care profile to the garden roster. Claude should determine the care profile before calling this tool.",
    inputSchema: {
      type: "object",
      properties: {
        name:     { type: "string", description: "Common name e.g. lavender" },
        nickname: { type: "string", description: "Personal nickname e.g. 'big lavender by the fence'" },
        location: { type: "string", description: "indoor / outdoor / balcony" },
        species:  { type: "string", description: "Scientific name" },
        watering: { type: "string", description: "Watering schedule and amount" },
        sunlight: { type: "string", description: "Sunlight requirements" },
        feeding:  { type: "string", description: "Fertilizer schedule" },
        pruning:  { type: "string", description: "When and how to prune" },
        seasonal_notes: { type: "string", description: "Seasonal care changes" },
        difficulty:     { type: "string", description: "easy / moderate / expert" },
        summary:        { type: "string", description: "One sentence description" }
      },
      required: ["name", "location", "watering", "sunlight", "feeding", "pruning", "seasonal_notes", "difficulty", "summary"]
    }
  },
  {
    name: "plant_list",
    description: "List all plants in the garden roster with their care profiles",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "plant_remove",
    description: "Remove a plant from the garden roster by its id",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Plant id from plant_list" }
      },
      required: ["id"]
    }
  }
];

export async function handlePlantTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<{ content: Array<{ type: string; text: string }> }> {

  if (toolName === "plant_add") {
    const id = await plantDB.add(
      args.name as string,
      (args.nickname as string) ?? args.name as string,
      args.location as string,
      (args.species as string) ?? "",
      {
        watering:       args.watering as string,
        sunlight:       args.sunlight as string,
        feeding:        args.feeding as string,
        pruning:        args.pruning as string,
        seasonal_notes: args.seasonal_notes as string,
        difficulty:     args.difficulty as string,
        summary:        args.summary as string
      }
    );

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          status: "added",
          id,
          name: args.name,
          message: `✓ ${args.nickname ?? args.name} saved to your garden roster`
        }, null, 2)
      }]
    };
  }

  if (toolName === "plant_list") {
    const plants = await plantDB.list();
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          status: "ok",
          count: plants.length,
          plants: plants.length > 0 ? plants : []
        }, null, 2)
      }]
    };
  }

  if (toolName === "plant_remove") {
    await plantDB.remove(args.id as number);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ status: "removed", id: args.id })
      }]
    };
  }

  throw new Error(`Unhandled tool: ${toolName}`);
}