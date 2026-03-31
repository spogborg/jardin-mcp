import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const calendarTools: Tool[] = [
  {
    name: "calendar_add",
    description: "Add a garden session to Apple Calendar on your Mac",
    inputSchema: {
      type: "object",
      properties: {
        title:    { type: "string", description: "Event title e.g. 'Garden Session — Water + Feed'" },
        date:     { type: "string", description: "Date in YYYY-MM-DD format" },
        time:     { type: "string", description: "Time in HH:MM format e.g. 09:00" },
        duration: { type: "number", description: "Duration in minutes e.g. 30" },
        notes:    { type: "string", description: "Task list for the session" }
      },
      required: ["title", "date", "time", "duration", "notes"]
    }
  },
  {
    name: "reminder_add",
    description: "Add garden tasks as a checklist to Apple Reminders on your Mac",
    inputSchema: {
      type: "object",
      properties: {
        title:    { type: "string", description: "Reminder title" },
        due_date: { type: "string", description: "Due date in YYYY-MM-DD format" },
        notes:    { type: "string", description: "Task details" }
      },
      required: ["title", "due_date", "notes"]
    }
  }
];

export async function handleCalendarTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<{ content: Array<{ type: string; text: string }> }> {

  if (toolName === "calendar_add") {
    const { title, date, time, duration, notes } = args as {
      title: string; date: string; time: string;
      duration: number; notes: string;
    };

    // AppleScript — talks directly to Calendar.app, no API needed
    const script = `
      tell application "Calendar"
        tell calendar "Home"
          set startDate to date "${date} ${time}:00"
          set endDate to startDate + (${duration} * minutes)
          make new event with properties {
            summary: "${title}",
            start date: startDate,
            end date: endDate,
            description: "${notes.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
          }
        end tell
      end tell
      return "added"
    `;

    try {
      await execAsync(`osascript -e '${script}'`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "added",
            message: `✓ "${title}" added to Apple Calendar on ${date} at ${time}`
          })
        }]
      };
    } catch (err) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "error",
            message: `Calendar write failed. Make sure Calendar.app has automation permissions in System Settings → Privacy → Automation.`,
            error: String(err)
          })
        }]
      };
    }
  }

  if (toolName === "reminder_add") {
    const { title, due_date, notes } = args as {
      title: string; due_date: string; notes: string;
    };

    const script = `
      tell application "Reminders"
        tell list "Reminders"
          make new reminder with properties {
            name: "${title}",
            due date: date "${due_date}",
            body: "${notes.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
          }
        end tell
      end tell
      return "added"
    `;

    try {
      await execAsync(`osascript -e '${script}'`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "added",
            message: `✓ "${title}" added to Apple Reminders for ${due_date}`
          })
        }]
      };
    } catch (err) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "error",
            message: `Reminders write failed. Make sure Reminders.app has automation permissions in System Settings → Privacy → Automation.`,
            error: String(err)
          })
        }]
      };
    }
  }

  throw new Error(`Unhandled calendar tool: ${toolName}`);
}