# 🌿 garden-mcp

An MCP (Model Context Protocol) server for plant identification and garden task management — built to run with Claude Code.

## What it does
- Identify plants by name or photo and get full care profiles
- Manage your personal garden roster
- Generate maintenance schedules with watering, feeding, and pruning cadences
- Batch tasks and push to Calendar or Reminders

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

Then in Claude Code:
```
add a tomato plant growing outdoors
```

## Status
🚧 Active development — Phase 1 complete (MCP scaffold + tool definitions)

## Roadmap
- [x] MCP server scaffold
- [x] Plant identify, add, list tools
- [ ] Claude Vision plant ID from photo
- [ ] SQLite garden roster with persistence
- [ ] Care schedule generation
- [ ] Calendar + Reminders batching
