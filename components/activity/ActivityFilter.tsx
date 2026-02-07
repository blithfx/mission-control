"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActivityFilterProps {
  selected: string | undefined;
  onSelect: (type: string | undefined) => void;
}

export function ActivityFilter({ selected, onSelect }: ActivityFilterProps) {
  const actionTypes = useQuery(api.activities.getActionTypes);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "border-zinc-700",
          !selected && "bg-blue-500/10 border-blue-500 text-blue-500"
        )}
        onClick={() => onSelect(undefined)}
      >
        All
      </Button>
      {actionTypes?.map((type) => (
        <Button
          key={type}
          variant="outline"
          size="sm"
          className={cn(
            "border-zinc-700 capitalize",
            selected === type && "bg-blue-500/10 border-blue-500 text-blue-500"
          )}
          onClick={() => onSelect(type)}
        >
          {type}
        </Button>
      ))}
    </div>
  );
}
