"use client";

import React from "react";
import { FolderGit2, CheckSquare, Search, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/dashboard-context";

interface EmptyStateProps {
  type: "projects" | "tasks" | "search";
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({ type, onAction, actionLabel }: EmptyStateProps) {
  const { searchQuery, setSearchQuery, setProjectFilter, setTaskFilter, setPriorityFilter } =
    useDashboard();

  const resetAllFilters = () => {
    setSearchQuery("");
    setProjectFilter("All");
    setTaskFilter("All");
    setPriorityFilter("All");
  };

  const configs = {
    projects: {
      icon: <FolderGit2 className="w-10 h-10 text-zinc-500" />,
      title: "No projects found",
      description:
        searchQuery !== ""
          ? `No projects matching "${searchQuery}". Try adjusting your search query or filter.`
          : "There are no projects in this status category. Create a new project to get started.",
      defaultAction: onAction,
      defaultLabel: actionLabel || "Create New Project",
      defaultIcon: <Plus className="w-4 h-4" />,
    },
    tasks: {
      icon: <CheckSquare className="w-10 h-10 text-zinc-500" />,
      title: "No tasks found",
      description:
        searchQuery !== ""
          ? `No tasks matching "${searchQuery}". Check task filter or search query.`
          : "No tasks found matching your current filter criteria.",
      defaultAction: onAction,
      defaultLabel: actionLabel || "Create New Task",
      defaultIcon: <Plus className="w-4 h-4" />,
    },
    search: {
      icon: <Search className="w-10 h-10 text-zinc-500" />,
      title: "No results found",
      description: `We couldn't find anything matching "${searchQuery}".`,
      defaultAction: resetAllFilters,
      defaultLabel: "Reset Filters",
      defaultIcon: <RotateCcw className="w-4 h-4" />,
    },
  };

  const activeConfig = configs[type];

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800/60 my-6">
      <div className="w-16 h-16 rounded-2xl bg-zinc-850/80 border border-zinc-800 flex items-center justify-center mb-4 shadow-inner">
        {activeConfig.icon}
      </div>
      <h3 className="text-base font-semibold text-white tracking-tight">{activeConfig.title}</h3>
      <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-6 leading-relaxed">
        {activeConfig.description}
      </p>

      <div className="flex items-center gap-3">
        {activeConfig.defaultAction && (
          <Button
            variant={type === "search" ? "secondary" : "primary"}
            size="sm"
            onClick={activeConfig.defaultAction}
            leftIcon={activeConfig.defaultIcon}
          >
            {activeConfig.defaultLabel}
          </Button>
        )}

        {searchQuery && type !== "search" && (
          <Button variant="outline" size="sm" onClick={resetAllFilters} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Clear Search
          </Button>
        )}
      </div>
    </div>
  );
}
