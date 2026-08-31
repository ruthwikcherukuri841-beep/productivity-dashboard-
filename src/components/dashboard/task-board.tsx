"use client";

import React, { useState } from "react";
import { Plus, CheckSquare, Layers, Filter } from "lucide-react";
import { TaskCard } from "@/components/dashboard/task-card";
import { TaskCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { CreateTaskModal } from "@/components/dashboard/create-task-modal";
import { useDashboard } from "@/context/dashboard-context";
import { TaskFilterStatus, PriorityFilter } from "@/types";
import { cn } from "@/lib/utils";

export function TaskBoard() {
  const {
    tasks,
    filteredTasks,
    taskFilter,
    setTaskFilter,
    priorityFilter,
    setPriorityFilter,
    isLoading,
  } = useDashboard();

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const statusTabs: TaskFilterStatus[] = ["All", "Todo", "In Progress", "In Review", "Done"];
  const priorityTabs: PriorityFilter[] = ["All", "Urgent", "High", "Medium", "Low"];

  const getTaskStatusCount = (status: TaskFilterStatus) => {
    if (status === "All") return tasks.length;
    return tasks.filter((t) => t.status === status).length;
  };

  return (
    <section className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white">Sprint Backlog & Tasks</h2>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {filteredTasks.length}
              </span>
            </div>
            <p className="text-xs text-zinc-400">Real-time engineering tasks across active projects</p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-900/80 border border-zinc-800 overflow-x-auto">
            {statusTabs.map((status) => {
              const count = getTaskStatusCount(status);
              const isActive = taskFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setTaskFilter(status)}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap",
                    isActive
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60"
                  )}
                >
                  <span>{status}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1 rounded-full",
                      isActive
                        ? "bg-zinc-700 text-zinc-200"
                        : "bg-zinc-850 text-zinc-500"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Priority Filter Select */}
          <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 px-2 py-1 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
              aria-label="Filter tasks by priority"
              className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer pr-1"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Create Task Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsCreateTaskOpen(true)}
            leftIcon={<Plus className="w-4 h-4 text-indigo-400" />}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          type="tasks"
          onAction={() => setIsCreateTaskOpen(true)}
          actionLabel="Create Task"
        />
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task, idx) => (
            <TaskCard key={task.id} task={task} index={idx} />
          ))}
        </div>
      )}

      {/* Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />
    </section>
  );
}
