import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all cron jobs
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("cronJobs").order("asc").collect();
  },
});

// Get cron jobs by enabled status
export const listEnabled = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("cronJobs").collect();
    return all.filter(job => job.enabled);
  },
});

// Get upcoming cron jobs (next to run)
export const upcoming = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("cronJobs")
      .withIndex("by_nextRun")
      .order("asc")
      .take(10);
  },
});

// Sync cron jobs from Clawdbot
export const sync = mutation({
  args: {
    jobs: v.array(v.object({
      jobId: v.string(),
      name: v.string(),
      enabled: v.boolean(),
      cronExpression: v.string(),
      timezone: v.string(),
      message: v.string(),
      channel: v.optional(v.string()),
      sessionTarget: v.optional(v.string()),
      nextRunAtMs: v.optional(v.number()),
      lastRunAtMs: v.optional(v.number()),
      lastStatus: v.optional(v.string()),
      lastDurationMs: v.optional(v.number()),
      createdAtMs: v.number(),
      updatedAtMs: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Clear existing cron jobs
    const existing = await ctx.db.query("cronJobs").collect();
    for (const job of existing) {
      await ctx.db.delete(job._id);
    }

    // Add new cron jobs
    for (const job of args.jobs) {
      await ctx.db.insert("cronJobs", job);
    }

    return { synced: args.jobs.length };
  },
});
