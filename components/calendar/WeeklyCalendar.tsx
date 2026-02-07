"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  addWeeks, 
  subWeeks, 
  eachDayOfInterval,
  isSameDay,
  isToday
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const colorClasses: Record<string, string> = {
  blue: "bg-blue-500/20 border-blue-500 text-blue-400",
  green: "bg-green-500/20 border-green-500 text-green-400",
  yellow: "bg-yellow-500/20 border-yellow-500 text-yellow-400",
  purple: "bg-purple-500/20 border-purple-500 text-purple-400",
  gray: "bg-zinc-500/20 border-zinc-500 text-zinc-400",
  red: "bg-red-500/20 border-red-500 text-red-400",
};

export function WeeklyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const tasks = useQuery(api.scheduledTasks.list, {
    startDate: weekStart.getTime(),
    endDate: weekEnd.getTime(),
  });

  const getTasksForDay = (date: Date) => {
    if (!tasks) return [];
    return tasks.filter((task) => isSameDay(new Date(task.nextRun), date));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-zinc-700"
            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-zinc-700"
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div key={day.toISOString()} className="min-h-[200px]">
            {/* Day Header */}
            <div className={cn(
              "text-center py-2 rounded-t-lg",
              isToday(day) ? "bg-blue-500/20" : "bg-zinc-800/50"
            )}>
              <div className="text-xs text-zinc-500 uppercase">
                {format(day, "EEE")}
              </div>
              <div className={cn(
                "text-lg font-semibold",
                isToday(day) ? "text-blue-400" : "text-white"
              )}>
                {format(day, "d")}
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-2 mt-2">
              {getTasksForDay(day).map((task) => (
                <Card
                  key={task._id}
                  className={cn(
                    "border cursor-pointer transition-all hover:scale-105",
                    colorClasses[task.color || "blue"],
                    !task.enabled && "opacity-50"
                  )}
                >
                  <CardContent className="p-2">
                    <div className="flex items-center gap-1 text-xs mb-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(task.nextRun), "HH:mm")}
                    </div>
                    <p className="text-xs font-medium truncate">{task.name}</p>
                    <Badge variant="outline" className="text-[10px] mt-1 capitalize">
                      {task.taskType}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
