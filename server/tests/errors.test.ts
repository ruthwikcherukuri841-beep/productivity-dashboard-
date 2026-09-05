import { describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app";

const app = createApp();

describe("Centralized Error Handling & Input Validation", () => {
  it("GET /api/v1/invalid-route should return 404 with standardized error JSON", async () => {
    const res = await request(app).get("/api/v1/invalid-route");
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, "NOT_FOUND");
    assert.ok(res.body.error.timestamp);
    assert.ok(res.body.error.path);
  });

  it("POST /api/v1/users with missing required fields should return 422 with validation issues", async () => {
    const res = await request(app).post("/api/v1/users").send({
      // Missing name and email
      role: "Engineer",
    });

    assert.equal(res.status, 422);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, "VALIDATION_ERROR");
    assert.ok(Array.isArray(res.body.error.details));
    assert.ok(res.body.error.details.length > 0);
  });

  it("POST /api/v1/tasks with invalid project reference should return 400 Bad Request", async () => {
    const res = await request(app).post("/api/v1/tasks").send({
      projectId: "non-existent-proj",
      title: "Test task on non-existent project",
      assignee: {
        name: "Alex Rivera",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      },
      estimateHours: 2,
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, "BAD_REQUEST");
  });

  it("GET /api/v1/health should return 200 with service telemetry", async () => {
    const res = await request(app).get("/api/v1/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.status, "healthy");
    assert.ok(res.body.uptime >= 0);
    assert.ok(res.body.memory);
  });
});
