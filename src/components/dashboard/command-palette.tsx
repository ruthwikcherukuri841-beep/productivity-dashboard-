"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Layers,
  FolderKanban,
  CheckSquare,
  GitPullRequest,
  Server,
  Users,
  Sparkles,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Command,
} from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { DashboardTab } from "@/types";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  onOpenCreateProject: () => void;
  onOpenCreateTask: () => void;
}

export function CommandPalette({
  onOpenCreateProject,
  onOpenCreateTask,
}: CommandPaletteProps) {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    projects,
    tasks,
    setActiveTab,
    simulateLoading,
    resetToMockData,
    triggerPipeline,
  } = useDashboard();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Actions list categorized in order
  const systemActions = [
    {
      id: "act-new-project",
      category: "1. Work Management",
      title: "Create New Project",
      subtitle: "Initialize a new engineering initiative",
      icon: <FolderKanban className="w-4 h-4 text-indigo-400" />,
      run: () => {
        setIsCommandPaletteOpen(false);
        onOpenCreateProject();
      },
    },
    {
      id: "act-new-task",
      category: "1. Work Management",
      title: "Create New Task",
      subtitle: "Add a task to current sprint backlog",
      icon: <CheckSquare className="w-4 h-4 text-purple-400" />,
      run: () => {
        setIsCommandPaletteOpen(false);
        onOpenCreateTask();
      },
    },
    {
      id: "tab-overview",
      category: "1. Work Management",
      title: "Go to Dashboard Overview",
      subtitle: "Sprint velocity, active projects, and burndown chart",
      icon: <Layers className="w-4 h-4 text-sky-400" />,
      run: () => {
        setActiveTab("overview");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "tab-kanban",
      category: "1. Work Management",
      title: "Go to Kanban Board View",
      subtitle: "Column board with drag/move states",
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
      run: () => {
        setActiveTab("kanban");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "tab-pipelines",
      category: "2. DevOps & Delivery",
      title: "Go to CI/CD Pipelines Stream",
      subtitle: "Realtime workflows, builds and deploy runs",
      icon: <GitPullRequest className="w-4 h-4 text-amber-400" />,
      run: () => {
        setActiveTab("pipelines");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "act-trigger-ci",
      category: "2. DevOps & Delivery",
      title: "Trigger Production Rollout Pipeline",
      subtitle: "Automated container build and K8s rollout",
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      run: () => {
        triggerPipeline("Production Zero-Downtime Rollout", "production");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "tab-infra",
      category: "3. Infrastructure & Telemetry",
      title: "Go to Infrastructure & Microservices",
      subtitle: "Services telemetry and latency matrix",
      icon: <Server className="w-4 h-4 text-rose-400" />,
      run: () => {
        setActiveTab("infrastructure");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "tab-team",
      category: "4. Engineering Resources",
      title: "Go to Team & Workload Capacity",
      subtitle: "Bandwidth allocation and active focus",
      icon: <Users className="w-4 h-4 text-purple-400" />,
      run: () => {
        setActiveTab("team");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "act-simulate-load",
      category: "5. System Utilities",
      title: "Simulate Loading Skeleton State",
      subtitle: "Preview shimmering skeleton UI loaders",
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      run: () => {
        simulateLoading(1500);
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "act-reset-data",
      category: "5. System Utilities",
      title: "Reset to Default Seed Data",
      subtitle: "Restore mock projects, tasks, and telemetry",
      icon: <RotateCcw className="w-4 h-4 text-zinc-400" />,
      run: () => {
        resetToMockData();
        setIsCommandPaletteOpen(false);
      },
    },
  ];

  // Project entries by Category
  const projectActions = projects.map((p) => ({
    id: `proj-${p.id}`,
    category: `Projects (${p.category})`,
    title: `[${p.key}] ${p.name}`,
    subtitle: `${p.progress}% completed • Lead: ${p.lead.name}`,
    icon: <FolderKanban className="w-4 h-4 text-indigo-400" />,
    run: () => {
      setActiveTab("overview");
      setIsCommandPaletteOpen(false);
    },
  }));

  // Task entries
  const taskActions = tasks.map((t) => ({
    id: `task-${t.id}`,
    category: "Sprint Backlog Tasks",
    title: t.title,
    subtitle: `Status: ${t.status} • Priority: ${t.priority} • ${t.assignee.name}`,
    icon: <CheckSquare className="w-4 h-4 text-emerald-400" />,
    run: () => {
      setActiveTab("kanban");
      setIsCommandPaletteOpen(false);
    },
  }));

  const allItems = [...systemActions, ...projectActions, ...taskActions];

  const filteredItems = allItems.filter(
    (item) =>
      query === "" ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].run();
    }
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCommandPaletteOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", damping: 28, stiffness: 380 }}
            className="relative w-full max-w-2xl bg-zinc-900/95 backdrop-blur-2xl border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 text-zinc-100 divide-y divide-zinc-800/80"
          >
            {/* Top Search Bar */}
            <div className="flex items-center px-4 py-3.5 gap-3">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a category, project, task, command..."
                className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-zinc-400 bg-zinc-800 border border-zinc-750 rounded">
                ESC to close
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  No commands or items matching &quot;{query}&quot;
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={item.run}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs cursor-pointer transition-colors",
                        isSelected
                          ? "bg-indigo-600/20 text-white border border-indigo-500/30"
                          : "text-zinc-300 hover:bg-zinc-850/60 border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/60 shrink-0",
                            isSelected && "bg-indigo-600/40 text-white"
                          )}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-100 truncate">{item.title}</p>
                          {item.subtitle && (
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-750">
                          {item.category}
                        </span>
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-zinc-950/60 text-[11px] text-zinc-500 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>Navigate <kbd className="font-mono bg-zinc-800 px-1 rounded">↑↓</kbd></span>
                <span>Select <kbd className="font-mono bg-zinc-800 px-1 rounded">↵</kbd></span>
              </div>
              <span className="text-indigo-400 font-mono">Categorized Command Center</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
