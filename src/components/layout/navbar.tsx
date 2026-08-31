"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Sparkles,
  Command,
  RotateCcw,
  Layers,
  Check,
  ChevronDown,
  Terminal,
  Circle,
  ShieldCheck,
  Zap,
  FolderKanban,
  CheckSquare,
  GitPullRequest,
  Server,
  Users,
} from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { DashboardTab } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const {
    searchQuery,
    isLoading,
    simulateLoading,
    resetToMockData,
    activeTab,
    setActiveTab,
    setIsCommandPaletteOpen,
  } = useDashboard();

  const [userStatus, setUserStatus] = useState<"Online" | "Focus" | "Reviewing" | "Offline">("Focus");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  const statusColors = {
    Online: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
    Focus: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]",
    Reviewing: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]",
    Offline: "bg-zinc-500",
  };

  // Group navigation tabs into categorized order
  const categorizedNav = [
    {
      category: "Work Management",
      tabs: [
        { id: "overview" as DashboardTab, label: "Overview", icon: <Layers className="w-3.5 h-3.5" /> },
        { id: "kanban" as DashboardTab, label: "Kanban Board", icon: <CheckSquare className="w-3.5 h-3.5" /> },
      ],
    },
    {
      category: "DevOps & Delivery",
      tabs: [
        { id: "pipelines" as DashboardTab, label: "CI/CD Pipelines", icon: <GitPullRequest className="w-3.5 h-3.5" /> },
        { id: "infrastructure" as DashboardTab, label: "Infrastructure", icon: <Server className="w-3.5 h-3.5" /> },
      ],
    },
    {
      category: "Resources",
      tabs: [
        { id: "team" as DashboardTab, label: "Team Capacity", icon: <Users className="w-3.5 h-3.5" /> },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
          onClick={() => setActiveTab("overview")}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">DevPulse</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-850 text-zinc-400 border border-zinc-800">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Developer Productivity Suite</p>
          </div>
        </div>

        {/* Global Search Bar (Trigger command palette) */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div
            onClick={() => setIsCommandPaletteOpen(true)}
            className="relative group cursor-pointer"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-hover:text-indigo-400 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <div className="w-full pl-9 pr-14 py-2 text-xs sm:text-sm bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-400 flex items-center transition-all">
              {searchQuery || "Search categories, projects, tasks, CI/CD..."}
            </div>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-750 rounded">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </div>
          </div>
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Skeleton Simulator Toggle */}
          <button
            type="button"
            onClick={() => simulateLoading(1500)}
            disabled={isLoading}
            title="Simulate loading state to preview skeletons"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 rounded-lg transition-colors"
          >
            <Sparkles className={cn("w-3.5 h-3.5 text-indigo-400", isLoading && "animate-spin")} />
            <span className="hidden md:inline">Simulate Load</span>
          </button>

          {/* Reset Seed Data */}
          <button
            type="button"
            onClick={resetToMockData}
            title="Reset data to initial state"
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 border border-transparent hover:border-zinc-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notification Popover */}
          <NotificationDropdown />

          {/* User Profile & Status Pill */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors focus:outline-none"
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Alex Rivera"
                  className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                />
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-zinc-950",
                    statusColors[userStatus]
                  )}
                />
              </div>
              <span className="hidden sm:inline text-xs font-medium text-zinc-200">Alex</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 shadow-2xl p-2 z-50 text-zinc-200"
                >
                  <div className="px-3 py-2 border-b border-zinc-800/80">
                    <p className="text-xs font-semibold text-white">Alex Rivera</p>
                    <p className="text-[11px] text-zinc-400 truncate">alex.rivera@hyperion.io</p>
                  </div>

                  <div className="py-2">
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Work Status
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {(["Focus", "Online", "Reviewing", "Offline"] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            setUserStatus(status);
                            setIsProfileOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors text-left",
                            userStatus === status
                              ? "bg-zinc-800 text-white"
                              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className={cn("w-2 h-2 rounded-full", statusColors[status])} />
                            <span>
                              {status === "Focus"
                                ? "Focus Mode"
                                : status === "Reviewing"
                                ? "In Code Review"
                                : status}
                            </span>
                          </div>
                          {userStatus === status && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 space-y-1">
                    <div className="px-3 py-1.5 text-[11px] text-zinc-400 flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      <span>CLI v2.14.0 active</span>
                    </div>
                    <div className="px-3 py-1.5 text-[11px] text-zinc-400 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>SOC2 Type II Enforced</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Categorized Navigation Tabs Bar */}
      <div className="border-t border-zinc-850/80 bg-zinc-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 overflow-x-auto py-2">
          {categorizedNav.map((group, groupIdx) => (
            <div key={group.category} className="flex items-center gap-1.5 shrink-0">
              {groupIdx > 0 && <div className="h-4 w-px bg-zinc-800 mx-1 shrink-0" />}
              <span className="text-[10px] uppercase font-mono font-semibold text-zinc-400 mr-1 hidden md:inline">
                {group.category}:
              </span>
              {group.tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                      isActive
                        ? "bg-zinc-800 text-white shadow-sm font-semibold border border-zinc-700/60"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60 border border-transparent"
                    )}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
