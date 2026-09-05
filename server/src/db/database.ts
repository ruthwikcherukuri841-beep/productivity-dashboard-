import { User, Project, Task, PaginatedResult } from "../types";
import { SEED_USERS, SEED_PROJECTS, SEED_TASKS } from "./seed";
import { v4 as uuidv4 } from "uuid";

class DatabaseStore {
  private users: Map<string, User> = new Map();
  private projects: Map<string, Project> = new Map();
  private tasks: Map<string, Task> = new Map();

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.users.clear();
    this.projects.clear();
    this.tasks.clear();

    for (const u of SEED_USERS) {
      this.users.set(u.id, { ...u });
    }
    for (const p of SEED_PROJECTS) {
      this.projects.set(p.id, { ...p });
    }
    for (const t of SEED_TASKS) {
      this.tasks.set(t.id, { ...t });
    }

    this.recalculateAllProjectStats();
  }

  // --- USERS ---
  public getUsers(filter?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): PaginatedResult<User> {
    let items = Array.from(this.users.values());

    if (filter?.role) {
      items = items.filter((u) => u.role.toLowerCase() === filter.role!.toLowerCase());
    }
    if (filter?.status) {
      items = items.filter((u) => u.status.toLowerCase() === filter.status!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      items = items.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.bio && u.bio.toLowerCase().includes(q))
      );
    }

    const sortBy = filter?.sortBy || "createdAt";
    const sortOrder = filter?.sortOrder || "desc";
    items.sort((a, b) => {
      const valA = (a as any)[sortBy] || "";
      const valB = (b as any)[sortBy] || "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const page = Math.max(1, filter?.page || 1);
    const limit = Math.max(1, Math.min(100, filter?.limit || 20));
    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const data = items.slice(startIndex, startIndex + limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): User | undefined {
    const target = email.toLowerCase().trim();
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === target);
  }

  public createUser(payload: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const id = `user-${uuidv4().substring(0, 8)}`;
    const now = new Date().toISOString();
    const newUser: User = {
      ...payload,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, newUser);
    return newUser;
  }

  public updateUser(id: string, updates: Partial<Omit<User, "id" | "createdAt">>): User | undefined {
    const existing = this.users.get(id);
    if (!existing) return undefined;

    const updated: User = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, updated);
    return updated;
  }

  public deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // --- PROJECTS ---
  public getProjects(filter?: {
    category?: string;
    status?: string;
    health?: string;
    search?: string;
    leadName?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): PaginatedResult<Project> {
    let items = Array.from(this.projects.values());

    if (filter?.category) {
      items = items.filter((p) => p.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.status) {
      items = items.filter((p) => p.status.toLowerCase() === filter.status!.toLowerCase());
    }
    if (filter?.health) {
      items = items.filter((p) => p.health.toLowerCase() === filter.health!.toLowerCase());
    }
    if (filter?.leadName) {
      const q = filter.leadName.toLowerCase();
      items = items.filter((p) => p.lead.name.toLowerCase().includes(q));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.key.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    const sortBy = filter?.sortBy || "createdAt";
    const sortOrder = filter?.sortOrder || "desc";
    items.sort((a, b) => {
      const valA = (a as any)[sortBy] ?? "";
      const valB = (b as any)[sortBy] ?? "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const page = Math.max(1, filter?.page || 1);
    const limit = Math.max(1, Math.min(100, filter?.limit || 20));
    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const data = items.slice(startIndex, startIndex + limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  public getProjectById(id: string): Project | undefined {
    return this.projects.get(id);
  }

  public getProjectByKey(key: string): Project | undefined {
    const target = key.toUpperCase().trim();
    return Array.from(this.projects.values()).find((p) => p.key.toUpperCase() === target);
  }

  public createProject(
    payload: Omit<Project, "id" | "progress" | "taskCount" | "createdAt" | "updatedAt">
  ): Project {
    const id = `proj-${uuidv4().substring(0, 8)}`;
    const now = new Date().toISOString();
    const newProject: Project = {
      ...payload,
      id,
      progress: 0,
      taskCount: { total: 0, completed: 0 },
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  public updateProject(
    id: string,
    updates: Partial<Omit<Project, "id" | "taskCount" | "createdAt">>
  ): Project | undefined {
    const existing = this.projects.get(id);
    if (!existing) return undefined;

    const updated: Project = {
      ...existing,
      ...updates,
      lead: updates.lead ? { ...existing.lead, ...updates.lead } : existing.lead,
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(id, updated);
    this.recalculateProjectStats(id);
    return this.projects.get(id);
  }

  public deleteProject(id: string, deleteTasks: boolean = true): boolean {
    if (!this.projects.has(id)) return false;

    this.projects.delete(id);
    if (deleteTasks) {
      for (const [taskId, task] of this.tasks.entries()) {
        if (task.projectId === id) {
          this.tasks.delete(taskId);
        }
      }
    }
    return true;
  }

  // --- TASKS ---
  public getTasks(filter?: {
    projectId?: string;
    status?: string;
    priority?: string;
    assigneeName?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): PaginatedResult<Task> {
    let items = Array.from(this.tasks.values());

    if (filter?.projectId) {
      items = items.filter((t) => t.projectId === filter.projectId);
    }
    if (filter?.status) {
      items = items.filter((t) => t.status.toLowerCase() === filter.status!.toLowerCase());
    }
    if (filter?.priority) {
      items = items.filter((t) => t.priority.toLowerCase() === filter.priority!.toLowerCase());
    }
    if (filter?.assigneeName) {
      const q = filter.assigneeName.toLowerCase();
      items = items.filter((t) => t.assignee.name.toLowerCase().includes(q));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      items = items.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    const sortBy = filter?.sortBy || "order";
    const sortOrder = filter?.sortOrder || "asc";
    items.sort((a, b) => {
      const valA = (a as any)[sortBy] ?? "";
      const valB = (b as any)[sortBy] ?? "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const page = Math.max(1, filter?.page || 1);
    const limit = Math.max(1, Math.min(100, filter?.limit || 50));
    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const data = items.slice(startIndex, startIndex + limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  public getTaskById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  public createTask(payload: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
    const id = `task-${uuidv4().substring(0, 8)}`;
    const now = new Date().toISOString();

    const existingProjectTasks = Array.from(this.tasks.values()).filter(
      (t) => t.projectId === payload.projectId
    );
    const order = payload.order !== undefined ? payload.order : existingProjectTasks.length;

    const newTask: Task = {
      ...payload,
      id,
      order,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(id, newTask);
    this.recalculateProjectStats(payload.projectId);
    return newTask;
  }

  public updateTask(
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt">>
  ): Task | undefined {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;

    const previousProjectId = existing.projectId;
    const updated: Task = {
      ...existing,
      ...updates,
      assignee: updates.assignee ? { ...existing.assignee, ...updates.assignee } : existing.assignee,
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, updated);
    this.recalculateProjectStats(updated.projectId);
    if (updates.projectId && updates.projectId !== previousProjectId) {
      this.recalculateProjectStats(previousProjectId);
    }

    return updated;
  }

  public deleteTask(id: string): boolean {
    const existing = this.tasks.get(id);
    if (!existing) return false;

    const projectId = existing.projectId;
    this.tasks.delete(id);
    this.recalculateProjectStats(projectId);
    return true;
  }

  public reorderTasks(taskIds: string[], targetStatus?: string): Task[] {
    const updatedTasks: Task[] = [];
    taskIds.forEach((id, index) => {
      const task = this.tasks.get(id);
      if (task) {
        task.order = index;
        if (targetStatus && targetStatus !== task.status) {
          task.status = targetStatus as any;
        }
        task.updatedAt = new Date().toISOString();
        this.tasks.set(id, task);
        updatedTasks.push(task);
      }
    });

    const affectedProjectIds = new Set(updatedTasks.map((t) => t.projectId));
    for (const projId of affectedProjectIds) {
      this.recalculateProjectStats(projId);
    }

    return updatedTasks;
  }

  // --- STATS & COMPUTATIONS ---
  public recalculateProjectStats(projectId: string): void {
    const project = this.projects.get(projectId);
    if (!project) return;

    const projectTasks = Array.from(this.tasks.values()).filter(
      (t) => t.projectId === projectId
    );
    const total = projectTasks.length;
    const completed = projectTasks.filter((t) => t.status === "Done").length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    project.taskCount = { total, completed };
    project.progress = progress;
    project.updatedAt = new Date().toISOString();

    this.projects.set(projectId, project);
  }

  public recalculateAllProjectStats(): void {
    for (const projId of this.projects.keys()) {
      this.recalculateProjectStats(projId);
    }
  }

  public getProjectSummary(projectId: string): any {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const tasks = Array.from(this.tasks.values()).filter((t) => t.projectId === projectId);
    const statusCounts = {
      Todo: tasks.filter((t) => t.status === "Todo").length,
      "In Progress": tasks.filter((t) => t.status === "In Progress").length,
      "In Review": tasks.filter((t) => t.status === "In Review").length,
      Done: tasks.filter((t) => t.status === "Done").length,
    };
    const priorityCounts = {
      Low: tasks.filter((t) => t.priority === "Low").length,
      Medium: tasks.filter((t) => t.priority === "Medium").length,
      High: tasks.filter((t) => t.priority === "High").length,
      Urgent: tasks.filter((t) => t.priority === "Urgent").length,
    };
    const totalEstimatedHours = tasks.reduce((acc, t) => acc + (t.estimateHours || 0), 0);
    const completedEstimatedHours = tasks
      .filter((t) => t.status === "Done")
      .reduce((acc, t) => acc + (t.estimateHours || 0), 0);

    return {
      project,
      taskMetrics: {
        totalTasks: tasks.length,
        completedTasks: statusCounts.Done,
        completionPercentage: project.progress,
        totalEstimatedHours,
        completedEstimatedHours,
        remainingEstimatedHours: totalEstimatedHours - completedEstimatedHours,
        byStatus: statusCounts,
        byPriority: priorityCounts,
      },
    };
  }
}

export const db = new DatabaseStore();
