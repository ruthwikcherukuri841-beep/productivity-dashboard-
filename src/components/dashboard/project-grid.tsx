"use client";

import React, { useState } from "react";
import { Plus, Filter, FolderKanban, Layers, LayoutGrid, ListFilter } from "lucide-react";
import { ProjectCard } from "@/components/dashboard/project-card";
import { ProjectCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/components/dashboard/create-project-modal";
import { CreateTaskModal } from "@/components/dashboard/create-task-modal";
import { useDashboard } from "@/context/dashboard-context";
import { FilterStatus, CategoryFilter, ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";

export function ProjectGrid() {
  const {
    projects,
    filteredProjects,
    projectFilter,
    setProjectFilter,
    categoryFilter,
    setCategoryFilter,
    isLoading,
  } = useDashboard();

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedProjectIdForTask, setSelectedProjectIdForTask] = useState<string | undefined>(
    undefined
  );
  const [groupByCategory, setGroupByCategory] = useState(false);

  const statusOptions: FilterStatus[] = ["All", "Active", "Planning", "Completed", "On Hold"];

  const categoryOptions: CategoryFilter[] = [
    "All",
    "Core Infrastructure",
    "Frontend & Design Systems",
    "Security & Identity",
    "DevOps & Observability",
    "AI & Machine Learning",
  ];

  const getStatusCount = (status: FilterStatus) => {
    if (status === "All") return projects.length;
    return projects.filter((p) => p.status === status).length;
  };

  const getCategoryCount = (cat: CategoryFilter) => {
    if (cat === "All") return projects.length;
    return projects.filter((p) => p.category === cat).length;
  };

  const handleOpenAddTask = (projectId: string) => {
    setSelectedProjectIdForTask(projectId);
    setIsCreateTaskOpen(true);
  };

  // Predefined category groups
  const allCategories: ProjectCategory[] = [
    "Core Infrastructure",
    "Frontend & Design Systems",
    "Security & Identity",
    "DevOps & Observability",
    "AI & Machine Learning",
  ];

  return (
    <section className="space-y-5">
      {/* Header with Title, Filter Badges & New Project Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white">Initiatives by Category</h2>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {filteredProjects.length}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Categorized engineering milestones and architecture initiatives
            </p>
          </div>
        </div>

        {/* Action Controls & Group Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => setGroupByCategory(!groupByCategory)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
              groupByCategory
                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                : "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Group by Category</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateProjectOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shrink-0"
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-zinc-400 font-medium shrink-0 flex items-center gap-1 mr-1">
          <ListFilter className="w-3.5 h-3.5" /> Category:
        </span>
        {categoryOptions.map((cat) => {
          const count = getCategoryCount(cat);
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-xl transition-all whitespace-nowrap border",
                isActive
                  ? "bg-zinc-800 text-white border-zinc-650 shadow-sm"
                  : "bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60 border-zinc-800"
              )}
            >
              <span>{cat}</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 rounded-full font-mono",
                  isActive ? "bg-zinc-700 text-zinc-200" : "bg-zinc-850 text-zinc-400"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Status Badges Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-zinc-400 font-medium shrink-0 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Status:
        </span>
        {statusOptions.map((status) => {
          const count = getStatusCount(status);
          const isActive = projectFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setProjectFilter(status)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-lg transition-all whitespace-nowrap",
                isActive
                  ? "bg-zinc-800 text-white font-medium shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60"
              )}
            >
              <span>{status}</span>
              <span className="text-[10px] font-mono text-zinc-400">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          type="projects"
          onAction={() => setIsCreateProjectOpen(true)}
          actionLabel="Create Project"
        />
      ) : groupByCategory ? (
        // Grouped By Category View
        <div className="space-y-8">
          {allCategories.map((category) => {
            const catProjects = filteredProjects.filter((p) => p.category === category);
            if (catProjects.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800/80">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  <h3 className="text-sm font-bold tracking-tight text-zinc-200 uppercase font-mono">
                    {category}
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-400 bg-zinc-850 px-2 py-0.5 rounded-full border border-zinc-800">
                    {catProjects.length} {catProjects.length === 1 ? "project" : "projects"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {catProjects.map((project, idx) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={idx}
                      onAddTask={handleOpenAddTask}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Standard Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              onAddTask={handleOpenAddTask}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => {
          setIsCreateTaskOpen(false);
          setSelectedProjectIdForTask(undefined);
        }}
        defaultProjectId={selectedProjectIdForTask}
      />
    </section>
  );
}
