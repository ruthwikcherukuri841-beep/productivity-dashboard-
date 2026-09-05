import { Request, Response, NextFunction } from "express";
import { ProjectService } from "../services/project.service";

export class ProjectController {
  public static async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = ProjectService.getProjects(req.query as any);
      res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const project = ProjectService.getProjectById(id);
      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getProjectTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = req.query;
      const tasks = ProjectService.getProjectTasks(id, status as string);
      res.status(200).json({
        success: true,
        data: tasks,
        meta: { total: tasks.length },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getProjectSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const summary = ProjectService.getProjectSummary(id);
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newProject = ProjectService.createProject(req.body);
      res.status(201).location(`/api/v1/projects/${newProject.id}`).json({
        success: true,
        message: "Project created successfully",
        data: newProject,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updatedProject = ProjectService.updateProject(id, req.body);
      res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: updatedProject,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const cascade = req.query.cascade !== "false";
      ProjectService.deleteProject(id, cascade);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
