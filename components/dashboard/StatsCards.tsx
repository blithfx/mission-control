"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Calendar, Brain, FileText, TrendingUp, Clock } from "lucide-react";

export function StatsCards() {
  const activities = useQuery(api.activities.list, { limit: 100 });
  const tasks = useQuery(api.scheduledTasks.list, {});

  const successCount = activities?.filter(a => a.status === "success").length || 0;
  const errorCount = activities?.filter(a => a.status === "error").length || 0;
  const pendingCount = activities?.filter(a => a.status === "pending").length || 0;
  const enabledTasks = tasks?.filter(t => t.enabled).length || 0;

  const stats = [
    {
      label: "Total Activities",
      value: activities?.length || 0,
      icon: Activity,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Success Rate",
      value: activities?.length ? `${Math.round((successCount / activities.length) * 100)}%` : "—",
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Pending Actions",
      value: pendingCount,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Active Tasks",
      value: enabledTasks,
      icon: Calendar,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-lg p-3 ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-zinc-500">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
