import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activities: defineTable({
    timestamp: v.number(),
    actionType: v.string(),
    description: v.string(),
    status: v.union(v.literal("success"), v.literal("pending"), v.literal("error")),
    metadata: v.optional(v.any()),
  }).index("by_timestamp", ["timestamp"])
    .index("by_actionType", ["actionType"]),

  scheduledTasks: defineTable({
    name: v.string(),
    cronExpression: v.string(),
    taskType: v.string(),
    description: v.optional(v.string()),
    enabled: v.boolean(),
    lastRun: v.optional(v.number()),
    nextRun: v.number(),
    color: v.optional(v.string()),
  }).index("by_nextRun", ["nextRun"])
    .index("by_taskType", ["taskType"]),

  memories: defineTable({
    title: v.string(),
    content: v.string(),
    memoryType: v.optional(v.string()), // "long-term" or "daily"
    createdAt: v.number(),
    tags: v.optional(v.array(v.string())),
  }).index("by_createdAt", ["createdAt"]),

  documents: defineTable({
    title: v.string(),
    content: v.string(),
    path: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_updatedAt", ["updatedAt"]),

  skills: defineTable({
    name: v.string(),
    description: v.string(),
    location: v.optional(v.string()),
    enabled: v.optional(v.boolean()),
  }),
});
