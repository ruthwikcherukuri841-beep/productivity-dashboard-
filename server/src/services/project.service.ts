import { db } from "../db/database";
import { Project, PaginatedResult, Task } from "../types";
import { NotFoundError, ConflictError } from "../errors/AppError";

export class ProjectService {
  public static getProjects(filter?: {
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
    return db.getProjects(filter);
  }

  public static getProjectById(id: string): Project {
    const project = db.getProjectById(id);
    if (!project) {
      throw new NotFoundError("Project", id);
    }
    return project;
  }

  public static getProjectTasks(projectId: string, statusFilter?: string): Task[] {
    this.getProjectById(projectId); // Throws 404 if not found
    const result = db.getTasks({ projectId, limit: 1000 });
    let tasks = result.data;
    if (statusFilter) {
      tasks = tasks.filter((t) => t.status.toLowerCase() === statusFilter.toLowerCase());
    }
    return tasks;
  }

  public static getProjectSummary(projectId: string): any {
    this.getProjectById(projectId); // Throws 404 if not found
    return db.getProjectSummary(projectId);
  }

  public static createProject(payload: {
    name: string;
    key: string;
    category: any;
    description: string;
    status?: any;
    health?: any;
    lead: {
      id?: string;
      name: string;
      avatar: string;
      role?: string;
    };
    dueDate: string;
    tags?: string[];
  }): Project {
    const existing = db.getProjectByKey(payload.key);
    if (existing) {
      throw new ConflictError(`Project with key '${payload.key.toUpperCase()}' already exists`);
    }

    return db.createProject({
      name: payload.name,
      key: payload.key.toUpperCase(),
      category: payload.category,
      description: payload.description,
      status: payload.status || "Planning",
      health: payload.health || "On Track",
      lead: payload.lead,
      dueDate: payload.dueDate,
      tags: payload.tags || [],
    });
  }

  public static updateProject(
    id: string,
    updates: Partial<{
      name: string;
      key: string;
      category: any;
      description: string;
      status: any;
      health: any;
      lead: any;
      dueDate: string;
      tags: string[];
    }>
  ): Project {
    this.getProjectById(id); // Throws if not found

    if (updates.key) {
      const keyProject = db.getProjectByKey(updates.key);
      if (keyProject && keyProject.id !== id) {
        throw new ConflictError(`Project key '${updates.key.toUpperCase()}' is already taken`);
      }
      updates.key = updates.key.toUpperCase();
    }

    const updated = db.updateProject(id, updates);
    if (!updated) {
      throw new NotFoundError("Project", id);
    }
    return updated;
  }

  public static deleteProject(id: string, deleteTasks: boolean = true): void {
    this.getProjectById(id); // Throws if not found
    db.deleteProject(id, deleteTasks);
  }
}
