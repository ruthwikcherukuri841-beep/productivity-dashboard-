# ⚡ DevPulse — Users, Projects & Tasks REST API

A production-grade, modular RESTful API built with **Node.js**, **Express**, **TypeScript**, and **Zod**. Designed to power user management, project initiative tracking, and interactive sprint/Kanban task workflows with centralized error handling, live telemetry, and Swagger UI interactive docs.

---

## 🚀 Quick Start

### 1. Installation & Environment Setup
```bash
# Ensure dependencies are installed
npm install

# Optional: configure port or environment variables
cp server/.env.example .env
```

### 2. Running the Server
```bash
# Start backend in development mode (with hot-reload)
npm run server:dev

# Start backend in production mode
npm run server:start
```

The server will start listening at:
- **API Base URL**: `http://localhost:4000/api/v1`
- **Interactive Swagger UI Docs**: `http://localhost:4000/api-docs`
- **OpenAPI 3.0 Specification**: `http://localhost:4000/api/v1/docs/openapi.json`
- **Postman Collection Export**: `http://localhost:4000/api/v1/docs/postman`
- **Health & Diagnostic Check**: `http://localhost:4000/api/v1/health`

### 3. Running Automated Tests
```bash
npm run server:test
```

---

## 🏛️ Architecture & Folder Structure

The server follows a clean, layered architecture:

```
server/
├── src/
│   ├── app.ts                  # Express application setup, middlewares, routes
│   ├── server.ts               # Server bootstrap & graceful process termination
│   ├── config/
│   │   └── index.ts            # Environment variables and configuration constants
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces and status types
│   ├── errors/
│   │   └── AppError.ts         # Custom error hierarchy (400, 404, 409, 422, 500)
│   ├── schemas/
│   │   ├── user.schema.ts      # Zod validation schemas for user requests
│   │   ├── project.schema.ts   # Zod validation schemas for project requests
│   │   └── task.schema.ts      # Zod validation schemas for task requests
│   ├── middlewares/
│   │   ├── validate.ts         # Generic Zod validation middleware (body, query, params)
│   │   ├── errorHandler.ts     # Centralized error handler with standardized JSON output
│   │   ├── requestLogger.ts    # HTTP request logger with latency & color-coded status
│   │   └── notFound.ts         # 404 handler for unmatched routes
│   ├── db/
│   │   ├── database.ts         # Thread-safe repository with automatic stats recalculation
│   │   └── seed.ts             # Initial realistic seed data matching frontend models
│   ├── services/
│   │   ├── user.service.ts     # User management & activity query logic
│   │   ├── project.service.ts  # Project lifecycle & progress aggregation logic
│   │   └── task.service.ts     # Task workflow, status transitions, and reordering logic
│   ├── controllers/
│   │   ├── user.controller.ts  # User route controllers
│   │   ├── project.controller.ts # Project route controllers
│   │   ├── task.controller.ts  # Task route controllers
│   │   └── health.controller.ts # Telemetry and health check controller
│   ├── routes/
│   │   ├── index.ts            # /api/v1 root router
│   │   ├── user.routes.ts      # /api/v1/users
│   │   ├── project.routes.ts   # /api/v1/projects
│   │   ├── task.routes.ts      # /api/v1/tasks
│   │   ├── health.routes.ts    # /api/v1/health
│   │   └── docs.routes.ts      # /api-docs (Swagger UI) & /api/v1/docs
│   └── docs/
│       ├── openapi.json        # OpenAPI 3.0 specification
│       └── postman_collection.json # Postman Collection v2.1 export
├── tests/
│   ├── users.test.ts           # User CRUD and filter integration tests
│   ├── projects.test.ts        # Project management & calculation tests
│   ├── tasks.test.ts           # Task status transition & reordering tests
│   └── errors.test.ts          # Centralized error handling and validation tests
└── README.md
```

---

## 📡 Complete REST API Catalog

### 1. 👥 User Management (`/api/v1/users`)

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users` | List users (supports `?role=`, `?status=`, `?search=`, `?page=`, `?limit=`) | `200`, `422` |
| `GET` | `/api/v1/users/:id` | Get user profile by ID | `200`, `404` |
| `GET` | `/api/v1/users/:id/tasks` | Get all tasks assigned to user | `200`, `404` |
| `GET` | `/api/v1/users/:id/projects`| Get all projects led by user | `200`, `404` |
| `POST` | `/api/v1/users` | Create/register new user | `201`, `409`, `422` |
| `PUT` | `/api/v1/users/:id` | Full update of user profile | `200`, `404`, `409`, `422` |
| `PATCH` | `/api/v1/users/:id` | Partial update of user profile | `200`, `404`, `409`, `422` |
| `DELETE` | `/api/v1/users/:id` | Delete user | `204`, `404` |

#### Sample Create User Payload
```bash
curl -X POST http://localhost:4000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jordan Reed",
    "email": "jordan.reed@devpulse.io",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    "role": "Engineer",
    "status": "Online",
    "bio": "Distributed systems developer building high-throughput services."
  }'
