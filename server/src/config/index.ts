import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env if present
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4000", 10),
  apiVersion: process.env.API_VERSION || "v1",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  logLevel: process.env.LOG_LEVEL || "info",
  dbPersistPath: process.env.DB_PERSIST_PATH || path.resolve(__dirname, "../../data/store.json"),
  isDev: (process.env.NODE_ENV || "development") === "development",
  isTest: process.env.NODE_ENV === "test",
};
