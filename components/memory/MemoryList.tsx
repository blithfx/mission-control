"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, FileText, Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function MemoryList() {
  const memories = useQuery(api.memories.list, {});

  if (!memories) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-zinc-500">
        <Brain className="h-12 w-12 mb-2 opacity-50" />
        <p>No memories synced yet</p>
        <p className="text-sm mt-1">Sync memories from Settings</p>
      </div>
    );
  }

  // Group memories by type
  const longTermMemories = memories.filter(m => m.memoryType === "long-term");
  const dailyMemories = memories.filter(m => m.memoryType === "daily");

  return (
    <div className="space-y-6">
      {/* Long-term Memories */}
      {longTermMemories.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Long-term Memory
          </h2>
          <div className="space-y-3">
            {longTermMemories.map((memory) => (
              <Card key={memory._id} className="border-zinc-800 bg-zinc-900/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-white">{memory.title}</CardTitle>
                    {memory.tags && memory.tags.length > 0 && (
                      <div className="flex gap-1">
                        {memory.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-400 whitespace-pre-wrap line-clamp-4">
                    {memory.content}
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    {formatDistanceToNow(memory.createdAt, { addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Daily Memories */}
      {dailyMemories.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Daily Notes
          </h2>
          <div className="space-y-3">
            {dailyMemories.map((memory) => (
              <Card key={memory._id} className="border-zinc-800 bg-zinc-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-white">{memory.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-400 whitespace-pre-wrap line-clamp-6">
                    {memory.content}
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    {formatDistanceToNow(memory.createdAt, { addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
