"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GitPullRequest,
  Play,
  RotateCw,
  CheckCircle2,
  XCircle,
  Clock,
  GitBranch,
  Terminal,
  Server,
  Zap,
} from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { PipelineRun, PipelineStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PipelineMonitor() {
  const { pipelines, triggerPipeline, rerunPipeline } = useDashboard();
  const [selectedWorkflow, setSelectedWorkflow] = useState("Build & End-to-End Test (K8s)");
  const [selectedEnv, setSelectedEnv] = useState<"production" | "staging" | "preview">("staging");

  const workflowPresets = [
    "Build & End-to-End Test (K8s)",
    "Security Audit & SAST Scan",
    "Production Zero-Downtime Rollout",
    "Starlight CDN Token Publish",
  ];

  const getStatusBadge = (status: PipelineStatus) => {
    switch (status) {
      case "running":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
            Running
          </span>
        );
      case "success":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Passed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono">
            <XCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 text-xs font-mono">
            <Clock className="w-3.5 h-3.5" />
            Queued
          </span>
        );
    }
  };

  const getEnvBadge = (env: string) => {
    switch (env) {
      case "production":
        return "bg-purple-950/60 text-purple-300 border-purple-800/50";
      case "staging":
        return "bg-sky-950/60 text-sky-300 border-sky-800/50";
      default:
        return "bg-zinc-850 text-zinc-400 border-zinc-750";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Trigger Controller */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">CI/CD Pipeline Stream</h2>
              <p className="text-xs text-zinc-400">
                Automated continuous integration, artifact builds, and cluster deployments
              </p>
            </div>
          </div>
        </div>

        {/* Trigger Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={selectedWorkflow}
            onChange={(e) => setSelectedWorkflow(e.target.value)}
            className="px-3 py-1.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
          >
            {workflowPresets.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>

          <select
            value={selectedEnv}
            onChange={(e) => setSelectedEnv(e.target.value as "production" | "staging" | "preview")}
            className="px-3 py-1.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="staging">Staging</option>
            <option value="production">Production</option>
            <option value="preview">Preview</option>
          </select>

          <Button
            variant="glow"
            size="sm"
            onClick={() => triggerPipeline(selectedWorkflow, selectedEnv)}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            Trigger Run
          </Button>
        </div>
      </div>

      {/* Pipeline Runs List */}
      <div className="space-y-3">
        {pipelines.map((run, idx) => (
          <motion.div
            key={run.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
            className="p-4 sm:p-5 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/80 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            {/* Left: Workflow title & commit */}
            <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
              <div className="p-2.5 rounded-xl bg-zinc-850 border border-zinc-750 shrink-0">
                <GitPullRequest className="w-4 h-4 text-indigo-400" />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-white tracking-tight">{run.workflow}</h4>
                  <span
                    className={cn(
                      "text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border",
                      getEnvBadge(run.environment)
                    )}
                  >
                    {run.environment}
                  </span>
                  {getStatusBadge(run.status)}
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                  <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-300">
                    <GitBranch className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{run.branch}</span>
                  </div>
                  <span className="font-mono text-[11px] text-indigo-300 bg-indigo-950/40 px-1.5 py-0.2 rounded border border-indigo-800/40">
                    #{run.commitSha}
                  </span>
                  <span className="truncate text-zinc-400">{run.commitMsg}</span>
                </div>
              </div>
            </div>

            {/* Right: Triggered by & duration & rerun */}
            <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-800/60 text-xs">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={run.avatar}
                  alt={run.triggeredBy}
                  className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                />
                <div className="text-left">
                  <p className="text-zinc-200 font-medium text-[11px]">{run.triggeredBy}</p>
                  <p className="text-zinc-500 text-[10px]">{run.timestamp}</p>
                </div>
              </div>

              <div className="font-mono text-zinc-400 bg-zinc-850 px-2.5 py-1 rounded-lg border border-zinc-750 text-[11px]">
                ⏱ {run.duration}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => rerunPipeline(run.id)}
                disabled={run.status === "running"}
                leftIcon={<RotateCw className={cn("w-3.5 h-3.5", run.status === "running" && "animate-spin")} />}
              >
                Re-run
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
