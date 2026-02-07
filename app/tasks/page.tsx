"use client";

import { TaskBoard } from "@/components/tasks/TaskBoard";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Tasks</h1>
        <p className="text-zinc-400 mt-1 text-sm md:text-base">Track what we're working on</p>
      </div>

      {/* Task Board */}
      <TaskBoard />
    </div>
  );
}
