import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    limit: v.optional(v.number()),
    actionType: v.optional(v.string()),
    project: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("activities").order("desc");
    
    const activities = await q.take(args.limit ?? 50);
    
    let filtered = activities;
    if (args.actionType) {
      filtered = filtered.filter(a => a.actionType === args.actionType);
    }
    if (args.project) {
      filtered = filtered.filter(a => a.project === args.project);
    }
    
    return filtered;
  },
});

export const listGroupedByProject = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const activities = await ctx.db.query("activities").order("desc").take(args.limit ?? 100);
    
    const grouped: Record<string, typeof activities> = {};
    for (const activity of activities) {
      const project = activity.project || "other";
      if (!grouped[project]) {
        grouped[project] = [];
      }
      grouped[project].push(activity);
    }
    
    return grouped;
  },
});

export const create = mutation({
  args: {
    actionType: v.string(),
    description: v.string(),
    status: v.union(v.literal("success"), v.literal("pending"), v.literal("error")),
    project: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const getActionTypes = query({
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();
    const types = [...new Set(activities.map(a => a.actionType))];
    return types.sort();
  },
});

export const getProjects = query({
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();
    const projects = [...new Set(activities.map(a => a.project || "other"))];
    return projects.sort();
  },
});
