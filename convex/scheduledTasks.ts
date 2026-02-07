import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let tasks = await ctx.db.query("scheduledTasks").collect();
    
    if (args.startDate && args.endDate) {
      tasks = tasks.filter(
        t => t.nextRun >= args.startDate! && t.nextRun <= args.endDate!
      );
    }
    
    return tasks.sort((a, b) => a.nextRun - b.nextRun);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    cronExpression: v.string(),
    taskType: v.string(),
    description: v.optional(v.string()),
    enabled: v.boolean(),
    nextRun: v.number(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("scheduledTasks", args);
  },
});

export const toggle = mutation({
  args: {
    id: v.id("scheduledTasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (task) {
      await ctx.db.patch(args.id, { enabled: !task.enabled });
    }
  },
});

export const getTaskTypes = query({
  handler: async (ctx) => {
    const tasks = await ctx.db.query("scheduledTasks").collect();
    const types = [...new Set(tasks.map(t => t.taskType))];
    return types.sort();
  },
});
