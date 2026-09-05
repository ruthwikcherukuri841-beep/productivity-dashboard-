import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import openApiSpec from "../docs/openapi.json";
import postmanCollection from "../docs/postman_collection.json";

const router = Router();

// Swagger UI custom styling and options
const swaggerOptions: swaggerUi.SwaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui { background-color: #0f172a; color: #f8fafc; }
    .swagger-ui .info .title { color: #38bdf8; }
    .swagger-ui .scheme-container { background-color: #1e293b; }
    .swagger-ui select { background-color: #1e293b; color: #f8fafc; }
  `,
  customSiteTitle: "DevPulse API Documentation",
};

// Mount Swagger UI
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(openApiSpec, swaggerOptions));

export const openApiJsonHandler = (_req: any, res: any) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(openApiSpec);
};

export const postmanJsonHandler = (_req: any, res: any) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(postmanCollection);
};

export default router;
