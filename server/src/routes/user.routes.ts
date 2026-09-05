import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
  userIdParamSchema,
} from "../schemas/user.schema";

const router = Router();

router.get("/", validate(userQuerySchema, "query"), UserController.getUsers);
router.post("/", validate(createUserSchema, "body"), UserController.createUser);

router.get("/:id", validate(userIdParamSchema, "params"), UserController.getUserById);
router.put(
  "/:id",
  validate(userIdParamSchema, "params"),
  validate(createUserSchema, "body"),
  UserController.updateUser
);
router.patch(
  "/:id",
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema, "body"),
  UserController.updateUser
);
router.delete("/:id", validate(userIdParamSchema, "params"), UserController.deleteUser);

router.get("/:id/tasks", validate(userIdParamSchema, "params"), UserController.getUserTasks);
router.get("/:id/projects", validate(userIdParamSchema, "params"), UserController.getUserProjects);

export default router;
