"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Circle,
  Clock3,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { Task, TaskStatus } from "@/types";
import { TaskPriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/dashboard-context";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
  onOpenCreateTask: (defaultStatus?: TaskStatus) => void;
}

export function KanbanBoard({ onOpenCreateTask }: KanbanBoardProps) {
  const { filteredTasks, projects, updateTaskStatus, deleteTask, isLoading } = useDashboard();

  const columns: {
    status: TaskStatus;
    title: string;
    icon: React.ReactNode;
    color: string;
    borderTop: string;
  }[] = [
    {
      status: "Todo",
      title: "Todo Backlog",
      icon: <Circle className="w-4 h-4 text-zinc-400" />,
      color: "text-zinc-300",
      borderTop: "from-zinc-500 to-zinc-700",
    },
    {
      status: "In Progress",
      title: "In Progress",
      icon: <Clock3 className="w-4 h-4 text-sky-400" />,
      color: "text-sky-400",
      borderTop: "from-sky-500 to-blue-600",
    },
    {
      status: "In Review",
      title: "In Review",
      icon: <Clock className="w-4 h-4 text-purple-400" />,
      color: "text-purple-400",
      borderTop: "from-purple-500 to-indigo-600",
    },
    {
      status: "Done",
      title: "Completed",
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
      color: "text-emerald-400",
      borderTop: "from-emerald-500 to-teal-600",
    },
  ];

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === "Todo") return "In Progress";
    if (current === "In Progress") return "In Review";
    if (current === "In Review") return "Done";
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === "Done") return "In Review";
    if (current === "In Review") return "In Progress";
    if (current === "In Progress") return "Todo";
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">Interactive Kanban Board</h2>
          <p className="text-xs text-zinc-400">
            Drag-friendly workflow stages with fast column transitions
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onOpenCreateTask("Todo")}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Task
        </Button>
      </div>

      {/* 4 Column Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className="flex flex-col rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-3 relative overflow-hidden min-h-[500px]"
            >
              {/* Top Accent Line */}
              <div
                className={cn("absolute top-0 inset-x-0 h-1 bg-gradient-to-r", col.borderTop)}
              />

              {/* Column Header */}
              <div className="flex items-center justify-between p-2 mb-2 border-b border-zinc-800/60">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <span className="font-semibold text-xs text-white">{col.title}</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards in Column */}
              <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                {colTasks.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-zinc-800/60 rounded-xl my-4">
                    <p className="text-xs text-zinc-400">No tasks in {col.status}</p>
                    <button
                      type="button"
                      onClick={() => onOpenCreateTask(col.status)}
                      className="mt-2 text-indigo-400 hover:text-indigo-300 text-[11px] font-medium inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add one
                    </button>
                  </div>
                ) : (
                  colTasks.map((task, idx) => {
                    const parentProject = projects.find((p) => p.id === task.projectId);
                    const next = getNextStatus(task.status);
                    const prev = getPrevStatus(task.status);

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="group relative p-3.5 rounded-xl bg-zinc-850/80 hover:bg-zinc-800 border border-zinc-750/70 hover:border-zinc-600/80 shadow-md transition-all space-y-2.5"
                      >
                        {/* Tags / Key */}
                        <div className="flex items-center justify-between gap-1">
                          {parentProject && (
                            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-900 text-indigo-300 border border-zinc-800">
                              {parentProject.key}
                            </span>
                          )}
                          <TaskPriorityBadge priority={task.priority} />
                        </div>

                        {/* Title */}
                        <p className="text-xs font-semibold text-zinc-100 group-hover:text-white line-clamp-2 leading-snug">
                          {task.title}
                        </p>

                        {/* Assignee & Estimate */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-750/60 text-xs">
                          <div className="flex items-center gap-1.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={task.assignee.avatar}
                              alt={task.assignee.name}
                              title={task.assignee.name}
                              className="w-5 h-5 rounded-full object-cover border border-zinc-700"
                            />
                            <span className="text-[11px] text-zinc-400 truncate max-w-[80px]">
                              {task.assignee.name.split(" ")[0]}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-400 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <span>{task.estimateHours}h</span>
                          </div>
                        </div>

                        {/* Shift buttons on hover */}
                        <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40">
                          {prev ? (
                            <button
                              type="button"
                              onClick={() => updateTaskStatus(task.id, prev)}
                              title={`Move back to ${prev}`}
                              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors flex items-center gap-0.5 text-[10px]"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span className="hidden group-hover:inline">{prev}</span>
                            </button>
                          ) : (
                            <span />
                          )}

                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            title="Delete task"
                            className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-400 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          {next && (
                            <button
                              type="button"
                              onClick={() => updateTaskStatus(task.id, next)}
                              title={`Move to ${next}`}
                              className="p-1 rounded text-zinc-400 hover:text-indigo-300 hover:bg-zinc-700 transition-colors flex items-center gap-0.5 text-[10px]"
                            >
                              <span className="hidden group-hover:inline">{next}</span>
                              <ArrowRight className="w-3 h-3 text-indigo-400" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
