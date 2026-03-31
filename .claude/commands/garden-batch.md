# Garden Weekly Batch

Run this command to batch all garden tasks for the week and push to Calendar and Reminders.

## Steps

1. Call `plant_list` to get the full garden roster
2. Group all plants by care task type:
   - Watering: all plants that need water this week
   - Feeding: all plants due for fertilizer
   - Pruning or checking: any seasonal needs
3. Build a single session plan that batches everything into 1-2 garden visits
4. Suggest the best day (default Saturday 9am unless user specifies otherwise)
5. Call `calendar_add` with:
   - Title: "🌿 Garden Session — [X] plants"
   - The batched task list as notes
   - Duration: 30 minutes unless roster is large
6. Call `reminder_add` with the same task list as a checklist
7. Confirm what was added and show the full session plan

## Output format

Show the session plan like this:
```
🌿 Garden Session — Saturday [date] · 9:00am · ~30 min

💧 Water:   lavender, tomato, basil
🌱 Feed:    tomato, roses
✂️  Check:   pothos (repot soon)

✓ Added to Calendar
✓ Added to Reminders
```