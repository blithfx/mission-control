"use client";

import { MemoryList } from "@/components/memory/MemoryList";

export default function MemoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Memory</h1>
        <p className="text-zinc-400 mt-1 text-sm md:text-base">Long-term memories and daily notes</p>
      </div>

      {/* Memory List */}
      <MemoryList />
    </div>
  );
}
