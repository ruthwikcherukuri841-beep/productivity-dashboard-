"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronDown,
  CheckCircle2,
  Trash2,
  MoreHorizontal,
  Circle,
  Clock3,
  CheckCircle,
} from "lucide-react";
import { Task, TaskStatus } from "@/types";
import { TaskPriorityBadge, TaskStatusBadge } from "@/components/ui/badge";
import { useDashboard } from "@/context/dashboard-context";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const { projects, updateTaskStatus, deleteTask } = useDashboard();
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const parentProject = projects.find((p) => p.id === task.projectId);

  const statusOptions: { label: TaskStatus; icon: React.ReactNode; color: string }[] = [
    { label: "Todo", icon: <Circle className="w-3.5 h-3.5 text-zinc-400" />, color: "text-zinc-300" },
    {
      label: "In Progress",
      icon: <Clock3 className="w-3.5 h-3.5 text-sky-400" />,
      color: "text-sky-300",
    },
    {
      label: "In Review",
      icon: <Clock className="w-3.5 h-3.5 text-purple-400" />,
      color: "text-purple-300",
    },
    {
      label: "Done",
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
      color: "text-emerald-300",
    },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={cn(
        "group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-zinc-700/80 transition-all duration-200 gap-3",
        task.status === "Done" && "opacity-75 bg-zinc-950/40"
      )}
    >
      {/* Left Title & Project Key */}
      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => {
            const nextStatus: TaskStatus =
              task.status === "Done"
                ? "Todo"
                : task.status === "Todo"
                ? "In Progress"
                : task.status === "In Progress"
                ? "In Review"
                : "Done";
            updateTaskStatus(task.id, nextStatus);
          }}
          title={`Cycle status (current: ${task.status})`}
          className={cn(
            "mt-0.5 sm:mt-0 p-1 rounded-lg border transition-colors shrink-0",
            task.status === "Done"
              ? "bg-emerald-950/60 border-emerald-600/40 text-emerald-400"
              : "bg-zinc-850 border-zinc-700/60 text-zinc-400 hover:text-zinc-200"
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {parentProject && (
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                {parentProject.key}
              </span>
            )}
            <p
              className={cn(
                "text-sm font-medium text-zinc-200 group-hover:text-white transition-colors leading-snug",
                task.status === "Done" && "line-through text-zinc-400"
              )}
            >
              {task.title}
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls: Priority, Status selector, Assignee, Estimate, Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60">
        <TaskPriorityBadge priority={task.priority} />

        {/* Inline Status Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-850/80 hover:bg-zinc-800 border border-zinc-750/70 text-xs font-medium text-zinc-300 transition-colors"
          >
            <span className="text-[11px]">{task.status}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          <AnimatePresence>
            {isStatusMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsStatusMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 4 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-1.5 w-36 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl p-1 z-30 space-y-0.5"
                >
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        updateTaskStatus(task.id, opt.label);
                        setIsStatusMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left",
                        task.status === opt.label
                          ? "bg-zinc-800 text-white font-medium"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                      )}
                    >
                      {opt.icon}
                      <span className={opt.color}>{opt.label}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Estimate */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-zinc-850/50 px-2 py-0.5 rounded border border-zinc-800">
          <Clock className="w-3 h-3 text-zinc-400" />
          <span>{task.estimateHours}h</span>
        </div>

        {/* Assignee Avatar */}
        <div className="flex items-center gap-1.5" title={task.assignee.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={task.assignee.avatar}
            alt={task.assignee.name}
            className="w-6 h-6 rounded-full object-cover border border-zinc-700"
          />
        </div>

        {/* Delete Action */}
        <button
          type="button"
          onClick={() => deleteTask(task.id)}
          title="Delete task"
          className="p-1 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
