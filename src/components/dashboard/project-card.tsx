"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  MoreVertical,
  Plus,
  Trash2,
  Tag,
  ArrowUpRight,
} from "lucide-react";
import { Project } from "@/types";
import { ProjectHealthBadge, ProjectStatusBadge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatDate, cn } from "@/lib/utils";
import { useDashboard } from "@/context/dashboard-context";

interface ProjectCardProps {
  project: Project;
  onAddTask?: (projectId: string) => void;
  index: number;
}

export function ProjectCard({ project, onAddTask, index }: ProjectCardProps) {
  const { updateProject, deleteProject } = useDashboard();
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleComplete = () => {
    const newStatus = project.status === "Completed" ? "Active" : "Completed";
    const newProgress = newStatus === "Completed" ? 100 : project.progress;
    updateProject(project.id, { status: newStatus, progress: newProgress });
    setShowMenu(false);
  };

  const handleDelete = () => {
    deleteProject(project.id);
    setShowMenu(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-black/40"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-indigo-300 border border-zinc-700/60">
              {project.key}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-800/40">
              {project.category}
            </span>
            <ProjectStatusBadge status={project.status} />
            <ProjectHealthBadge health={project.health} />
          </div>

          {/* Action Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Project actions"
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-1 w-44 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-1 z-30 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onAddTask?.(project.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-left"
                    >
                      <Plus className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Add Task</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleComplete}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-left"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        {project.status === "Completed" ? "Mark Active" : "Mark Completed"}
                      </span>
                    </button>
                    <div className="my-1 border-t border-zinc-800" />
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Project</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-3.5">
          <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
            {project.name}
          </h3>
          <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-850 text-zinc-400 border border-zinc-800"
              >
                <Tag className="w-2.5 h-2.5 text-zinc-500" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Progress & Lead Section */}
      <div className="mt-5 pt-4 border-t border-zinc-800/60 space-y-3">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-zinc-400 font-medium">Sprint Progress</span>
            <span className="font-mono text-zinc-200 font-semibold">{project.progress}%</span>
          </div>
          <ProgressBar progress={project.progress} size="sm" />
        </div>

        {/* Footer info: Lead avatar & Task counts & Due date */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.lead.avatar}
              alt={project.lead.name}
              title={`Lead: ${project.lead.name} (${project.lead.role || "Lead"})`}
              className="w-6 h-6 rounded-full object-cover border border-zinc-700"
            />
            <span className="text-zinc-300 font-medium truncate max-w-[100px] sm:max-w-[120px]">
              {project.lead.name}
            </span>
          </div>

          <div className="flex items-center gap-3 text-zinc-400">
            <span className="font-mono text-[11px]">
              {project.taskCount.completed}/{project.taskCount.total} tasks
            </span>
            <div className="flex items-center gap-1 text-zinc-400 font-mono text-[11px]">
              <Calendar className="w-3 h-3 text-zinc-400" />
              <span>{formatDate(project.dueDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
