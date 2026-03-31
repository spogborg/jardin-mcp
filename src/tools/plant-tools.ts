import { Tool } from "@modelcontextprotocol/sdk/types.js";

// Tool definitions — this is what Claude Code sees
export const plantTools: Tool[] = [
  {
    name: "plant_identify",
    description: "Identify a plant by common name and get its full care profile including watering, feeding, sunlight, and seasonal needs",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Common name of the plant e.g. 'tomato', 'pothos', 'lavender'"
        },
        location: {
          type: "string",
          description: "Where the plant lives e.g. 'indoor', 'outdoor', 'balcony'"
        }
      },
      required: ["name"]
    }
  },
  {
    name: "plant_add",
    description: "Add a plant to your garden roster and generate its care schedule",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Common name of the plant" },
        nickname: { type: "string", description: "Optional personal nickname e.g. 'big tomato by the fence'" },
        location: { type: "string", description: "Where it lives: indoor / outdoor / balcony / greenhouse" }
      },
      required: ["name"]
    }
  },
  {
    name: "plant_list",
    description: "List all plants in your garden roster with their next care tasks",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];

// Tool handlers — the actual logic
export async function handlePlantTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<{ content: Array<{ type: string; text: string }> }> {

  if (toolName === "plant_identify") {
    const name = args.name as string;
    const location = (args.location as string) ?? "unspecified";

    // In Phase 2 we'll call Claude API here for real intelligence
    // For now, return a structured placeholder so we can test the wiring
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          status: "identified",
          common_name: name,
          location,
          message: `Plant lookup for "${name}" — Claude intelligence will be wired in Phase 2`,
          care_profile: {
            watering: "TBD",
            sunlight: "TBD",
            feeding: "TBD"
          }
        }, null, 2)
      }]
    };
  }

  if (toolName === "plant_add") {
    const name = args.name as string;
    const nickname = (args.nickname as string) ?? name;
    const location = (args.location as string) ?? "unspecified";

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          status: "added",
          plant: { name, nickname, location, added_at: new Date().toISOString() },
          message: `${nickname} added to your garden. Database persistence coming in Phase 2.`
        }, null, 2)
      }]
    };
  }

  if (toolName === "plant_list") {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          status: "ok",
          plants: [],
          message: "Garden roster — database wiring coming in Phase 2"
        }, null, 2)
      }]
    };
  }

  throw new Error(`Unhandled plant tool: ${toolName}`);
}