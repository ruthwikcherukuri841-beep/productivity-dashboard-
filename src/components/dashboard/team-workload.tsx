"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle2, Clock, Zap, Shield, ArrowUpRight } from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

export function TeamWorkload() {
  const { teamMembers } = useDashboard();

  const statusColors = {
    Online: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
    Focus: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]",
    Reviewing: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]",
    Offline: "bg-zinc-500",
  };

  const statusLabels = {
    Online: "Online & Available",
    Focus: "Deep Focus Mode",
    Reviewing: "Reviewing PRs",
    Offline: "Offline",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              Engineering Team & Capacity Allocation
            </h2>
            <p className="text-xs text-zinc-400">
              Sprint bandwidth utilization, active focuses, and throughput by engineer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-zinc-300 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Avg Bandwidth: 78%</span>
          </div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teamMembers.map((member, idx) => (
          <motion.div
            key={member.name}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="p-5 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-750 transition-all space-y-4"
          >
            {/* Lead Avatar & Role */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-zinc-700 shadow-md"
                  />
                  <span
                    className={cn(
                      "absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-zinc-950",
                      statusColors[member.status]
                    )}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-tight">{member.name}</h4>
                  <p className="text-xs text-zinc-400">{member.role}</p>
                </div>
              </div>

              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {statusLabels[member.status]}
              </span>
            </div>

            {/* Current Active Task */}
            {member.currentTaskTitle && (
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wide text-zinc-400">
                  Active Focus
                </span>
                <p className="text-xs text-indigo-200 font-medium line-clamp-1">
                  {member.currentTaskTitle}
                </p>
              </div>
            )}

            {/* Bandwidth Usage */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-medium">Sprint Capacity</span>
                <span
                  className={cn(
                    "font-mono font-bold",
                    member.bandwidthUsage > 85 ? "text-amber-400" : "text-emerald-400"
                  )}
                >
                  {member.bandwidthUsage}%
                </span>
              </div>
              <ProgressBar
                progress={member.bandwidthUsage}
                size="sm"
                colorScheme={member.bandwidthUsage > 85 ? "amber" : "gradient"}
              />
            </div>

            {/* Completed vs Assigned counts */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{member.assignedTasksCount} active tasks</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{member.completedTasksCount} delivered</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
