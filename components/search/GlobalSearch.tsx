"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Activity, 
  Brain, 
  FileText, 
  Clock,
  Loader2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() 
      ? <mark key={i} className="bg-yellow-500/30 text-yellow-300 rounded px-0.5">{part}</mark>
      : part
  );
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useMemo(() => query, [query]);
  
  const results = useQuery(
    api.search.globalSearch, 
    debouncedQuery.length >= 2 ? { query: debouncedQuery } : "skip"
  );

  const hasResults = results && (
    results.activities.length > 0 ||
    results.memories.length > 0 ||
    results.documents.length > 0 ||
    results.tasks.length > 0
  );

  const totalResults = results 
    ? results.activities.length + results.memories.length + results.documents.length + results.tasks.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
        <Input
          placeholder="Search memories, documents, activities, tasks..."
          className="pl-10 h-12 text-lg bg-zinc-900 border-zinc-700 focus:border-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Results */}
      {query.length >= 2 && (
        <div className="text-sm text-zinc-500">
          {results === undefined ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : (
            `Found ${totalResults} result${totalResults !== 1 ? "s" : ""}`
          )}
        </div>
      )}

      {hasResults && (
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-6">
            {/* Activities */}
            {results.activities.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-white">Activities</h3>
                  <Badge variant="secondary">{results.activities.length}</Badge>
                </div>
                <div className="space-y-2">
                  {results.activities.map((activity) => (
                    <Card key={activity._id} className="border-zinc-800 bg-zinc-900/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="capitalize">
                            {activity.actionType}
                          </Badge>
                          <span className="text-xs text-zinc-500">
                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-300">
                          {highlightMatch(activity.description, query)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Memories */}
            {results.memories.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold text-white">Memories</h3>
                  <Badge variant="secondary">{results.memories.length}</Badge>
                </div>
                <div className="space-y-2">
                  {results.memories.map((memory) => (
                    <Card key={memory._id} className="border-zinc-800 bg-zinc-900/50">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-white mb-1">
                          {highlightMatch(memory.title, query)}
                        </h4>
                        <p className="text-sm text-zinc-400 line-clamp-2">
                          {highlightMatch(memory.content, query)}
                        </p>
                        {memory.tags && (
                          <div className="flex gap-1 mt-2">
                            {memory.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {highlightMatch(tag, query)}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {results.documents.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-white">Documents</h3>
                  <Badge variant="secondary">{results.documents.length}</Badge>
                </div>
                <div className="space-y-2">
                  {results.documents.map((doc) => (
                    <Card key={doc._id} className="border-zinc-800 bg-zinc-900/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white">
                            {highlightMatch(doc.title, query)}
                          </h4>
                          <code className="text-xs text-zinc-500 bg-zinc-800 px-1 rounded">
                            {doc.path}
                          </code>
                        </div>
                        <p className="text-sm text-zinc-400 line-clamp-2">
                          {highlightMatch(doc.content, query)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks */}
            {results.tasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold text-white">Scheduled Tasks</h3>
                  <Badge variant="secondary">{results.tasks.length}</Badge>
                </div>
                <div className="space-y-2">
                  {results.tasks.map((task) => (
                    <Card key={task._id} className="border-zinc-800 bg-zinc-900/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white">
                            {highlightMatch(task.name, query)}
                          </h4>
                          <Badge variant="outline" className="capitalize">
                            {task.taskType}
                          </Badge>
                          {!task.enabled && (
                            <Badge variant="secondary" className="text-zinc-500">
                              Disabled
                            </Badge>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-sm text-zinc-400">
                            {highlightMatch(task.description, query)}
                          </p>
                        )}
                        <code className="text-xs text-zinc-500 mt-1 block">
                          {task.cronExpression}
                        </code>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      {/* Empty State */}
      {query.length < 2 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <Search className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-lg">Start typing to search</p>
          <p className="text-sm">Search across memories, documents, activities, and tasks</p>
        </div>
      )}

      {query.length >= 2 && results && !hasResults && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <Search className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-lg">No results found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
