import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("skills").collect();
  },
});

export const sync = mutation({
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
