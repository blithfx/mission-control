"use client";

import { GlobalSearch } from "@/components/search/GlobalSearch";

export default function SearchPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Search</h1>
        <p className="text-zinc-400 mt-1 text-sm md:text-base">Find memories, documents, activities & tasks</p>
      </div>

      {/* Search */}
      <GlobalSearch />
    </div>
  );
}
