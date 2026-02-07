"use client";

import { useState } from "react";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { ActivityFilter } from "@/components/activity/ActivityFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivityPage() {
  const [filter, setFilter] = useState<string | undefined>();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Activity Feed</h1>
        <p className="text-zinc-400 mt-1 text-sm md:text-base">Real-time log of all agent actions</p>
      </div>

      {/* Filters */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-sm text-zinc-400">Filter by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityFilter selected={filter} onSelect={setFilter} />
        </CardContent>
      </Card>

      {/* Feed */}
      <ActivityFeed filter={filter} />
    </div>
  );
}
