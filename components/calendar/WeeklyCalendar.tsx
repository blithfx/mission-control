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
        <h2 className="text-lg md:text-xl font-semibold text-white">
          {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
        </h2>
        <div className="flex gap-1 md:gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-zinc-700 h-8 w-8 md:h-10 md:w-10"
            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 h-8 md:h-10 text-xs md:text-sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-zinc-700 h-8 w-8 md:h-10 md:w-10"
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop: Grid View */}
      <div className="hidden md:grid grid-cols-7 gap-2">
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

      {/* Mobile: List View */}
      <div className="md:hidden space-y-4">
        {days.map((day) => {
          const dayTasks = getTasksForDay(day);
          return (
            <div key={day.toISOString()}>
              {/* Day Header */}
              <div className={cn(
                "flex items-center gap-3 py-3 px-4 rounded-lg mb-2",
                isToday(day) ? "bg-blue-500/20" : "bg-zinc-800/50"
              )}>
                <div className={cn(
                  "text-2xl font-bold",
                  isToday(day) ? "text-blue-400" : "text-white"
                )}>
                  {format(day, "d")}
                </div>
                <div>
                  <div className={cn(
                    "text-sm font-medium",
                    isToday(day) ? "text-blue-400" : "text-white"
                  )}>
                    {format(day, "EEEE")}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {format(day, "MMMM yyyy")}
                  </div>
                </div>
                {isToday(day) && (
                  <Badge className="ml-auto bg-blue-500/20 text-blue-400 border-blue-500">
                    Today
                  </Badge>
                )}
              </div>

              {/* Tasks for this day */}
              {dayTasks.length > 0 ? (
                <div className="space-y-2 pl-2">
                  {dayTasks.map((task) => (
                    <Card
                      key={task._id}
                      className={cn(
                        "border cursor-pointer",
                        colorClasses[task.color || "blue"],
                        !task.enabled && "opacity-50"
                      )}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4" />
                          {format(new Date(task.nextRun), "HH:mm")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{task.name}</p>
                          <p className="text-xs opacity-75 truncate">{task.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize shrink-0">
                          {task.taskType}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm pl-4 py-2">No tasks scheduled</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
