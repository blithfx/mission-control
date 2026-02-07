"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Clock, 
  Globe, 
  MessageSquare, 
  Search, 
  FileText,
  Calendar,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
  Youtube,
  TrendingUp,
  Mic,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  email: Mail,
  cron: Clock,
  api: Globe,
  message: MessageSquare,
  search: Search,
  file: FileText,
  calendar: Calendar,
  default: Zap,
};

const projectConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  youtube: { label: "YouTube Shorts", icon: Youtube, color: "text-red-500" },
  polymarket: { label: "Polymarket", icon: TrendingUp, color: "text-green-500" },
  podcast: { label: "AI Agent Podcast", icon: Mic, color: "text-purple-500" },
  dashboard: { label: "Mission Control", icon: LayoutDashboard, color: "text-blue-500" },
  other: { label: "Other", icon: Zap, color: "text-zinc-400" },
};

const statusConfig = {
  success: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  error: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  pending: { icon: Loader2, color: "text-yellow-500", bg: "bg-yellow-500/10" },
};

export function ActivityFeedGrouped() {
  const grouped = useQuery(api.activities.listGroupedByProject, { limit: 100 });

  if (!grouped) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  const projectOrder = ["youtube", "polymarket", "podcast", "dashboard", "other"];
  const sortedProjects = projectOrder.filter(p => grouped[p] && grouped[p].length > 0);
  
  // Add any projects not in the predefined order
  Object.keys(grouped).forEach(p => {
    if (!sortedProjects.includes(p) && grouped[p].length > 0) {
      sortedProjects.push(p);
    }
  });

  if (sortedProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-zinc-500">
        <Zap className="h-12 w-12 mb-2 opacity-50" />
        <p>No activities yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedProjects.map((projectKey) => {
        const activities = grouped[projectKey];
        const config = projectConfig[projectKey] || projectConfig.other;
        const ProjectIcon = config.icon;

        return (
          <Card key={projectKey} className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ProjectIcon className={cn("h-5 w-5", config.color)} />
                <span className="text-white">{config.label}</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {activities.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {activities.slice(0, 5).map((activity: any) => {
                const Icon = iconMap[activity.actionType] || iconMap.default;
                const status = statusConfig[activity.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;

                return (
                  <div 
                    key={activity._id} 
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className={cn("rounded-lg p-1.5", status.bg)}>
                      <Icon className={cn("h-4 w-4", status.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-zinc-300 truncate">
                          {activity.description}
                        </p>
                        <StatusIcon className={cn("h-3 w-3 shrink-0", status.color, activity.status === "pending" && "animate-spin")} />
                      </div>
                      <p className="text-xs text-zinc-500">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {activities.length > 5 && (
                <p className="text-xs text-zinc-500 text-center pt-2">
                  +{activities.length - 5} more
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
