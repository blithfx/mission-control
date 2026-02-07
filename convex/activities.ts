import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    limit: v.optional(v.number()),
    actionType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("activities").order("desc");
    
    const activities = await q.take(args.limit ?? 50);
    
    if (args.actionType) {
      return activities.filter(a => a.actionType === args.actionType);
    }
    
    return activities;
  },
});

export const create = mutation({
  args: {
    actionType: v.string(),
    description: v.string(),
    status: v.union(v.literal("success"), v.literal("pending"), v.literal("error")),
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
