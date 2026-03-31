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
🚧 Active development

## What works now
- [x] MCP server scaffold
- [x] Plant identify, add, list, remove tools
- [x] JSON file database — no external DB needed
- [x] Claude Code is the intelligence layer — no extra API cost
- [ ] Care schedule generation
- [ ] Task batching
- [ ] Calendar + Reminders integration
