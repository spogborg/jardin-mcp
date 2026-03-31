# Garden Week Preview

Show this week's garden plan without pushing to Calendar or Reminders.
Good for a quick check of what needs doing.

## Steps

1. Call `plant_list` to get the full garden roster
2. For any plant with observations, call `plant_history` to check for unresolved warnings or critical issues
3. Group tasks by type across all plants
4. Estimate total time needed (roughly 2 min per plant)
5. Show the plan clearly — do NOT call calendar_add or reminder_add

## Output format
```
🌿 This week in your garden · [X] plants

💧 Water:   [plant list]
🌱 Feed:    [plant list]
✂️  Check:   [plant list]

⚠️  Alerts:  [plants with unresolved warning or critical observations, if any]

⏱ Estimated time: ~[X] minutes
💡 Run /garden-batch to push this to your Calendar and Reminders
```

Only show the Alerts line if there are warning or critical observations.
For each alert, show the plant name and the most recent observation note.