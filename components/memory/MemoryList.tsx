"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, Loader2, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function MemoryList() {
  const memories = useQuery(api.memories.list, {});
  const [expandedMemory, setExpandedMemory] = useState<any | null>(null);

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

  // If a memory is expanded, show full content
  if (expandedMemory) {
    return (
      <div className="space-y-4">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-bold text-white">{expandedMemory.title}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedMemory(null)}
            className="text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4 mr-1" />
            Close
          </Button>
        </div>

        {/* Tags */}
        {expandedMemory.tags && expandedMemory.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {expandedMemory.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Full content */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4">
            <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {expandedMemory.content}
            </p>
          </CardContent>
        </Card>

        {/* Timestamp */}
        <p className="text-xs text-zinc-500">
          Created {formatDistanceToNow(expandedMemory.createdAt, { addSuffix: true })}
        </p>
      </div>
    );
  }

  // Group memories by type
  const longTermMemories = memories.filter(m => m.memoryType === "long-term");
  const dailyMemories = memories.filter(m => m.memoryType === "daily");
  const otherMemories = memories.filter(m => !m.memoryType || (m.memoryType !== "long-term" && m.memoryType !== "daily"));

  const MemoryCard = ({ memory }: { memory: any }) => {
    const isLong = memory.content.length > 200;
    
    return (
      <Card 
        className={cn(
          "border-zinc-800 bg-zinc-900/50 transition-colors",
          "cursor-pointer hover:bg-zinc-900"
        )}
        onClick={() => setExpandedMemory(memory)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-white">{memory.title}</CardTitle>
            <div className="flex items-center gap-2">
              {memory.tags && memory.tags.length > 0 && (
                <div className="hidden sm:flex gap-1">
                  {memory.tags.slice(0, 2).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-400 whitespace-pre-wrap line-clamp-3">
            {memory.content}
          </p>
          {isLong && (
            <p className="text-xs text-blue-400 mt-2 font-medium">
              Tap to read more →
            </p>
          )}
          <p className="text-xs text-zinc-500 mt-2">
            {formatDistanceToNow(memory.createdAt, { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Long-term Memories */}
      {longTermMemories.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Long-term Memory
            <Badge variant="outline" className="ml-2 text-xs">{longTermMemories.length}</Badge>
          </h2>
          <div className="space-y-3">
            {longTermMemories.map((memory) => (
              <MemoryCard key={memory._id} memory={memory} />
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
            <Badge variant="outline" className="ml-2 text-xs">{dailyMemories.length}</Badge>
          </h2>
          <div className="space-y-3">
            {dailyMemories.map((memory) => (
              <MemoryCard key={memory._id} memory={memory} />
            ))}
          </div>
        </div>
      )}

      {/* Other Memories */}
      {otherMemories.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-zinc-500" />
            Other
            <Badge variant="outline" className="ml-2 text-xs">{otherMemories.length}</Badge>
          </h2>
          <div className="space-y-3">
            {otherMemories.map((memory) => (
              <MemoryCard key={memory._id} memory={memory} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
