import { mutation, action } from "./_generated/server";
import { v } from "convex/values";

// Clear all sample data
export const clearAll = mutation({
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();
    for (const a of activities) {
      await ctx.db.delete(a._id);
    }

    const tasks = await ctx.db.query("scheduledTasks").collect();
    for (const t of tasks) {
      await ctx.db.delete(t._id);
    }

    const memories = await ctx.db.query("memories").collect();
    for (const m of memories) {
      await ctx.db.delete(m._id);
    }

    const documents = await ctx.db.query("documents").collect();
    for (const d of documents) {
      await ctx.db.delete(d._id);
    }

    return { cleared: true };
  },
});

// Sync cron jobs from Clawdbot
export const syncCronJobs = mutation({
  args: {
    jobs: v.array(v.object({
      id: v.string(),
      name: v.string(),
      cronExpression: v.string(),
      description: v.string(),
      enabled: v.boolean(),
      nextRun: v.number(),
      lastRun: v.optional(v.number()),
      lastStatus: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // Clear existing tasks
    const existing = await ctx.db.query("scheduledTasks").collect();
    for (const t of existing) {
      await ctx.db.delete(t._id);
    }

    // Add new tasks
    const colors = ["blue", "green", "purple", "yellow", "red"];
    for (let i = 0; i < args.jobs.length; i++) {
      const job = args.jobs[i];
      await ctx.db.insert("scheduledTasks", {
        name: job.name,
        cronExpression: job.cronExpression,
        taskType: "cron",
        description: job.description,
        enabled: job.enabled,
        nextRun: job.nextRun,
        color: colors[i % colors.length],
      });
    }

    return { synced: args.jobs.length };
  },
});

// Sync memories from Clawdbot
export const syncMemories = mutation({
  args: {
    memories: v.array(v.object({
      title: v.string(),
      content: v.string(),
      memoryType: v.string(),
      createdAt: v.number(),
      tags: v.optional(v.array(v.string())),
    })),
  },
  handler: async (ctx, args) => {
    // Clear existing memories
    const existing = await ctx.db.query("memories").collect();
    for (const m of existing) {
      await ctx.db.delete(m._id);
    }

    // Add new memories
    for (const memory of args.memories) {
      await ctx.db.insert("memories", memory);
    }

    return { synced: args.memories.length };
  },
});

// Sync skills from Clawdbot
export const syncSkills = mutation({
  args: {
    skills: v.array(v.object({
      name: v.string(),
      description: v.string(),
      location: v.optional(v.string()),
      enabled: v.optional(v.boolean()),
    })),
  },
  handler: async (ctx, args) => {
    // Clear existing skills
    const existing = await ctx.db.query("skills").collect();
    for (const s of existing) {
      await ctx.db.delete(s._id);
    }

    // Add new skills
    for (const skill of args.skills) {
      await ctx.db.insert("skills", skill);
    }

    return { synced: args.skills.length };
  },
});

// Log a real activity
export const logActivity = mutation({
  args: {
    actionType: v.string(),
    description: v.string(),
    status: v.union(v.literal("success"), v.literal("error"), v.literal("pending")),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", {
      timestamp: Date.now(),
      actionType: args.actionType,
      description: args.description,
      status: args.status,
      metadata: args.metadata,
    });
  },
});
