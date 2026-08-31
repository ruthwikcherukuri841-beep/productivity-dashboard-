"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  colorScheme?: "emerald" | "indigo" | "gradient" | "amber" | "rose";
}

export function ProgressBar({
  progress,
  className,
  barClassName,
  showLabel = false,
  size = "md",
  animate = true,
  colorScheme = "emerald",
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const heightStyles = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  const schemeGradients = {
    emerald: "from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]",
    indigo: "from-indigo-500 to-violet-500 shadow-[0_0_12px_rgba(99,102,241,0.3)]",
    gradient: "from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.3)]",
    amber: "from-amber-500 to-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]",
    rose: "from-rose-500 to-pink-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]",
  };

  // Dynamic scheme based on percentage if default
  const activeGradient =
    colorScheme === "emerald" && clampedProgress < 40
      ? schemeGradients.amber
      : colorScheme === "emerald" && clampedProgress >= 100
      ? "from-emerald-400 to-teal-300"
      : schemeGradients[colorScheme];

  return (
    <div className={cn("w-full flex items-center gap-3", className)}>
      <div
        className={cn(
          "w-full bg-zinc-850/80 rounded-full overflow-hidden border border-zinc-800/80 p-[1px] relative",
          heightStyles[size]
        )}
      >
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all", activeGradient, barClassName)}
          initial={animate ? { width: 0 } : { width: `${clampedProgress}%` }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono font-medium text-zinc-400 shrink-0 min-w-[32px] text-right">
          {clampedProgress}%
        </span>
      )}
    </div>
  );
}
