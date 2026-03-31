---
description: Batch all garden tasks for the week, push to Calendar with smart duration, optionally add to Reminders
---

# Garden Weekly Batch

## Steps

1. Call `plant_list` to get the full garden roster
2. If no plants, tell the user and stop
3. Group tasks by type:
   - 💧 Watering: all plants that need water
   - 🌱 Feeding: plants due for fertilizer
   - ✂️ Pruning/checking: seasonal needs
4. Calculate estimated session time:
   - 2 min per plant to water
   - 3 min per plant to feed
   - 5 min per plant to prune
   - Add 5 min buffer
   - Round up to nearest 15 min
5. Ask the user two questions before pushing anything:
   - "What day and time works for your garden session? (default: Saturday 9am)"
   - "Should I also add this to Apple Reminders as a checklist? (yes/no)"
   - Wait for their answers before proceeding
6. Call `calendar_add` with:
   - Title: "🌿 Garden Session — [X] plants"
   - The calculated duration in minutes
   - Full task list as notes
7. If user said yes to Reminders, call `reminder_add` with the same task list
8. Confirm what was pushed

## Output format

Show the plan before asking:
```