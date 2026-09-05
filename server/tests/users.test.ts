import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app";
import { db } from "../src/db/database";

const app = createApp();

describe("Users API Endpoints (/api/v1/users)", () => {
  beforeEach(() => {
    db.reset();
  });

  it("GET /api/v1/users should list initial users with pagination metadata", async () => {
    const res = await request(app).get("/api/v1/users");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length >= 6);
    assert.equal(res.body.meta.page, 1);
    assert.ok(res.body.meta.total >= 6);
  });

  it("GET /api/v1/users?role=Engineer should filter users by role", async () => {
    const res = await request(app).get("/api/v1/users?role=Engineer");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    for (const user of res.body.data) {
      assert.equal(user.role, "Engineer");
    }
  });

  it("GET /api/v1/users/:id should return a specific user profile", async () => {
    const res = await request(app).get("/api/v1/users/user-1");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.id, "user-1");
    assert.equal(res.body.data.name, "Alex Rivera");
  });

  it("GET /api/v1/users/:id should return 404 for unknown user", async () => {
    const res = await request(app).get("/api/v1/users/non-existent-user");
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, "NOT_FOUND");
  });

  it("POST /api/v1/users should create a new user and return 201", async () => {
    const payload = {
      name: "Jordan Reed",
      email: "jordan.reed@devpulse.io",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: "Engineer",
      status: "Online",
      bio: "Core platform engineer.",
    };

    const res = await request(app).post("/api/v1/users").send(payload);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, "Jordan Reed");
    assert.equal(res.body.data.email, "jordan.reed@devpulse.io");
    assert.ok(res.header.location);
  });

  it("POST /api/v1/users should return 409 when email is already registered", async () => {
    const payload = {
      name: "Duplicate Alex",
      email: "alex.rivera@devpulse.io",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    };

    const res = await request(app).post("/api/v1/users").send(payload);
    assert.equal(res.status, 409);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, "CONFLICT");
  });

  it("PATCH /api/v1/users/:id should update user status and bio", async () => {
    const res = await request(app)
      .patch("/api/v1/users/user-1")
      .send({ status: "Focus", bio: "Updated focus bio" });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, "Focus");
    assert.equal(res.body.data.bio, "Updated focus bio");
  });

  it("DELETE /api/v1/users/:id should delete user and return 204", async () => {
    const res = await request(app).delete("/api/v1/users/user-5");
    assert.equal(res.status, 204);

    const getRes = await request(app).get("/api/v1/users/user-5");
    assert.equal(getRes.status, 404);
  });

  it("GET /api/v1/users/:id/tasks should return tasks assigned to user", async () => {
    const res = await request(app).get("/api/v1/users/user-1/tasks");
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
  });
});
