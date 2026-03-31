# Garden Week Preview

Show this week's garden plan without pushing to Calendar or Reminders.
Good for a quick check of what needs doing.

## Steps

1. Call `plant_list` to get the full garden roster
2. Group tasks by type across all plants
3. Estimate total time needed (roughly 2 min per plant)
4. Show the plan clearly — do NOT call calendar_add or reminder_add

## Output format
```
🌿 This week in your garden · [X] plants

💧 Water:   [plant list]
🌱 Feed:    [plant list]  
✂️  Check:   [plant list]

⏱ Estimated time: ~[X] minutes
💡 Run /garden-batch to push this to your Calendar and Reminders
```