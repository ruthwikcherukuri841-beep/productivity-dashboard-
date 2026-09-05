# ⚡ DevPulse — Users, Projects & Tasks REST API
## Comprehensive Executive & Technical Summary

---

## 🎯 Executive Overview
The **DevPulse Users, Projects & Tasks REST API** is a modular backend service built in **Node.js + Express + TypeScript**. It provides the core data layer for developer productivity suites, sprint backlogs, initiative tracking, and platform observability workflows.

### 🌟 Key Highlights
- **Strict Input Validation**: All write operations (`POST`, `PUT`, `PATCH`) and query parameters are validated with **Zod** schemas.
- **Centralized Error Handling**: Standardized JSON error response format with precise HTTP status codes (`200`, `201`, `204`, `400`, `404`, `409`, `422`, `500`).
- **Dynamic Progress Syncing**: Tasks automatically recalculate parent project progress percentage and completion ratios on state transitions.
- **Interactive Documentation**: Built-in **Swagger UI** hosted at `/api-docs`, an exportable **OpenAPI 3.0 specification**, and an importable **Postman Collection v2.1**.
- **Comprehensive Automated Tests**: 26 integration test cases covering positive workflows, edge cases, constraint violations, and status transitions with 100% pass rate.

---

## 🛠️ Architecture & Technology Stack

```
                                  ┌─────────────────────────────┐
                                  │       Client / Browser      │
                                  │ (Dashboard / Swagger / Postman)
                                  └──────────────┬──────────────┘
                                                 │ HTTP / JSON
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Express Middleware Pipeline                                                                     │
│  ├── Helmet (Security Headers)                                                                  │
│  ├── CORS Handler (Configurable origins)                                                        │
│  ├── Morgan / Request Logger (Method, URL, Status, Latency)                                     │
│  └── Zod Schema Validator (Body, Query, Params)                                                 │
└────────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                 │
                        ┌────────────────────────┼────────────────────────┐
                        ▼                        ▼                        ▼
               ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
               │ UserController  │      │ProjectController│      │ TaskController  │
               └────────┬────────┘      └────────┬────────┘      └────────┬────────┘
                        │                        │                        │
                        ▼                        ▼                        ▼
               ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
               │   UserService   │      │ ProjectService  │      │   TaskService   │
               └────────┬────────┘      └────────┬────────┘      └────────┬────────┘
                        │                        │                        │
                        └────────────────────────┼────────────────────────┘
                                                 │
                                                 ▼
                               ┌──────────────────────────────────┐
                               │     In-Memory Database Store     │
                               │  (Map-based thread-safe storage  │
                               │   with pre-seeded DevPulse data) │
                               └──────────────────────────────────┘
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime & Framework** | Node.js + Express 5 (TypeScript) | Non-blocking, high-performance RESTful routing and middleware pipeline |
| **Data Validation** | Zod 4.5 | Declarative runtime type validation for bodies, query filters, and path params |
| **API Documentation** | Swagger UI Express + OpenAPI 3.0 | Interactive API testing playground and machine-readable specification |
| **Security & Logging** | Helmet, CORS, Morgan | HTTP header protection, cross-origin resource sharing, structured latency logging |
| **Testing** | Node.js Test Runner + Supertest | Zero-bloat integration and contract test execution |

---

## 📡 Complete REST API Endpoint Reference

### 1. 👥 User Management (`/api/v1/users`)
| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users` | List users with pagination (`?page=1&limit=20`), role filter (`?role=Engineer`), and search (`?search=alex`) | `200`, `422` |
| `GET` | `/api/v1/users/:id` | Retrieve single user profile by ID | `200`, `404` |
| `GET` | `/api/v1/users/:id/tasks` | Get all tasks assigned to user | `200`, `404` |
| `GET` | `/api/v1/users/:id/projects` | Get all projects led by user | `200`, `404` |
| `POST` | `/api/v1/users` | Create/register new user with avatar, role, and bio | `201`, `409`, `422` |
| `PUT` | `/api/v1/users/:id` | Full update of user profile | `200`, `404`, `409`, `422` |
| `PATCH` | `/api/v1/users/:id` | Partial update of user profile (`status`, `bio`, etc.) | `200`, `404`, `409`, `422` |
| `DELETE` | `/api/v1/users/:id` | Delete user | `204`, `404` |

### 2. 🗂️ Projects & Initiatives (`/api/v1/projects`)
| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/projects` | List projects filtered by `category`, `status`, `health`, or keyword | `200`, `422` |
| `GET` | `/api/v1/projects/:id` | Get project by ID with real-time computed `progress` (0-100%) and `taskCount` | `200`, `404` |
| `GET` | `/api/v1/projects/:id/tasks` | List all tasks belonging to project (optional `?status=` filter) | `200`, `404` |
| `GET` | `/api/v1/projects/:id/summary`| Get aggregated project metrics, status distribution, and estimate hours | `200`, `404` |
| `POST` | `/api/v1/projects` | Create initiative (validated key e.g. `ENG-01`, lead, due date, tags) | `201`, `409`, `422` |
| `PUT` | `/api/v1/projects/:id` | Full update of project details | `200`, `404`, `409`, `422` |
| `PATCH` | `/api/v1/projects/:id` | Partial update of project details | `200`, `404`, `409`, `422` |
| `DELETE` | `/api/v1/projects/:id` | Delete project (`?cascade=true` deletes child tasks) | `204`, `404` |

### 3. 📋 Tasks & Workflow Lifecycle (`/api/v1/tasks`)
| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tasks` | Query sprint tasks with multi-field filtering (`projectId`, `status`, `priority`, `assigneeName`) | `200`, `422` |
| `GET` | `/api/v1/tasks/:id` | Get task by ID | `200`, `404` |
| `POST` | `/api/v1/tasks` | Create task attached to project -> automatically recalculates parent project progress | `201`, `400`, `422` |
| `PUT` | `/api/v1/tasks/:id` | Full update of task | `200`, `400`, `404`, `422` |
| `PATCH` | `/api/v1/tasks/:id` | Partial update of task | `200`, `400`, `404`, `422` |
| `PATCH` | `/api/v1/tasks/:id/status` | Fast status lifecycle transition (`Todo` -> `In Progress` -> `In Review` -> `Done`) | `200`, `404`, `422` |
| `POST` | `/api/v1/tasks/reorder` | Batch reorder sprint tasks across columns and update statuses | `200`, `422` |
| `DELETE` | `/api/v1/tasks/:id` | Delete task -> auto-updates project completion percentage | `204`, `404` |

### 4. 🩺 System Telemetry & Documentation
| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Memory utilization, uptime, service status, and version | `200` |
| `GET` | `/api-docs` | Interactive Swagger UI documentation playground | `200` |
| `GET` | `/api/v1/docs/openapi.json` | Raw OpenAPI 3.0 specification JSON | `200` |
| `GET` | `/api/v1/docs/postman` | Exportable Postman Collection v2.1 | `200` |

---

## 🛡️ Centralized Error Handling Model

Every error response adheres strictly to a predictable JSON envelope:

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

---

## 🧪 Test Suite Results

```
✔ Centralized Error Handling & Input Validation (4/4 tests passed)
✔ Projects API Endpoints (7/7 tests passed)
✔ Tasks API Endpoints (6/6 tests passed)
✔ Users API Endpoints (9/9 tests passed)

Total: 26 passing | 0 failing | 100% Success Rate
```

---

## 🚀 Quick Execution Reference

```bash
# 1. Start server with hot-reload:
npm run server:dev

# 2. Run automated test suite:
npm run server:test

# 3. Build TypeScript production bundle:
npm run server:build
```
