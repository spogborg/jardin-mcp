import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { plantDB } from "../database.js";

// Add this helper at the top of every tools file, just below the imports
function safeText(obj: unknown): string {
  const text = JSON.stringify(obj, null, 2);
  return text && text.trim().length > 0 ? text : "{}";
}

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
  },
  {
  name: "plant_observe",
  description: "Log an observation against a plant — symptoms, issues, changes noticed. Use when the user mentions anything they have seen or noticed about a plant.",
  inputSchema: {
    type: "object",
    properties: {
      plant_id:  { type: "number", description: "Plant id from plant_list" },
      note:      { type: "string", description: "What was observed e.g. 'yellowing lower leaves, soil was very dry'" },
      severity:  { type: "string", description: "info / warning / critical" }
    },
    required: ["plant_id", "note", "severity"]
  }
},
{
  name: "plant_update_care",
  description: "Update a specific field in a plant's care profile based on observed results. Use when the user wants to adjust watering, feeding or other care based on what they are seeing.",
  inputSchema: {
    type: "object",
    properties: {
      plant_id: { type: "number", description: "Plant id from plant_list" },
      field:    { type: "string", description: "Care profile field to update: watering / sunlight / feeding / pruning / seasonal_notes" },
      value:    { type: "string", description: "New value for the field" },
      reason:   { type: "string", description: "Why this change is being made e.g. 'user observed root rot, reducing watering frequency'" }
    },
    required: ["plant_id", "field", "value", "reason"]
  }
},
{
  name: "plant_history",
  description: "Show the full observation and care change history for a plant",
  inputSchema: {
    type: "object",
    properties: {
      plant_id: { type: "number", description: "Plant id from plant_list" }
    },
    required: ["plant_id"]
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

  if (toolName === "plant_observe") {
  const count = await plantDB.observe(
    args.plant_id as number,
    args.note as string,
    args.severity as string
  );
  return {
    content: [{
      type: "text",
      text: safeText({
        status: "logged",
        observation_count: count,
        message: `Observation logged`
      })
    }]
  };
}

if (toolName === "plant_update_care") {
  await plantDB.updateCareProfile(
    args.plant_id as number,
    args.field as string,
    args.value as string,
    args.reason as string
  );
  return {
    content: [{
      type: "text",
      text: safeText({
        status: "updated",
        field: args.field,
        new_value: args.value,
        message: `Care profile updated — previous value saved to history`
      })
    }]
  };
}

if (toolName === "plant_history") {
  const history = await plantDB.getHistory(args.plant_id as number);
  return {
    content: [{
      type: "text",
      text: safeText({
        status: "ok",
        ...history
      })
    }]
  };
}

  throw new Error(`Unhandled tool: ${toolName}`);
}