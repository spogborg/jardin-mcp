> 🔒 Personal project — clone freely, PRs not accepted.
> Built with Claude Code as a learning project.

# 🌿 Jardinning

A personal garden management tool built on Claude Code and MCP. Track your plants, log what you notice, and keep care schedules grounded in what's actually happening in your garden — all from your terminal. Claude is the intelligence; this server handles the data.

## What it does
- Add plants by name → Claude generates a full care profile → saved to local JSON
- Log observations as you go — yellowing leaves, pests, new growth, anything you notice
- Claude diagnoses, suggests care adjustments, and updates the schedule when you confirm
- Full history per plant — every observation and care change is saved
- Batch all care tasks into optimized garden sessions to save time
- Push sessions directly to Apple Calendar or Apple Reminders via AppleScript

## Usage

### 1. Clone and build
```bash
git clone https://github.com/YOUR_USERNAME/jardinning.git
cd jardinning
npm install
npm run build
```

### 2. Create your MCP config file

Create a file called `garden.json` anywhere on your machine — your home folder is fine:
```bash
touch ~/garden.json
```

Paste this into it — replacing the path with your actual absolute path:
```json
{
  "mcpServers": {
    "garden": {
      "command": "node",
      "args": ["/Users/YOUR_USERNAME/jardinning/dist/index.js"]
    }
  }
}
```

To find your exact path:
```bash
cd jardinning && pwd
# copy the output and append /dist/index.js
```

### 3. Start Claude Code
```bash
claude --mcp-config ~/garden.json
```

### 4. Run setup
```
/garden-setup
```

That's it. Claude walks you through adding your first plants.

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
| `plant_observe` | Log an observation against a plant (symptoms, changes, issues) |
| `plant_update_care` | Update a care profile field — previous value saved to history |
| `plant_history` | Show full observation and care change history for a plant |
| `task_batch` | Generate optimized session plan from all plants |
| `calendar_add` | Add session to Apple Calendar via AppleScript |
| `reminder_add` | Add tasks to Apple Reminders via AppleScript |

### Observations and care updates

Just describe what you see — Claude logs it and adjusts care if needed:

```
my lavender looks a bit yellow at the base
the tomato is wilting between waterings
white powder on the rose leaves
new growth on the pothos looking good
```

Claude will:
1. Log the observation with a severity (`info` / `warning` / `critical`)
2. Diagnose the likely cause from its knowledge
3. Suggest a care adjustment if one is needed
4. Ask whether to update the care schedule
5. Save the previous value to history before changing anything

To review a plant's history:
```
show me the history for my lavender
what observations have I logged for the tomato
```

## Slash Commands

Once connected in Claude Code, these commands are available to anyone:

| Command | What it does |
|---|---|
| `/garden-setup` | First-time setup walkthrough |
| `/garden-week` | Preview this week's tasks — no Calendar push |
| `/garden-batch` | Batch tasks + push to Apple Calendar and Reminders |

### How to use

Start Claude Code with the MCP config:
```bash
claude --mcp-config garden.json
```

Then just type the command:
```
/garden-batch
```

Claude handles the rest — reads your plants, groups the tasks,
pushes to your Calendar and Reminders automatically.

## Automation

The slash commands replace cron — run `/garden-batch` whenever
you want, or ask Claude to remind you:
```
every time I start a Claude Code session, run /garden-week so 
I can see what needs doing in my garden this week
```

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
✅ Phase 4 — Observations, care history, adaptive care updates

## Roadmap

### 🌱 Planned
- [ ] Photo-based plant identification via Claude Vision
- [ ] Health triage — photo check-in returns pest/disease diagnosis

### 🗺️ Future scope
- [ ] **Zip code planting calendar** — vegetable garden recommendations by region and season (e.g. Pacific Northwest planting windows, last frost dates, succession planting)
- [ ] **Slack integration** — push weekly garden session plan directly to a Slack channel or DM

## What I learned

Built this to get hands-on with agentic AI — not just read about it.

**Give the model one job.** The instinct is to let Claude do everything. The better design is to keep data persistence and integrations as dumb, reliable tools. The MCP server doesn't think. Claude does.

**Weight matters.** Early versions used native compiled modules and external API calls. Swapped it all for a JSON file and let Claude Code be the intelligence layer. Same output, much less complexity.

**Know what not to build.** Dropped the React UI, the mobile PWA, the cron scheduler — not because they were hard, but because they were wrong for a personal terminal tool. That call is the same skill whether you're writing a side project or managing a roadmap.

**Data outlives the conversation.** Without persistent plant history, every session starts cold. The feedback loop — log what you notice, adjust care based on real outcomes — only works because the data survives between sessions. That applies to any agentic system.

**CLAUDE.md is underrated.** Treating the project brief as a first-class artifact made every session consistent without re-explaining context. The equivalent in product work is a well-written PRD that the team actually reads.

## Requirements
- Mac (AppleScript for Calendar/Reminders)
- Claude Code
- Node.js v20+
