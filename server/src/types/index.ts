export type UserRole = "Engineer" | "Staff Architect" | "DevOps Lead" | "Security Specialist" | "Engineering Manager" | "Product Manager" | "Designer";
export type UserStatus = "Online" | "Focus" | "Reviewing" | "Offline";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = "Active" | "Planning" | "Completed" | "On Hold";
export type ProjectHealth = "On Track" | "At Risk" | "Delayed";
export type ProjectCategory =
  | "Core Infrastructure"
  | "Frontend & Design Systems"
  | "Security & Identity"
  | "DevOps & Observability"
  | "AI & Machine Learning";

export interface ProjectLead {
  id?: string;
  name: string;
  avatar: string;
  role?: string;
}

export interface Project {
  id: string;
  name: string;
  key: string; // e.g. "ENG-01"
  category: ProjectCategory;
  description: string;
  status: ProjectStatus;
  progress: number; // 0-100 dynamically calculated from task completion
  health: ProjectHealth;
  lead: ProjectLead;
  dueDate: string;
  taskCount: {
    total: number;
    completed: number;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type TaskStatus = "Todo" | "In Progress" | "In Review" | "Done";

export interface TaskAssignee {
  id?: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: TaskAssignee;
  estimateHours: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: any;
  error?: {
    code: string;
    message: string;
    details?: any[];
    statusCode: number;
    timestamp: string;
    path: string;
  };
}
