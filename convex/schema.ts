import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activities: defineTable({
    timestamp: v.number(),
    actionType: v.string(),
    description: v.string(),
    status: v.union(v.literal("success"), v.literal("pending"), v.literal("error")),
    project: v.optional(v.string()), // "youtube" | "polymarket" | "podcast" | "dashboard" | "other"
    metadata: v.optional(v.any()),
  }).index("by_timestamp", ["timestamp"])
    .index("by_actionType", ["actionType"])
    .index("by_project", ["project"]),

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

  cronJobs: defineTable({
    jobId: v.string(), // Clawdbot cron job ID
    name: v.string(),
    enabled: v.boolean(),
    cronExpression: v.string(),
    timezone: v.string(),
    message: v.string(), // The task message/instructions
    channel: v.optional(v.string()),
    sessionTarget: v.optional(v.string()),
    nextRunAtMs: v.optional(v.number()),
    lastRunAtMs: v.optional(v.number()),
    lastStatus: v.optional(v.string()),
    lastDurationMs: v.optional(v.number()),
    createdAtMs: v.number(),
    updatedAtMs: v.number(),
  }).index("by_nextRun", ["nextRunAtMs"])
    .index("by_name", ["name"]),

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

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "backlog" | "in-progress" | "blocked" | "done"
    priority: v.optional(v.string()), // "low" | "medium" | "high"
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_status", ["status"])
    .index("by_updatedAt", ["updatedAt"]),
});
