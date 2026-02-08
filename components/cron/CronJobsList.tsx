"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Pause, CheckCircle, XCircle, Timer, Calendar } from "lucide-react";

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatRelative(ms: number): string {
  const now = Date.now();
  const diff = ms - now;
  const absDiff = Math.abs(diff);
  
  if (absDiff < 60000) return diff > 0 ? "in < 1 min" : "< 1 min ago";
  if (absDiff < 3600000) {
    const mins = Math.floor(absDiff / 60000);
    return diff > 0 ? `in ${mins} min` : `${mins} min ago`;
  }
  if (absDiff < 86400000) {
    const hours = Math.floor(absDiff / 3600000);
    return diff > 0 ? `in ${hours}h` : `${hours}h ago`;
  }
  const days = Math.floor(absDiff / 86400000);
  return diff > 0 ? `in ${days}d` : `${days}d ago`;
}

function describeCron(expr: string, tz: string): string {
  const parts = expr.split(" ");
  if (parts.length !== 5) return expr;
  
  const [min, hour, day, month, weekday] = parts;
  
  // Daily at specific time
  if (day === "*" && month === "*" && weekday === "*") {
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `Daily at ${h12}:${min.padStart(2, "0")} ${ampm} ${tz}`;
  }
  
  // Weekly on specific day
  if (day === "*" && month === "*" && weekday !== "*") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${days[parseInt(weekday)]} at ${h12}:${min.padStart(2, "0")} ${ampm} ${tz}`;
  }
  
  // One-time (specific date)
  if (day !== "*" && month !== "*") {
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${months[parseInt(month)]} ${day} at ${h12}:${min.padStart(2, "0")} ${ampm}`;
  }
  
  return expr;
}

export function CronJobsList() {
  const jobs = useQuery(api.cron.list);

  if (!jobs) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="h-12 w-12 text-zinc-600 mb-4" />
          <p className="text-zinc-400">No cron jobs found</p>
          <p className="text-sm text-zinc-500 mt-1">Sync from Clawdbot to see jobs here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job._id} className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {job.enabled ? (
                  <Play className="h-5 w-5 text-green-500" />
                ) : (
                  <Pause className="h-5 w-5 text-zinc-500" />
                )}
                <div>
                  <CardTitle className="text-white text-lg">{job.name}</CardTitle>
                  <p className="text-sm text-zinc-400 mt-1">
                    {describeCron(job.cronExpression, job.timezone)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={job.enabled ? "default" : "secondary"}
                  className={job.enabled ? "bg-green-500/20 text-green-400" : "bg-zinc-700 text-zinc-400"}
                >
                  {job.enabled ? "Active" : "Disabled"}
                </Badge>
                {job.lastStatus && (
                  <Badge 
                    variant="outline"
                    className={job.lastStatus === "ok" ? "border-green-500 text-green-400" : "border-red-500 text-red-400"}
                  >
                    {job.lastStatus === "ok" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {job.lastStatus}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {job.nextRunAtMs && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-zinc-400">Next run:</span>
                  <span className="text-white">
                    {formatDate(job.nextRunAtMs)} ({formatRelative(job.nextRunAtMs)})
                  </span>
                </div>
              )}
              {job.lastRunAtMs && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="text-zinc-400">Last run:</span>
                  <span className="text-white">
                    {formatDate(job.lastRunAtMs)} ({formatRelative(job.lastRunAtMs)})
                  </span>
                </div>
              )}
              {job.lastDurationMs && (
                <div className="flex items-center gap-2 text-sm">
                  <Timer className="h-4 w-4 text-yellow-500" />
                  <span className="text-zinc-400">Duration:</span>
                  <span className="text-white">{formatDuration(job.lastDurationMs)}</span>
                </div>
              )}
              {job.channel && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-400">Channel:</span>
                  <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                    {job.channel}
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Task Message */}
            <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
              <p className="text-xs text-zinc-500 mb-2">Task Instructions:</p>
              <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
                {job.message.slice(0, 500)}{job.message.length > 500 ? "..." : ""}
              </pre>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
