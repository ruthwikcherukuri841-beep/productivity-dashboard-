export type ProjectStatus = "Active" | "Planning" | "Completed" | "On Hold";
export type ProjectHealth = "On Track" | "At Risk" | "Delayed";

export type ProjectCategory =
  | "Core Infrastructure"
  | "Frontend & Design Systems"
  | "Security & Identity"
  | "DevOps & Observability"
  | "AI & Machine Learning";

export interface ProjectLead {
  name: string;
  avatar: string;
  role?: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  category: ProjectCategory;
  description: string;
  status: ProjectStatus;
  progress: number; // 0-100
  health: ProjectHealth;
  lead: ProjectLead;
  dueDate: string;
  taskCount: {
    total: number;
    completed: number;
  };
  tags?: string[];
}

export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type TaskStatus = "Todo" | "In Progress" | "In Review" | "Done";

export interface TaskAssignee {
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: TaskAssignee;
  estimateHours: number;
  createdAt?: string;
}

export type NotificationType = "commit" | "pr" | "alert" | "mention";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  actionUrl?: string;
}

export interface MetricStat {
  id: string;
  label: string;
  category: "Velocity" | "Code Quality" | "Reliability" | "Deployments";
  value: string | number;
  change: number;
  trend: "up" | "down";
  period: string;
  description?: string;
  sparkline?: number[];
}

export type PipelineStatus = "running" | "success" | "failed" | "queued";

export interface PipelineRun {
  id: string;
  workflow: string;
  branch: string;
  commitSha: string;
  commitMsg: string;
  status: PipelineStatus;
  duration: string;
  triggeredBy: string;
  avatar: string;
  timestamp: string;
  environment: "production" | "staging" | "preview";
}

export type ServiceStatus = "healthy" | "degraded" | "incident";

export interface Microservice {
  id: string;
  name: string;
  category: "Core" | "Database" | "Compute" | "Gateway" | "Cache";
  region: string;
  status: ServiceStatus;
  latencyMs: number;
  uptime: number; // e.g. 99.98
  errorRate: number; // e.g. 0.02%
  load: number; // 0-100%
}

export interface TeamMember {
  name: string;
  avatar: string;
  role: string;
  status: "Online" | "Focus" | "Reviewing" | "Offline";
  assignedTasksCount: number;
  completedTasksCount: number;
  bandwidthUsage: number; // 0-100%
  currentTaskTitle?: string;
}

export interface BurndownPoint {
  day: string;
  ideal: number;
  actual: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

export interface ChatAction {
  label: string;
  actionType: "navigate_tab" | "trigger_pipeline" | "filter_status" | "simulate_load" | "create_task";
  payload?: any;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  actions?: ChatAction[];
  codeSnippet?: string;
  isStreaming?: boolean;
}

export type DashboardTab = "overview" | "kanban" | "pipelines" | "infrastructure" | "team" | "copilot";
export type FilterStatus = "All" | ProjectStatus;
export type TaskFilterStatus = "All" | TaskStatus;
export type PriorityFilter = "All" | TaskPriority;
export type CategoryFilter = "All" | ProjectCategory;
