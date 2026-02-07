import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const memories = await ctx.db.query("memories").collect();
    return memories.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    memoryType: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("memories", {
      title: args.title,
      content: args.content,
      memoryType: args.memoryType,
      createdAt: Date.now(),
      tags: args.tags,
    });
  },
});
