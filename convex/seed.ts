import { mutation } from "./_generated/server";

export const seedData = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const day = 24 * hour;

    // Seed activities
    const activities = [
      { actionType: "email", description: "Sent daily digest to subscribers", status: "success" as const, timestamp: now - 2 * hour },
      { actionType: "cron", description: "Ran backup job successfully", status: "success" as const, timestamp: now - 4 * hour },
      { actionType: "api", description: "Fetched weather data for location", status: "success" as const, timestamp: now - 6 * hour },
      { actionType: "message", description: "Replied to Telegram message", status: "success" as const, timestamp: now - 8 * hour },
      { actionType: "search", description: "Web search for AI news", status: "success" as const, timestamp: now - 10 * hour },
      { actionType: "file", description: "Updated memory file", status: "success" as const, timestamp: now - 12 * hour },
      { actionType: "calendar", description: "Created calendar event", status: "success" as const, timestamp: now - 1 * day },
      { actionType: "email", description: "Failed to send notification", status: "error" as const, timestamp: now - 1.5 * day },
      { actionType: "cron", description: "Running weekly report", status: "pending" as const, timestamp: now - 5 * 60 * 1000 },
    ];

    for (const activity of activities) {
      await ctx.db.insert("activities", activity);
    }

    // Seed scheduled tasks
    const tasks = [
      { name: "Daily Backup", cronExpression: "0 2 * * *", taskType: "backup", description: "Backup all databases", enabled: true, nextRun: now + 8 * hour, color: "blue" },
      { name: "Email Digest", cronExpression: "0 9 * * *", taskType: "email", description: "Send morning digest", enabled: true, nextRun: now + 12 * hour, color: "green" },
      { name: "Weather Check", cronExpression: "0 */4 * * *", taskType: "api", description: "Check weather conditions", enabled: true, nextRun: now + 2 * hour, color: "yellow" },
      { name: "Weekly Report", cronExpression: "0 10 * * 1", taskType: "report", description: "Generate weekly summary", enabled: true, nextRun: now + 3 * day, color: "purple" },
      { name: "Cache Cleanup", cronExpression: "0 3 * * 0", taskType: "maintenance", description: "Clear old cache", enabled: false, nextRun: now + 5 * day, color: "gray" },
    ];

    for (const task of tasks) {
      await ctx.db.insert("scheduledTasks", task);
    }

    // Seed memories
    const memories = [
      { title: "User preferences", content: "User prefers dark mode and concise responses", createdAt: now - 7 * day, tags: ["preferences", "user"] },
      { title: "Project ideas", content: "Build a dashboard for monitoring agent activities", createdAt: now - 3 * day, tags: ["projects", "ideas"] },
      { title: "Important contacts", content: "Key contacts for emergencies and business", createdAt: now - 14 * day, tags: ["contacts", "important"] },
    ];

    for (const memory of memories) {
      await ctx.db.insert("memories", memory);
    }

    // Seed documents
    const documents = [
      { title: "AGENTS.md", content: "Agent configuration and behavior guidelines", path: "/AGENTS.md", createdAt: now - 30 * day, updatedAt: now - 1 * day },
      { title: "MEMORY.md", content: "Long-term memory storage for the agent", path: "/MEMORY.md", createdAt: now - 30 * day, updatedAt: now - 2 * hour },
      { title: "TOOLS.md", content: "Tool configuration and local notes", path: "/TOOLS.md", createdAt: now - 30 * day, updatedAt: now - 5 * day },
    ];

    for (const doc of documents) {
      await ctx.db.insert("documents", doc);
    }

    return { success: true, message: "Seeded sample data" };
  },
});
