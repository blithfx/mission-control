"use client";

import { GlobalSearch } from "@/components/search/GlobalSearch";

export default function SearchPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Global Search</h1>
        <p className="text-zinc-400 mt-1">Search across all memories, documents, activities, and tasks</p>
      </div>

      {/* Search */}
      <GlobalSearch />
    </div>
  );
}
