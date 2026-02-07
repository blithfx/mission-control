"use client";

import { SkillsList } from "@/components/skills/SkillsList";

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Skills</h1>
        <p className="text-zinc-400 mt-1 text-sm md:text-base">Installed agent skills and capabilities</p>
      </div>

      {/* Skills List */}
      <SkillsList />
    </div>
  );
}
