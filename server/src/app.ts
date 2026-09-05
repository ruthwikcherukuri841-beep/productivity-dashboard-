import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { requestLogger } from "./middlewares/requestLogger";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import apiRouter from "./routes";
import docsRouter from "./routes/docs.routes";

export const createApp = (): Application => {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows Swagger UI assets
      crossOriginEmbedderPolicy: false,
    })
  );

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Body parsers
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));

  // Request logging
  app.use(requestLogger);

  // Documentation UI endpoint
  app.use("/api-docs", docsRouter);
  app.use("/api/v1/docs", docsRouter);

  // API v1 root
  app.use("/api/v1", apiRouter);

  // Root redirect / welcome message
  app.get("/", (_req, res) => {
    res.status(200).json({
      name: "DevPulse REST API",
      version: "1.0.0",
      status: "running",
      endpoints: {
        documentation: "/api-docs",
        openapi_spec: "/api/v1/docs/openapi.json",
        postman_collection: "/api/v1/docs/postman",
        health: "/api/v1/health",
        users: "/api/v1/users",
        projects: "/api/v1/projects",
        tasks: "/api/v1/tasks",
      },
    });
  });

  // 404 Route Not Found
  app.use(notFoundHandler);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
