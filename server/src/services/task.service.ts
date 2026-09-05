import { db } from "../db/database";
import { Task, PaginatedResult } from "../types";
import { NotFoundError, BadRequestError } from "../errors/AppError";

export class TaskService {
  public static getTasks(filter?: {
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
    return db.getTasks(filter);
  }

  public static getTaskById(id: string): Task {
    const task = db.getTaskById(id);
    if (!task) {
      throw new NotFoundError("Task", id);
    }
    return task;
  }

  public static createTask(payload: {
    projectId: string;
    title: string;
    description?: string;
    priority?: any;
    status?: any;
    assignee: {
      id?: string;
      name: string;
      avatar: string;
    };
    estimateHours?: number;
    order?: number;
  }): Task {
    const project = db.getProjectById(payload.projectId);
    if (!project) {
      throw new BadRequestError(`Referenced project '${payload.projectId}' does not exist`);
    }

    return db.createTask({
      projectId: payload.projectId,
      title: payload.title,
      description: payload.description,
      priority: payload.priority || "Medium",
      status: payload.status || "Todo",
      assignee: payload.assignee,
      estimateHours: payload.estimateHours !== undefined ? payload.estimateHours : 2,
      order: payload.order ?? 0,
    });
  }

  public static updateTask(
    id: string,
    updates: Partial<{
      projectId: string;
      title: string;
      description: string;
      priority: any;
      status: any;
      assignee: any;
      estimateHours: number;
      order: number;
    }>
  ): Task {
    this.getTaskById(id); // Throws if not found

    if (updates.projectId) {
      const project = db.getProjectById(updates.projectId);
      if (!project) {
        throw new BadRequestError(`Target project '${updates.projectId}' does not exist`);
      }
    }

    const updated = db.updateTask(id, updates);
    if (!updated) {
      throw new NotFoundError("Task", id);
    }
    return updated;
  }

  public static updateTaskStatus(id: string, status: "Todo" | "In Progress" | "In Review" | "Done"): Task {
    this.getTaskById(id); // Throws if not found
    const updated = db.updateTask(id, { status });
    if (!updated) {
      throw new NotFoundError("Task", id);
    }
    return updated;
  }

  public static deleteTask(id: string): void {
    this.getTaskById(id); // Throws if not found
    db.deleteTask(id);
  }

  public static reorderTasks(taskIds: string[], targetStatus?: string): Task[] {
    return db.reorderTasks(taskIds, targetStatus);
  }
}
