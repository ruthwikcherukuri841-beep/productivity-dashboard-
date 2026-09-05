import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app";
import { db } from "../src/db/database";

const app = createApp();

describe("Projects API Endpoints (/api/v1/projects)", () => {
  beforeEach(() => {
    db.reset();
  });

  it("GET /api/v1/projects should list seeded projects", async () => {
    const res = await request(app).get("/api/v1/projects");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.length >= 5);
    assert.equal(res.body.meta.page, 1);
  });

  it("GET /api/v1/projects?category=Core%20Infrastructure should filter by category", async () => {
    const res = await request(app).get("/api/v1/projects?category=Core Infrastructure");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    for (const project of res.body.data) {
      assert.equal(project.category, "Core Infrastructure");
    }
  });

  it("GET /api/v1/projects/:id should return single project details", async () => {
    const res = await request(app).get("/api/v1/projects/proj-1");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.id, "proj-1");
    assert.equal(res.body.data.key, "ENG-01");
    assert.ok(typeof res.body.data.progress === "number");
  });

  it("POST /api/v1/projects should create a new project and return 201", async () => {
    const payload = {
      name: "Hyperion Gate Router",
      key: "NET-02",
      category: "Core Infrastructure",
      description: "Edge API routing mesh with automated mTLS negotiation.",
      status: "Planning",
      health: "On Track",
      lead: {
        name: "Alex Rivera",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      },
      dueDate: "2026-11-30",
      tags: ["Rust", "eBPF", "Network"],
    };

    const res = await request(app).post("/api/v1/projects").send(payload);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, "Hyperion Gate Router");
    assert.equal(res.body.data.key, "NET-02");
    assert.equal(res.body.data.progress, 0);
  });

  it("POST /api/v1/projects should return 409 when project key is already taken", async () => {
    const payload = {
      name: "Duplicate Key Project",
      key: "ENG-01",
      category: "Core Infrastructure",
      description: "Testing conflict error handling.",
      lead: {
        name: "Alex Rivera",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      },
      dueDate: "2026-12-31",
    };

    const res = await request(app).post("/api/v1/projects").send(payload);
    assert.equal(res.status, 409);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, "CONFLICT");
  });

  it("GET /api/v1/projects/:id/summary should return computed breakdown metrics", async () => {
    const res = await request(app).get("/api/v1/projects/proj-1/summary");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.taskMetrics);
    assert.ok(typeof res.body.data.taskMetrics.totalTasks === "number");
    assert.ok(typeof res.body.data.taskMetrics.completedTasks === "number");
    assert.ok(res.body.data.taskMetrics.byStatus);
    assert.ok(res.body.data.taskMetrics.byPriority);
  });

  it("DELETE /api/v1/projects/:id should delete project and associated tasks", async () => {
    const res = await request(app).delete("/api/v1/projects/proj-4");
    assert.equal(res.status, 204);

    const checkProj = await request(app).get("/api/v1/projects/proj-4");
    assert.equal(checkProj.status, 404);
  });
});