```

---

### 2. 🗂️ Projects & Initiatives (`/api/v1/projects`)

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/projects` | List projects (supports `?category=`, `?status=`, `?health=`, `?search=`, `?page=`) | `200`, `422` |
| `GET` | `/api/v1/projects/:id` | Get project by ID (includes dynamically calculated `progress` & `taskCount`) | `200`, `404` |
| `GET` | `/api/v1/projects/:id/tasks` | List tasks under project (`?status=` filter available) | `200`, `404` |
| `GET` | `/api/v1/projects/:id/summary` | Get aggregated project metrics, status distribution, and estimate hours | `200`, `404` |
| `POST` | `/api/v1/projects` | Create new project / initiative | `201`, `409`, `422` |
| `PUT` | `/api/v1/projects/:id` | Full update of project | `200`, `404`, `409`, `422` |
| `PATCH` | `/api/v1/projects/:id` | Partial update of project | `200`, `404`, `409`, `422` |
| `DELETE` | `/api/v1/projects/:id` | Delete project (`?cascade=true` deletes child tasks) | `204`, `404` |

#### Sample Create Project Payload
```bash
curl -X POST http://localhost:4000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hyperion Gate Router",
    "key": "NET-02",
    "category": "Core Infrastructure",
    "description": "Edge API routing mesh with automated mTLS negotiation.",
    "status": "Planning",
    "health": "On Track",
    "lead": {
      "name": "Alex Rivera",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    "dueDate": "2026-11-30",
    "tags": ["Rust", "eBPF", "Network"]
  }'
```

---

### 3. 📋 Tasks & Workflow Lifecycle (`/api/v1/tasks`)

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tasks` | List tasks (`?projectId=`, `?status=`, `?priority=`, `?assigneeName=`, `?search=`) | `200`, `422` |
| `GET` | `/api/v1/tasks/:id` | Get task by ID | `200`, `404` |
| `POST` | `/api/v1/tasks` | Create task (triggers parent project progress auto-recalculation) | `201`, `400`, `422` |
| `PUT` | `/api/v1/tasks/:id` | Full update of task | `200`, `400`, `404`, `422` |
| `PATCH` | `/api/v1/tasks/:id` | Partial update of task | `200`, `400`, `404`, `422` |
| `PATCH` | `/api/v1/tasks/:id/status` | Quick status lifecycle transition (`Todo` -> `In Progress` -> `In Review` -> `Done`) | `200`, `404`, `422` |
| `POST` | `/api/v1/tasks/reorder` | Batch reorder tasks and/or move column status | `200`, `422` |
| `DELETE` | `/api/v1/tasks/:id` | Delete task (triggers parent project progress auto-recalculation) | `204`, `404` |

#### Sample Quick Status Transition
```bash
curl -X PATCH http://localhost:4000/api/v1/tasks/task-4/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Done"
  }'
```

---

## 🛡️ Centralized Error Handling

All error responses across the entire REST API follow a predictable, standardized JSON envelope:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request input validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address format",
        "rule": "invalid_string"
      }
    ],
    "statusCode": 422,
    "timestamp": "2026-09-05T09:40:00.000Z",
    "path": "/api/v1/users"
  }
}
```

### Standard HTTP Status Codes Used:
- `200 OK`: Successful retrieval or modification.
- `201 Created`: Resource successfully created, includes `Location` header.
- `204 No Content`: Successful deletion without response body.
- `400 Bad Request`: Malformed JSON or invalid foreign key references.
- `404 Not Found`: Target entity or route does not exist.
- `409 Conflict`: Unique constraint violation (e.g. duplicate email or project key).
- `422 Unprocessable Entity`: Zod schema validation errors with field-level details.
- `500 Internal Server Error`: Unhandled server runtime exceptions.

---

## 🧪 Automated Testing

The API includes comprehensive integration and edge-case tests with zero external test runner bloat using Node's built-in test runner + `supertest`:

- **Users**: List pagination, role filter, get by ID, duplicate email conflict, 404 handling, profile updates, deletion, assigned tasks query.
- **Projects**: Category filter, dynamic progress calculation, key uniqueness conflict, summary breakdown metrics, cascading deletion.
- **Tasks**: Lifecycle status transition, project progress auto-sync, sprint board reordering, invalid project reference rejection.
- **Error Handling**: Missing schema properties validation (422), unknown route 404, malformed body rejection.

To run the tests:
```bash
npm run server:test
```
