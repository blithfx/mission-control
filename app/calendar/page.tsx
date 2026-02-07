"use client";

import { WeeklyCalendar } from "@/components/calendar/WeeklyCalendar";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Calendar</h1>
        <p className="text-zinc-400 mt-1">Weekly view of scheduled tasks and cron jobs</p>
      </div>

      {/* Calendar */}
      <WeeklyCalendar />
    </div>
  );
}
