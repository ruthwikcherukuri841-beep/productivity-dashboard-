import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app";
import { db } from "../src/db/database";

const app = createApp();

describe("Tasks API Endpoints (/api/v1/tasks)", () => {
  beforeEach(() => {
    db.reset();
  });

  it("GET /api/v1/tasks should list all tasks", async () => {
    const res = await request(app).get("/api/v1/tasks");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length >= 10);
  });

  it("GET /api/v1/tasks?status=Done should filter tasks by status", async () => {
    const res = await request(app).get("/api/v1/tasks?status=Done");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    for (const task of res.body.data) {
      assert.equal(task.status, "Done");
    }
  });

  it("POST /api/v1/tasks should create a new task and recalculate project completion percentage", async () => {
    // Check initial project progress
    const initProjRes = await request(app).get("/api/v1/projects/proj-1");
    const initialTotal = initProjRes.body.data.taskCount.total;

    const payload = {
      projectId: "proj-1",
      title: "Add benchmark runner for eBPF kernel hooks",
      description: "Measure latency impact of socket level instrumentation.",
      priority: "High",
      status: "Todo",
      assignee: {
        name: "Alex Rivera",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      },
      estimateHours: 4,
    };

    const res = await request(app).post("/api/v1/tasks").send(payload);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.title, "Add benchmark runner for eBPF kernel hooks");

    // Verify parent project taskCount updated
    const afterProjRes = await request(app).get("/api/v1/projects/proj-1");
    assert.equal(afterProjRes.body.data.taskCount.total, initialTotal + 1);
  });

  it("PATCH /api/v1/tasks/:id/status should update task status and trigger project progress update", async () => {
    const res = await request(app)
      .patch("/api/v1/tasks/task-4/status")
      .send({ status: "Done" });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, "Done");

    // Check project progress increased to 100% since all tasks in proj-1 are now Done
    const projRes = await request(app).get("/api/v1/projects/proj-1");
    assert.equal(projRes.body.data.progress, 100);
    assert.equal(projRes.body.data.taskCount.completed, 4);
  });

  it("POST /api/v1/tasks/reorder should reorder tasks and update column status", async () => {
    const res = await request(app).post("/api/v1/tasks/reorder").send({
      taskIds: ["task-2", "task-1", "task-3"],
      status: "In Progress",
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 3);
    assert.equal(res.body.data[0].id, "task-2");
    assert.equal(res.body.data[0].order, 0);
    assert.equal(res.body.data[0].status, "In Progress");
  });

  it("DELETE /api/v1/tasks/:id should delete task and decrease project taskCount", async () => {
    const initProjRes = await request(app).get("/api/v1/projects/proj-1");
    const initialTotal = initProjRes.body.data.taskCount.total;

    const res = await request(app).delete("/api/v1/tasks/task-1");
    assert.equal(res.status, 204);

    const checkProj = await request(app).get("/api/v1/projects/proj-1");
    assert.equal(checkProj.body.data.taskCount.total, initialTotal - 1);
  });
});
