import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { validate } from "../middlewares/validate";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  reorderTasksSchema,
  taskQuerySchema,
  taskIdParamSchema,
} from "../schemas/task.schema";

const router = Router();

router.get("/", validate(taskQuerySchema, "query"), TaskController.getTasks);
router.post("/", validate(createTaskSchema, "body"), TaskController.createTask);
router.post("/reorder", validate(reorderTasksSchema, "body"), TaskController.reorderTasks);

router.get("/:id", validate(taskIdParamSchema, "params"), TaskController.getTaskById);
router.put(
  "/:id",
  validate(taskIdParamSchema, "params"),
  validate(createTaskSchema, "body"),
  TaskController.updateTask
);
router.patch(
  "/:id",
  validate(taskIdParamSchema, "params"),
  validate(updateTaskSchema, "body"),
  TaskController.updateTask
);
router.patch(
  "/:id/status",
  validate(taskIdParamSchema, "params"),
  validate(updateTaskStatusSchema, "body"),
  TaskController.updateTaskStatus
);
router.delete("/:id", validate(taskIdParamSchema, "params"), TaskController.deleteTask);

export default router;
