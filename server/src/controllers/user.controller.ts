import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  public static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = UserService.getUsers(req.query as any);
      res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const user = UserService.getUserById(id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getUserTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const tasks = UserService.getUserTasks(id);
      res.status(200).json({
        success: true,
        data: tasks,
        meta: { total: tasks.length },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getUserProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const projects = UserService.getUserProjects(id);
      res.status(200).json({
        success: true,
        data: projects,
        meta: { total: projects.length },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newUser = UserService.createUser(req.body);
      res.status(201).location(`/api/v1/users/${newUser.id}`).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updatedUser = UserService.updateUser(id, req.body);
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      UserService.deleteUser(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
