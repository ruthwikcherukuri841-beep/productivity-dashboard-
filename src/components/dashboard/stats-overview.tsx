"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  GitPullRequest,
  CheckCircle2,
  Server,
  Activity,
} from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { StatCardSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MetricStat } from "@/types";

export function StatsOverview() {
  const { metrics, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const getMetricIcon = (id: string) => {
    switch (id) {
      case "metric-1":
        return <Zap className="w-4 h-4 text-amber-400" />;
      case "metric-2":
        return <GitPullRequest className="w-4 h-4 text-purple-400" />;
      case "metric-3":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "metric-4":
        return <Server className="w-4 h-4 text-sky-400" />;
      default:
        return <Activity className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getMetricGlow = (id: string) => {
    switch (id) {
      case "metric-1":
        return "hover:border-amber-500/40 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.12)]";
      case "metric-2":
        return "hover:border-purple-500/40 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.12)]";
      case "metric-3":
        return "hover:border-emerald-500/40 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]";
      case "metric-4":
        return "hover:border-sky-500/40 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.12)]";
      default:
        return "hover:border-indigo-500/40 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.12)]";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <StatCard
          key={metric.id}
          metric={metric}
          index={index}
          icon={getMetricIcon(metric.id)}
          glowClass={getMetricGlow(metric.id)}
        />
      ))}
    </div>
  );
}

function StatCard({
  metric,
  index,
  icon,
  glowClass,
}: {
  metric: MetricStat;
  index: number;
  icon: React.ReactNode;
  glowClass: string;
}) {
  const isPositive = metric.change >= 0;

  // Render SVG Sparkline
  const renderSparkline = (points?: number[]) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 100;
    const height = 28;

    const coordinates = points.map((val, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    });

    const pathString = `M ${coordinates.join(" L ")}`;

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-24 h-7 stroke-current overflow-visible"
      >
        <defs>
          <linearGradient id={`grad-${metric.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity="0.4" />
            <stop offset="100%" stopColor={isPositive ? "#34d399" : "#fb7185"} stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d={pathString}
          fill="none"
          stroke={`url(#grad-${metric.id})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className={cn(
        "group relative p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 transition-all duration-300",
        glowClass
      )}
    >
      {/* Top row: Label, Category Badge & Icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium tracking-wide uppercase text-zinc-400">
            {metric.label}
          </span>
          {metric.category && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-750">
              {metric.category}
            </span>
          )}
        </div>
        <div className="p-2 rounded-xl bg-zinc-800/70 border border-zinc-750/60 group-hover:scale-105 transition-transform">
          {icon}
        </div>
      </div>

      {/* Mid row: Value & Trend */}
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
          {metric.value}
        </span>
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border",
            isPositive
              ? "text-emerald-400 bg-emerald-950/40 border-emerald-800/40"
              : "text-rose-400 bg-rose-950/40 border-rose-800/40"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>
            {isPositive ? "+" : ""}
            {metric.change}%
          </span>
        </div>
      </div>

      {/* Bottom row: Sparkline & Period Context */}
      <div className="mt-4 flex items-center justify-between pt-2 border-t border-zinc-800/60">
        <span className="text-[11px] text-zinc-500">{metric.period}</span>
        <div>{renderSparkline(metric.sparkline)}</div>
      </div>
    </motion.div>
  );
}
