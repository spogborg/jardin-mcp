# Garden Setup

Welcome to garden-mcp. Run this once to get started.

## Steps

1. Confirm the MCP server is connected by calling `plant_list`
2. If it returns successfully, tell the user the server is connected
3. Ask the user:
   - How many plants do they have?
   - Are they mostly indoor, outdoor, or mixed?
   - Do they want reminders pushed to Calendar, Reminders, or both?
4. Save their preferences by calling `plant_add` for any plants they want
   to add right now — offer to add 2-3 to get started
5. Suggest running `/garden-week` to see their first plan

## Welcome message

Show this first:
```
🌿 Welcome to garden-mcp

Your personal garden manager — powered by Claude Code.
No subscriptions. No app. Just your terminal and your plants.

Let's get your garden set up.
```