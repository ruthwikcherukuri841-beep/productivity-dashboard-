"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { ProjectGrid } from "@/components/dashboard/project-grid";
import { TaskBoard } from "@/components/dashboard/task-board";
import { KanbanBoard } from "@/components/dashboard/kanban-board";
import { PipelineMonitor } from "@/components/dashboard/pipeline-monitor";
import { ServiceHealth } from "@/components/dashboard/service-health";
import { TeamWorkload } from "@/components/dashboard/team-workload";
import { BurndownChart } from "@/components/dashboard/burndown-chart";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { ToastContainer } from "@/components/ui/toast-container";
import { CreateProjectModal } from "@/components/dashboard/create-project-modal";
import { CreateTaskModal } from "@/components/dashboard/create-task-modal";
import { useDashboard } from "@/context/dashboard-context";
import { Sparkles, Terminal, Activity, ArrowRight, ShieldCheck, Github, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskStatus } from "@/types";

export default function DashboardPage() {
  const { activeTab, projects, tasks } = useDashboard();

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus | undefined>(undefined);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const activeProjectsCount = projects.filter((p) => p.status === "Active").length;

  const handleOpenCreateTask = (status?: TaskStatus) => {
    setDefaultTaskStatus(status);
    setIsCreateTaskOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative overflow-x-hidden">
      {/* Background Ambient Glows & Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-10"
            >
              {/* Welcome / Sprint Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-indigo-950/30 border border-zinc-800/80 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-transparent" />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Sprint #39 • In Progress
                    </span>
                    <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                      Cycle ends Sep 15
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Good morning, Alex
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    You have <span className="text-white font-medium">{activeProjectsCount} active initiatives</span> and{" "}
                    <span className="text-indigo-300 font-medium">
                      {totalTasks - completedTasks} remaining backlog tasks
                    </span>{" "}
                    in this sprint.
                  </p>
                </div>

                {/* Quick Metrics Pill */}
                <div className="flex items-center gap-4 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 shrink-0">
                  <div className="text-center sm:text-left">
                    <div className="text-xs text-zinc-400">Sprint Delivery</div>
                    <div className="text-lg font-bold font-mono text-emerald-400">
                      {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                    </div>
                  </div>
                  <div className="h-8 w-px bg-zinc-800" />
                  <div className="text-center sm:text-left">
                    <div className="text-xs text-zinc-400">Resolved</div>
                    <div className="text-lg font-bold font-mono text-zinc-100">
                      {completedTasks}/{totalTasks}
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. Live Stat Cards */}
              <section aria-label="Key Performance Indicators">
                <StatsOverview />
              </section>

              {/* 2. Interactive Burndown Chart */}
              <section aria-label="Sprint Velocity Analytics">
                <BurndownChart />
              </section>

              {/* 3. Projects Grid */}
              <ProjectGrid />

              {/* 4. Task Board / Backlog */}
              <TaskBoard />
            </motion.div>
          )}

          {activeTab === "kanban" && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <KanbanBoard onOpenCreateTask={handleOpenCreateTask} />
            </motion.div>
          )}

          {activeTab === "pipelines" && (
            <motion.div
              key="pipelines"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <PipelineMonitor />
            </motion.div>
          )}

          {activeTab === "infrastructure" && (
            <motion.div
              key="infrastructure"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ServiceHealth />
            </motion.div>
          )}

          {activeTab === "team" && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TeamWorkload />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Command Palette */}
      <CommandPalette
        onOpenCreateProject={() => setIsCreateProjectOpen(true)}
        onOpenCreateTask={() => setIsCreateTaskOpen(true)}
      />

      {/* Floating Toast Notification Stack */}
      <ToastContainer />

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => {
          setIsCreateTaskOpen(false);
          setDefaultTaskStatus(undefined);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/60 py-6 text-xs text-zinc-500 relative z-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>DevPulse Engine v2.14 • All distributed services healthy</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Linear & Vercel Inspired UI</span>
            <span>•</span>
            <span>Zero Runtime Latency</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
