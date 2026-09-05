import { createApp } from "./app";
import { config } from "./config";

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`
  ======================================================
  ⚡ DevPulse Users, Projects & Tasks REST API Server
  ======================================================
  🚀 Server running on: http://localhost:${config.port}
  📖 Swagger UI Docs:   http://localhost:${config.port}/api-docs
  📄 OpenAPI Spec:      http://localhost:${config.port}/api/v1/docs/openapi.json
  📮 Postman Export:    http://localhost:${config.port}/api/v1/docs/postman
  🩺 Health Endpoint:   http://localhost:${config.port}/api/v1/health
  ======================================================
  `);
});

// Graceful shutdown
const shutdown = () => {
  console.log("\n🛑 Received shutdown signal. Closing server...");
  server.close(() => {
    console.log("✅ Server closed safely. Exiting process.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("⚠️ Forcing server shutdown after timeout.");
    process.exit(1);
  }, 5000);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export { server };
