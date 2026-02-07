"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Loader2
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

const statusConfig = {
  success: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  error: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  pending: { icon: Loader2, color: "text-yellow-500", bg: "bg-yellow-500/10" },
};

interface ActivityFeedProps {
  limit?: number;
  filter?: string;
  compact?: boolean;
}

export function ActivityFeed({ limit = 50, filter, compact = false }: ActivityFeedProps) {
  const activities = useQuery(api.activities.list, { limit, actionType: filter });

  if (!activities) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-zinc-500">
        <Zap className="h-12 w-12 mb-2 opacity-50" />
        <p>No activities yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className={compact ? "h-[400px]" : "h-[calc(100vh-12rem)]"}>
      <div className="space-y-3 p-1">
        {activities.map((activity) => {
          const Icon = iconMap[activity.actionType] || iconMap.default;
          const status = statusConfig[activity.status];
          const StatusIcon = status.icon;

          return (
            <Card 
              key={activity._id} 
              className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
            >
              <CardContent className="flex items-start gap-4 p-4">
                {/* Icon */}
                <div className={cn("rounded-lg p-2", status.bg)}>
                  <Icon className={cn("h-5 w-5", status.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {activity.actionType}
                    </Badge>
                    <StatusIcon className={cn("h-4 w-4", status.color, activity.status === "pending" && "animate-spin")} />
                  </div>
                  <p className="text-sm text-zinc-300 truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
