import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { validate } from "../middlewares/validate";
import {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
  projectIdParamSchema,
} from "../schemas/project.schema";

const router = Router();

router.get("/", validate(projectQuerySchema, "query"), ProjectController.getProjects);
router.post("/", validate(createProjectSchema, "body"), ProjectController.createProject);

router.get("/:id", validate(projectIdParamSchema, "params"), ProjectController.getProjectById);
router.put(
  "/:id",
  validate(projectIdParamSchema, "params"),
  validate(createProjectSchema, "body"),
  ProjectController.updateProject
);
router.patch(
  "/:id",
  validate(projectIdParamSchema, "params"),
  validate(updateProjectSchema, "body"),
  ProjectController.updateProject
);
router.delete("/:id", validate(projectIdParamSchema, "params"), ProjectController.deleteProject);

router.get("/:id/tasks", validate(projectIdParamSchema, "params"), ProjectController.getProjectTasks);
router.get("/:id/summary", validate(projectIdParamSchema, "params"), ProjectController.getProjectSummary);

export default router;
