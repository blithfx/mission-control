"use client";

import { useState } from "react";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { ActivityFeedGrouped } from "@/components/activity/ActivityFeedGrouped";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ActivityPage() {
  const [view, setView] = useState<"grouped" | "list">("grouped");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Activity Feed</h1>
          <p className="text-zinc-400 mt-1 text-sm md:text-base">Real-time log of all agent actions</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-3",
              view === "grouped" && "bg-zinc-700"
            )}
            onClick={() => setView("grouped")}
          >
            <LayoutGrid className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Grouped</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-3",
              view === "list" && "bg-zinc-700"
            )}
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">List</span>
          </Button>
        </div>
      </div>

      {/* Feed */}
      {view === "grouped" ? (
        <ActivityFeedGrouped />
      ) : (
        <ActivityFeed />
      )}
    </div>
  );
}
