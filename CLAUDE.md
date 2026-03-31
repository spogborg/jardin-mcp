# Garden MCP — Project Context

## What this project is
A personal garden management tool built on Claude Code + MCP.
Claude Code is the intelligence layer. The MCP server handles
data persistence and system integrations (Calendar, Reminders).

## MCP Server
Always start with the MCP config:
```bash
claude --mcp-config garden.json
```

Available tools:
- `plant_add` — save a plant + care profile to roster
- `plant_list` — list all plants with care info
- `plant_remove` — remove a plant by id
- `task_batch` — read all plants and generate session plan
- `calendar_add` — push event to Apple Calendar via AppleScript
- `reminder_add` — push task to Apple Reminders via AppleScript

## Database
Plants are stored in `garden.json` at the project root.
Schema per plant:
```json
{
  "id": 1234567890,
  "name": "lavender",
  "nickname": "lavender by the fence",
  "location": "outdoor",
  "species": "Lavandula angustifolia",
  "added_at": "2026-03-30T09:00:00.000Z",
  "care_profile": {
    "watering": "...",
    "sunlight": "...",
    "feeding": "...",
    "pruning": "...",
    "seasonal_notes": "...",
    "difficulty": "easy",
    "summary": "..."
  }
}
```

## How to generate a care profile
When a user adds a plant, Claude should:
1. Use its own knowledge to generate the care profile
2. Never call an external API for plant data
3. Always follow the care profile schema above exactly
4. Call `plant_add` with all fields populated
5. Confirm back to the user with a clean summary

## Care profile standards
- `watering` — specific cadence e.g. "Every 7-10 days, allow soil to dry between waterings"
- `sunlight` — specific e.g. "Full sun, minimum 6 hours direct light"
- `feeding` — seasonal e.g. "Monthly March–August with balanced fertilizer, none in winter"
- `pruning` — actionable e.g. "Deadhead after flowering, hard prune in early spring"
- `seasonal_notes` — what changes by season
- `difficulty` — easy / moderate / expert only
- `summary` — one sentence, plain English

## Slash commands
- `/garden-setup` — first time setup for new users
- `/garden-week` — preview this week's tasks
- `/garden-batch` — batch tasks and push to Calendar + Reminders

## Output style
- Be concise and action-oriented
- Use emoji sparingly: 🌿 💧 🌱 ✂️ only
- Always confirm tool calls with a one-line summary
- For plant lists, use a clean table format
- Never explain what MCP is unless asked

## Platform note
AppleScript tools (calendar_add, reminder_add) are Mac-only.
On non-Mac systems, tell the user and offer to show the task
plan in terminal instead.