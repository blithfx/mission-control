"use client";

import { CronJobsList } from "@/components/cron/CronJobsList";
import { Clock } from "lucide-react";

export default function CronPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Clock className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Cron Jobs</h1>
          <p className="text-zinc-400 mt-1 text-sm md:text-base">
            Scheduled tasks and automation
          </p>
        </div>
      </div>

      {/* Cron Jobs List */}
      <CronJobsList />
    </div>
  );
}
