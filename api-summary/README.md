# ⚡ DevPulse — Complete System & REST API Master Summary
## Unified Architecture, Frontend Dashboard, REST API & Deployment Reference

---

## 🔗 Project Links & Live Access Points

| Resource | Link / URL | Description |
| :--- | :--- | :--- |
| **GitHub Repository** | [productivity-dashboard-](https://github.com/ruthwikcherukuri841-beep/productivity-dashboard-) | Main project repository |
| **REST API Server Folder** | [/server](https://github.com/ruthwikcherukuri841-beep/productivity-dashboard-/tree/main/server) | Backend TypeScript + Express source |
| **API Summary Folder** | [/api-summary](https://github.com/ruthwikcherukuri841-beep/productivity-dashboard-/tree/main/api-summary) | Complete API & Dashboard documentation |
| **Live Production Web App** | [Vercel Deployment](https://dashboard-one-gilt-51.vercel.app?_vercel_share=AkaMYc1hdGqmaFHoFCK0ggAdrtsibcAO) | Live Next.js 15 developer productivity dashboard |
| **Local REST API Base** | `http://localhost:4000` | Local Express REST API Server |
| **Interactive Swagger UI** | `http://localhost:4000/api-docs` | Interactive Swagger API Playground |
| **OpenAPI 3.0 Spec** | `http://localhost:4000/api/v1/docs/openapi.json` | OpenAPI 3.0 Machine-readable specification |
| **Postman Collection** | `http://localhost:4000/api/v1/docs/postman` | Exportable Postman Collection v2.1 |
| **Health Check Endpoint** | `http://localhost:4000/api/v1/health` | Service uptime and memory diagnostics |

---

## 🎯 Executive Overview

**DevPulse** is a complete, production-grade developer workspace and productivity platform consisting of:
1. **Frontend**: A **Next.js 15 + React 19 + Tailwind CSS + Framer Motion** dashboard inspired by Linear and Vercel dark aesthetics.
2. **Backend**: A modular **Node.js + Express 5 + TypeScript** REST API engine providing robust data management for users, initiatives, tasks, and system telemetry.

---

## 🛠️ Complete Full-Stack Architecture

```
                               ┌────────────────────────────────────────────────────────┐
                               │           Next.js 15 Dashboard / Browser               │
                               │   (Kanban, Analytics, Copilot, CI/CD, Command Palette) │
                               └───────────────────────────┬────────────────────────────┘
                                                           │ HTTP / JSON
                                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Express 5 REST API Server (Port 4000)                                                                   │
│  ├── Helmet (Security Headers)                                                                          │
│  ├── CORS (Configurable Origins)                                                                        │
│  ├── Morgan / Request Logger (Method, URL, Status, Latency)                                             │
│  └── Zod Schema Validator (Body, Query, Params)                                                         │
└────────────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                                     │
                         ┌───────────────────────────┼───────────────────────────┐
                         ▼                           ▼                           ▼
                ┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
                │  UserController  │        │ ProjectController│        │  TaskController  │
                └────────┬─────────┘        └────────┬─────────┘        └────────┬─────────┘
                         │                           │                           │
                         ▼                           ▼                           ▼
                ┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
                │   UserService    │        │  ProjectService  │        │   TaskService    │
                └────────┬─────────┘        └────────┬─────────┘        └────────┬─────────┘
                         │                           │                           │
                         └───────────────────────────┼───────────────────────────┘
                                                     │
                                                     ▼
                                   ┌──────────────────────────────────┐
                                   │     In-Memory Database Store     │
                                   │  (Map-based thread-safe storage  │
                                   │   with pre-seeded DevPulse data) │
                                   └──────────────────────────────────┘
```

---

## 🌟 Key Features of Users, Projects & Tasks API

### 1. 👥 Users API (`/api/v1/users`)
- **Directory & Pagination**: Paginated listing (`?page=1&limit=20`) with total count, total pages, and navigation metadata.
- **Fuzzy Search & Filters**: Search across `name` and `email` (`?search=term`), filter by `role` and `status` (`Active`, `Away`, `Offline`).
- **User Registration (`POST`)**: Strict email format and uniqueness validation with `409 Conflict` duplicate prevention.
- **Granular Updates**: Full document updates (`PUT /:id`) and partial field patches (`PATCH /:id`).
- **Relational Lookups**:
  - `GET /:id/tasks` — Retrieve all sprint tasks assigned to the user.
  - `GET /:id/projects` — Retrieve all initiatives where the user is the project lead.
- **Safe Deletion (`DELETE /:id`)**: Clean entity removal with 404 validation.

### 2. 🗂️ Projects API (`/api/v1/projects`)
- **Category & Health Filtering**: Filter by category (`Core Infrastructure`, `Frontend & Design Systems`, `Security & Identity`, `DevOps & Observability`, `AI & Machine Learning`), lifecycle status (`Planning`, `Active`, `In Progress`, `Completed`, `Paused`), and health (`On Track`, `At Risk`, `Delayed`).
- **Initiative Creation (`POST`)**: Unique project key validation (e.g. `ENG-01`, `SEC-12`), budget, tags, lead assignment, and due date validation.
- **Dynamic Real-Time Progress**: `GET /:id` automatically returns live computed `progress` (0–100%) and `taskCount` based on child tasks.
- **Project Summary & Metrics (`GET /:id/summary`)**: Aggregates status distribution (`Todo`, `In Progress`, `In Review`, `Done`), story points, and estimated vs. actual logged hours.
- **Cascade Deletion (`DELETE /:id?cascade=true`)**: Optional cascade deletion of all associated child sprint tasks.

### 3. 📋 Tasks API (`/api/v1/tasks`)
- **Sprint Backlog Multi-Filtering**: Query tasks filtered by `projectId`, `status`, `priority` (`Low`, `Medium`, `High`, `Critical`), `assigneeId`, or keyword search.
- **Auto-Syncing Project Progress**: Creating, deleting, or status-shifting a task automatically recalculates the parent project's completion ratio.
- **Kanban Status Transitions (`PATCH /:id/status`)**: Ultra-fast endpoint for column transitions (`Todo` ➔ `In Progress` ➔ `In Review` ➔ `Done`).
- **Atomic Batch Reorder (`POST /tasks/reorder`)**: Reorder tasks and update column positions in a single atomic request.
- **Story Points & Time Tracking**: Tracks story point weights (`1`, `2`, `3`, `5`, `8`, `13`), estimated hours, actual hours, and due dates.

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

### 4. 🩺 System Telemetry & Documentation Endpoints
| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Process memory (`rss`, `heapTotal`, `heapUsed`), uptime, and version | `200` |
| `GET` | `/api-docs` | Interactive Swagger UI API playground | `200` |
| `GET` | `/api/v1/docs/openapi.json` | Raw OpenAPI 3.0 specification JSON | `200` |
| `GET` | `/api/v1/docs/postman` | Exportable Postman Collection v2.1 | `200` |

---

## 🛡️ Centralized Error Handling Model

All errors follow a unified JSON schema:

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

## ✨ Frontend Dashboard Features

1. **Initiative & Work Management**:
   - Categorized by Core Engine, Frontend, Security, DevOps/SRE, and AI/ML.
   - Real-time progress bars, health badges, lead avatars, and due date countdowns.
2. **Interactive 4-Column Kanban Board**:
   - Smooth status cycling (*Todo*, *In Progress*, *In Review*, *Done*).
   - Priority indicators (Critical, High, Medium, Low) and story point badges.
3. **Analytics & Sprint Burndown**:
   - 4 live KPI cards with SVG sparklines (Velocity, PRs Merged, Quality, Deployments).
   - Interactive SVG Sprint Burndown trajectory with ideal burn curve.
4. **DevOps & Infrastructure Telemetry**:
   - Real-time CI/CD workflow monitor across Staging, Production, and Preview.
   - Interactive build triggers with animated timers and toast updates.
   - Cluster health indicators (p99 latency, uptime %, and fault state simulation).
5. **Universal DevPulse AI Copilot**:
   - Context-aware assistant inspecting live sprint blockers and infrastructure telemetry.
   - Multi-persona selector (Architect, Scrum, Debugger, DevOps).
   - Direct actionable chips in chat to trigger builds and switch tabs.
6. **Command Palette (`⌘K` / `Ctrl+K`)**:
   - Quick search and instant navigation across initiatives, tasks, and system actions.

---

## 🧪 Test Suite Results (100% Pass Rate)

```bash
✔ Centralized Error Handling & Input Validation (4/4 tests passed)
✔ Projects API Endpoints (7/7 tests passed)
✔ Tasks API Endpoints (6/6 tests passed)
✔ Users API Endpoints (9/9 tests passed)

Total: 26 passing | 0 failing | 100% Success Rate
```

---

## 🚀 Commands & Quick Start

```bash
# Start Next.js Frontend Dashboard (Port 3000)
npm run dev

# Start Backend REST API with Hot-Reload (Port 4000)
npm run server:dev

# Run Backend Automated Integration Tests
npm run server:test

# Build TypeScript Production Server Bundle
npm run server:build

# Build Next.js Frontend for Production
npm run build
```
