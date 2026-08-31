"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Globe,
  Cpu,
  Database,
  Layers,
  Zap,
} from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { Microservice, ServiceStatus } from "@/types";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

export function ServiceHealth() {
  const { services, toggleServiceHealth } = useDashboard();
  const [regionFilter, setRegionFilter] = useState<string>("All");

  const regions = ["All", "us-east-1 (N. Virginia)", "global multi-region", "us-east-1 / eu-west-1"];

  const filteredServices = services.filter(
    (s) => regionFilter === "All" || s.region.includes(regionFilter)
  );

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "degraded":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "incident":
        return <XCircle className="w-4 h-4 text-rose-400" />;
    }
  };

  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case "healthy":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Healthy
          </span>
        );
      case "degraded":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/40 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            Degraded Latency
          </span>
        );
      case "incident":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/40 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
            Service Disruption
          </span>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Gateway":
        return <Globe className="w-4 h-4 text-sky-400" />;
      case "Database":
        return <Database className="w-4 h-4 text-purple-400" />;
      case "Compute":
        return <Cpu className="w-4 h-4 text-amber-400" />;
      default:
        return <Server className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Global System Status Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white">
                Infrastructure & Microservices Telemetry
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 99.98% Global Uptime
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Live p99 latency, compute utilization, error budgets, and health controls
            </p>
          </div>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-zinc-500" />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-1.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((svc, idx) => (
          <motion.div
            key={svc.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
            className="p-5 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-all space-y-4"
          >
            {/* Top row: Name & Category icon */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-zinc-850 border border-zinc-750 shrink-0">
                  {getCategoryIcon(svc.category)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-tight">{svc.name}</h4>
                  <p className="text-[11px] text-zinc-400 font-mono">{svc.region}</p>
                </div>
              </div>

              {getStatusBadge(svc.status)}
            </div>

            {/* Middle Metrics */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-center font-mono">
              <div>
                <p className="text-[10px] text-zinc-500 font-sans">p99 Latency</p>
                <p
                  className={cn(
                    "text-xs font-bold mt-0.5",
                    svc.latencyMs > 50 ? "text-amber-400" : "text-emerald-400"
                  )}
                >
                  {svc.latencyMs}ms
                </p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-sans">Uptime</p>
                <p className="text-xs font-bold text-zinc-200 mt-0.5">{svc.uptime}%</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-sans">Error Rate</p>
                <p
                  className={cn(
                    "text-xs font-bold mt-0.5",
                    svc.errorRate > 0.1 ? "text-rose-400" : "text-zinc-400"
                  )}
                >
                  {svc.errorRate}%
                </p>
              </div>
            </div>

            {/* Load Capacity Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400">Pod Cluster Load</span>
                <span className="font-mono text-zinc-200 font-semibold">{svc.load}%</span>
              </div>
              <ProgressBar
                progress={svc.load}
                size="sm"
                colorScheme={svc.load > 80 ? "amber" : "indigo"}
              />
            </div>

            {/* Health State Toggle (Simulate incidents) */}
            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">Simulate Health:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleServiceHealth(svc.id, "healthy")}
                  className={cn(
                    "px-2 py-0.5 rounded border text-[10px] transition-colors",
                    svc.status === "healthy"
                      ? "bg-emerald-950 text-emerald-400 border-emerald-700"
                      : "text-zinc-500 hover:text-zinc-300 border-zinc-800"
                  )}
                >
                  Healthy
                </button>
                <button
                  type="button"
                  onClick={() => toggleServiceHealth(svc.id, "degraded")}
                  className={cn(
                    "px-2 py-0.5 rounded border text-[10px] transition-colors",
                    svc.status === "degraded"
                      ? "bg-amber-950 text-amber-400 border-amber-700"
                      : "text-zinc-500 hover:text-zinc-300 border-zinc-800"
                  )}
                >
                  Degraded
                </button>
                <button
                  type="button"
                  onClick={() => toggleServiceHealth(svc.id, "incident")}
                  className={cn(
                    "px-2 py-0.5 rounded border text-[10px] transition-colors",
                    svc.status === "incident"
                      ? "bg-rose-950 text-rose-400 border-rose-700"
                      : "text-zinc-500 hover:text-zinc-300 border-zinc-800"
                  )}
                >
                  Incident
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
