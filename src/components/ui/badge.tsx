import React from "react";
import { cn } from "@/lib/utils";
import { ProjectHealth, ProjectStatus, TaskPriority, TaskStatus } from "@/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "outline"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "purple"
    | "zinc";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  children,
  className,
  variant = "default",
  size = "md",
  dot = false,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-zinc-800/80 text-zinc-300 border-zinc-700/60",
    zinc: "bg-zinc-900 text-zinc-400 border-zinc-800",
    outline: "bg-transparent text-zinc-400 border-zinc-800",
    success: "bg-emerald-950/50 text-emerald-300 border-emerald-800/40",
    warning: "bg-amber-950/50 text-amber-300 border-amber-800/40",
    danger: "bg-rose-950/50 text-rose-300 border-rose-800/40",
    info: "bg-sky-950/50 text-sky-300 border-sky-800/40",
    purple: "bg-purple-950/50 text-purple-300 border-purple-800/40",
  };

  const dotStyles = {
    default: "bg-zinc-400",
    zinc: "bg-zinc-500",
    outline: "bg-zinc-400",
    success: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
    warning: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
    danger: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]",
    info: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]",
    purple: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-medium tracking-tight gap-1.5",
    md: "px-2.5 py-1 text-xs font-medium gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border transition-colors select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotStyles[variant])} />}
      {children}
    </span>
  );
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  switch (status) {
    case "Active":
      return (
        <Badge variant="success" dot size="sm">
          Active
        </Badge>
      );
    case "Planning":
      return (
        <Badge variant="info" dot size="sm">
          Planning
        </Badge>
      );
    case "Completed":
      return (
        <Badge variant="purple" dot size="sm">
          Completed
        </Badge>
      );
    case "On Hold":
      return (
        <Badge variant="warning" dot size="sm">
          On Hold
        </Badge>
      );
    default:
      return <Badge size="sm">{status}</Badge>;
  }
}

export function ProjectHealthBadge({ health }: { health: ProjectHealth }) {
  switch (health) {
    case "On Track":
      return (
        <Badge variant="success" size="sm" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          ● On Track
        </Badge>
      );
    case "At Risk":
      return (
        <Badge variant="warning" size="sm" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
          ▲ At Risk
        </Badge>
      );
    case "Delayed":
      return (
        <Badge variant="danger" size="sm" className="bg-rose-500/10 text-rose-400 border-rose-500/20">
          ✕ Delayed
        </Badge>
      );
    default:
      return <Badge size="sm">{health}</Badge>;
  }
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  switch (priority) {
    case "Urgent":
      return (
        <Badge variant="danger" size="sm" className="font-semibold">
          Urgent
        </Badge>
      );
    case "High":
      return (
        <Badge variant="warning" size="sm">
          High
        </Badge>
      );
    case "Medium":
      return (
        <Badge variant="info" size="sm">
          Medium
        </Badge>
      );
    case "Low":
      return (
        <Badge variant="zinc" size="sm">
          Low
        </Badge>
      );
    default:
      return <Badge size="sm">{priority}</Badge>;
  }
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  switch (status) {
    case "Done":
      return (
        <Badge variant="success" dot size="sm">
          Done
        </Badge>
      );
    case "In Review":
      return (
        <Badge variant="purple" dot size="sm">
          In Review
        </Badge>
      );
    case "In Progress":
      return (
        <Badge variant="info" dot size="sm">
          In Progress
        </Badge>
      );
    case "Todo":
      return (
        <Badge variant="zinc" dot size="sm">
          Todo
        </Badge>
      );
    default:
      return <Badge size="sm">{status}</Badge>;
  }
}
