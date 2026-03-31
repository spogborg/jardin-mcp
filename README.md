# 🌿 garden-mcp

An MCP (Model Context Protocol) server for plant identification and garden task management — built to run with Claude Code. No extra API costs. Claude Code is the intelligence layer; this server handles data and system integrations.

## What it does
- Add plants by name → Claude generates full care profile → saved to local JSON
- List your garden roster with watering, feeding, pruning schedules
- Batch all care tasks into optimized garden sessions to save time
- Push sessions directly to Apple Calendar or Apple Reminders via AppleScript

## Usage

Clone and build:
```bash
npm install
npm run build
```

Add to your Claude Code MCP config:
```json
{
  "mcpServers": {
    "garden": {
      "command": "node",
      "args": ["/path/to/garden-mcp/dist/index.js"]
    }
  }
}
```

Start Claude Code:
```bash
claude --mcp-config garden.json
```

## Example commands
```
add a tomato plant growing outdoors
add a pothos indoors on my desk
list my plants
batch my garden tasks for this week
push garden session to my calendar for Saturday at 9am for 30 minutes
add garden tasks to my reminders for Saturday
```

## Tools

| Tool | What it does |
|---|---|
| `plant_add` | Save a plant + care profile to roster |
| `plant_list` | List all plants with care info |
| `plant_remove` | Remove a plant by id |
| `task_batch` | Generate optimized session plan from all plants |
| `calendar_add` | Add session to Apple Calendar via AppleScript |
| `reminder_add` | Add tasks to Apple Reminders via AppleScript |

## Architecture
```
You (Claude Code) → MCP tools → garden.json (local data)
                             → Calendar.app (AppleScript)
                             → Reminders.app (AppleScript)
```

Claude Code is the brain. The MCP server is pure data + system integration. No external APIs, no cost beyond your Claude Code subscription.

## Status
✅ Phase 1 — MCP scaffold  
✅ Phase 2 — Plant roster with JSON persistence  
✅ Phase 3 — Task batching + Calendar/Reminders push  

## Roadmap

### 🌱 Planned
- [ ] Photo-based plant identification via Claude Vision
- [ ] Health triage — photo check-in returns pest/disease diagnosis

### 🗺️ Future scope
- [ ] **Zip code planting calendar** — vegetable garden recommendations by region and season (e.g. Pacific Northwest planting windows, last frost dates, succession planting)
- [ ] **Slack integration** — push weekly garden session plan directly to a Slack channel or DM

## Requirements
- Mac (AppleScript for Calendar/Reminders)
- Claude Code
- Node.js v20+