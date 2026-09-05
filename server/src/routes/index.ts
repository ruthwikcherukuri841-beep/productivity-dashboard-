import { Router } from "express";
import userRoutes from "./user.routes";
import projectRoutes from "./project.routes";
import taskRoutes from "./task.routes";
import healthRoutes from "./health.routes";
import { openApiJsonHandler, postmanJsonHandler } from "./docs.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

// Raw documentation endpoints
router.get("/docs/openapi.json", openApiJsonHandler);
router.get("/docs/postman", postmanJsonHandler);

export default router;
