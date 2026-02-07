"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wrench, Loader2, ExternalLink } from "lucide-react";

export function SkillsList() {
  const skills = useQuery(api.skills.list, {});

  if (!skills) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-zinc-500">
        <Wrench className="h-12 w-12 mb-2 opacity-50" />
        <p>No skills synced yet</p>
        <p className="text-sm mt-1">Sync skills from Settings</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {skills.map((skill) => (
        <Card key={skill._id} className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Wrench className="h-4 w-4 text-green-500" />
                {skill.name}
              </CardTitle>
              {skill.enabled !== false && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500">
                  Active
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400 mb-3">
              {skill.description}
            </p>
            {skill.location && (
              <p className="text-xs text-zinc-500 font-mono truncate">
                {skill.location}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
