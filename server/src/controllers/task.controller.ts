import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";

export class TaskController {
  public static async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = TaskService.getTasks(req.query as any);
      res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const task = TaskService.getTaskById(id);
      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newTask = TaskService.createTask(req.body);
      res.status(201).location(`/api/v1/tasks/${newTask.id}`).json({
        success: true,
        message: "Task created successfully",
        data: newTask,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updatedTask = TaskService.updateTask(id, req.body);
      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: updatedTask,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateTaskStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const updatedTask = TaskService.updateTaskStatus(id, status);
      res.status(200).json({
        success: true,
        message: `Task status updated to '${status}'`,
        data: updatedTask,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      TaskService.deleteTask(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  public static async reorderTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { taskIds, status } = req.body;
      const updatedTasks = TaskService.reorderTasks(taskIds, status);
      res.status(200).json({
        success: true,
        message: `Successfully reordered ${updatedTasks.length} tasks`,
        data: updatedTasks,
      });
    } catch (err) {
      next(err);
    }
  }
}
