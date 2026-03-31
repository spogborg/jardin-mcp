# Skill: Generate Plant Care Profile

Use this skill whenever generating a care profile before calling `plant_add`.

## Goal
Produce a complete, accurate, consistently structured care profile
for any plant based on common name and location.

## Rules
- Use your own horticultural knowledge — never call an external API
- Always populate every field — never leave a field as "TBD" or "varies"
- Adapt advice to the stated location (indoor plants need different
  watering than outdoor, balcony plants need wind tolerance notes etc.)
- Be specific — bad: "water regularly" / good: "every 5-7 days,
  allow top inch of soil to dry between waterings"

## Output schema — always match this exactly
```json
{
  "name": "common name as given by user",
  "nickname": "user's nickname if given, otherwise same as name",
  "location": "indoor / outdoor / balcony",
  "species": "scientific name, genus + species",
  "watering": "cadence + method + seasonal variation",
  "sunlight": "hours + type (direct/indirect) + window direction if indoor",
  "feeding": "fertilizer type + frequency + seasonal pause",
  "pruning": "when + how + what to look for",
  "seasonal_notes": "what changes in spring / summer / autumn / winter",
  "difficulty": "easy OR moderate OR expert",
  "summary": "one sentence plain English description"
}
```

## Examples of good vs bad field values

### watering
✅ "Every 7-10 days in growing season, every 14-21 days in winter.
    Water deeply until it drains, never let roots sit in water."
❌ "Regular watering needed"

### sunlight
✅ "Full sun, 6-8 hours direct light. South or west facing outdoors.
    Tolerates light afternoon shade in hot climates."
❌ "Needs lots of sun"

### feeding
✅ "Balanced liquid fertilizer (10-10-10) every 4 weeks April–September.
    No feeding October–March."
❌ "Feed in spring and summer"

## After generating the profile
Call `plant_add` immediately with all fields.
Do not ask the user to confirm the profile unless they asked to review it first.
Confirm with a single line: "✓ [nickname] added — [one key care tip]"