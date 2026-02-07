"use client";

import { StatsCards } from "@/components/dashboard/StatsCards";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Activity, Calendar, Search } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Mission Control</h1>
        <p className="text-zinc-400 mt-1">Monitor your agent's activities in real-time</p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/activity">
          <Card className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <Activity className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <h3 className="font-semibold text-white">Activity Feed</h3>
                <p className="text-sm text-zinc-400">View all actions</p>
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-500" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/calendar">
          <Card className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="flex-1">
                <h3 className="font-semibold text-white">Calendar</h3>
                <p className="text-sm text-zinc-400">Scheduled tasks</p>
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-500" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/search">
          <Card className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <Search className="h-8 w-8 text-green-500" />
              <div className="flex-1">
                <h3 className="font-semibold text-white">Search</h3>
                <p className="text-sm text-zinc-400">Find anything</p>
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-500" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <Link href="/activity">
            <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-400">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ActivityFeed limit={5} compact />
        </CardContent>
      </Card>
    </div>
  );
}
