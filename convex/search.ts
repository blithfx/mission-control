import { query } from "./_generated/server";
import { v } from "convex/values";

export const globalSearch = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const searchTerm = args.query.toLowerCase();
    
    if (!searchTerm) {
      return { activities: [], memories: [], documents: [], tasks: [] };
    }

    // Search activities
    const allActivities = await ctx.db.query("activities").collect();
    const activities = allActivities
      .filter(a => 
        a.description.toLowerCase().includes(searchTerm) ||
        a.actionType.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10);

    // Search memories
    const allMemories = await ctx.db.query("memories").collect();
    const memories = allMemories
      .filter(m =>
        m.title.toLowerCase().includes(searchTerm) ||
        m.content.toLowerCase().includes(searchTerm) ||
        m.tags?.some(t => t.toLowerCase().includes(searchTerm))
      )
      .slice(0, 10);

    // Search documents
    const allDocuments = await ctx.db.query("documents").collect();
    const documents = allDocuments
      .filter(d =>
        d.title.toLowerCase().includes(searchTerm) ||
        d.content.toLowerCase().includes(searchTerm) ||
        d.path.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10);

    // Search scheduled tasks
    const allTasks = await ctx.db.query("scheduledTasks").collect();
    const tasks = allTasks
      .filter(t =>
        t.name.toLowerCase().includes(searchTerm) ||
        t.taskType.toLowerCase().includes(searchTerm) ||
        t.description?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10);

    return { activities, memories, documents, tasks };
  },
});
