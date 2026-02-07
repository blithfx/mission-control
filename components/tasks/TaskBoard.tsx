"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Loader2, 
  Circle,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

const columns = [
  { id: "backlog", label: "Backlog", icon: Circle, color: "text-zinc-400" },
  { id: "in-progress", label: "In Progress", icon: Clock, color: "text-blue-400" },
  { id: "blocked", label: "Blocked", icon: AlertCircle, color: "text-red-400" },
  { id: "done", label: "Done", icon: CheckCircle2, color: "text-green-400" },
];

const priorityColors = {
  low: "bg-zinc-500/20 text-zinc-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-red-500/20 text-red-400",
};

export function TaskBoard() {
  const tasks = useQuery(api.tasks.list, {});
  const createTask = useMutation(api.tasks.create);
  const updateStatus = useMutation(api.tasks.updateStatus);
  const removeTask = useMutation(api.tasks.remove);
  
  const [newTask, setNewTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  if (!tasks) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await createTask({ title: newTask.trim(), status: "backlog" });
    setNewTask("");
    setIsAdding(false);
  };

  const handleMove = async (taskId: Id<"tasks">, direction: "left" | "right", currentStatus: string) => {
    const currentIndex = columns.findIndex(c => c.id === currentStatus);
    const newIndex = direction === "right" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < columns.length) {
      await updateStatus({ id: taskId, status: columns[newIndex].id });
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(t => t.status === status).sort((a, b) => b.updatedAt - a.updatedAt);
  };

  return (
    <div className="space-y-4">
      {/* Add Task */}
      <div className="flex gap-2">
        {isAdding ? (
          <>
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Task title..."
              className="flex-1 bg-zinc-900 border-zinc-700"
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              autoFocus
            />
            <Button onClick={handleAddTask} size="sm">Add</Button>
            <Button onClick={() => setIsAdding(false)} variant="ghost" size="sm">Cancel</Button>
          </>
        ) : (
          <Button onClick={() => setIsAdding(true)} variant="outline" className="border-zinc-700">
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        )}
      </div>

      {/* Desktop: Kanban Grid */}
      <div className="hidden md:grid grid-cols-4 gap-4">
        {columns.map((column) => {
          const Icon = column.icon;
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id} className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                <Icon className={cn("h-4 w-4", column.color)} />
                <span className="font-medium text-white">{column.label}</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {columnTasks.length}
                </Badge>
              </div>

              {/* Tasks */}
              <div className="space-y-2 min-h-[200px]">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onMove={(dir) => handleMove(task._id, dir, task.status)}
                    onDelete={() => removeTask({ id: task._id })}
                    showMoveLeft={column.id !== "backlog"}
                    showMoveRight={column.id !== "done"}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: Stacked Columns */}
      <div className="md:hidden space-y-6">
        {columns.map((column) => {
          const Icon = column.icon;
          const columnTasks = getTasksByStatus(column.id);
          
          if (columnTasks.length === 0 && column.id === "done") return null; // Hide empty Done on mobile
          
          return (
            <div key={column.id} className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                <Icon className={cn("h-5 w-5", column.color)} />
                <span className="font-semibold text-white">{column.label}</span>
                <Badge variant="outline" className="ml-auto">
                  {columnTasks.length}
                </Badge>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {columnTasks.length === 0 ? (
                  <p className="text-zinc-500 text-sm py-2">No tasks</p>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onMove={(dir) => handleMove(task._id, dir, task.status)}
                      onDelete={() => removeTask({ id: task._id })}
                      showMoveLeft={column.id !== "backlog"}
                      showMoveRight={column.id !== "done"}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: any;
  onMove: (direction: "left" | "right") => void;
  onDelete: () => void;
  showMoveLeft: boolean;
  showMoveRight: boolean;
}

function TaskCard({ task, onMove, onDelete, showMoveLeft, showMoveRight }: TaskCardProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50 group">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-sm truncate">{task.title}</p>
            {task.description && (
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
          {task.priority && (
            <Badge className={cn("text-xs shrink-0", priorityColors[task.priority as keyof typeof priorityColors])}>
              {task.priority}
            </Badge>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {showMoveLeft && (
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onMove("left")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {showMoveRight && (
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onMove("right")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 ml-auto text-red-400 hover:text-red-300" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
