# ⚡ DevPulse — Enterprise Developer Productivity Dashboard & AI Copilot

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.18-magenta?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

> A production-grade, highly interactive **Developer Productivity Suite** inspired by Linear and Vercel dark aesthetics. Features real-time state persistence, interactive Kanban board, SVG sprint burndown analytics, live CI/CD pipeline monitoring, microservices telemetry, and a built-in context-aware AI Copilot assistant.

---

## 📸 Dashboard Overview & Previews

```
+----------------------------------------------------------------------------------------------------+
|  [⚡ DevPulse]   [ ⌘K Search projects, tasks, CI/CD... ]             [Simulate Load] [🔔 3] [Alex 🟢] |
+----------------------------------------------------------------------------------------------------+
|  CATEGORIES: [Work Management: Overview | Kanban]  [DevOps: CI/CD | Infra]  [Resources: Team]      |
+----------------------------------------------------------------------------------------------------+
|  SPRINT #39 • IN PROGRESS                                                    Sprint Delivery: 84%   |
|  Good morning, Alex. 5 active initiatives and 8 remaining backlog tasks.      Resolved: 42/50 pts   |
+----------------------------------------------------------------------------------------------------+
|  [ Sprint Velocity: 42 pts ↗ ]  [ PRs Merged: 64 ↗ ]  [ Quality: 89.4% ↗ ]  [ Deployments: 18 ↘ ]  |
+----------------------------------------------------------------------------------------------------+
|  📈 SPRINT BURNDOWN & VELOCITY (Interactive SVG Chart: Ideal Burn vs Actual Trajectory)            |
+----------------------------------------------------------------------------------------------------+
|  🗂️ ACTIVE INITIATIVES (Categorized: Core Engine | Frontend | Security | DevOps/SRE | AI/ML)       |
|  • [ENG-01] Nebula Core Engine (74%)           • [DES-04] Starlight Design System (88%)            |
|  • [SEC-12] Quantum Auth & IAM (35%)           • [OPS-08] Telemetry & APM Pipeline (52%)           |
+----------------------------------------------------------------------------------------------------+
|  📋 SPRINT BACKLOG & TASK BOARD (Inline status cycle, priority badges, estimate tags, assignees)    |
+----------------------------------------------------------------------------------------------------+
|  🤖 [DevPulse AI Copilot] (Bottom-Left Floating Assistant • Context-Aware • Code Generator)        |
+----------------------------------------------------------------------------------------------------+
```

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) | Server & Client Components, modern routing, and static prerendering |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) | Strict type checking, interfaces, and union status types |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Custom dark theme tokens, glassmorphism, and responsive breakpoints |
| **Animations** | [Framer Motion 11.18](https://www.framer.com/motion/) | Smooth layout shifts, spring modals, and notification popovers |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible SVG iconography |
| **State & Persistence** | React Context + `localStorage` | Instant client reactivity with automatic offline fallback |
| **Deployment** | [Vercel](https://vercel.com/) | Zero-downtime global edge deployment |

---

## ✨ Features by Category

### 1. 🗂️ Work Management & Initiatives
- **Domain Category Grouping:** Organize projects by *Core Infrastructure*, *Frontend & Design Systems*, *Security & Identity*, *DevOps & Observability*, and *AI & Machine Learning*.
- **Project Cards:** Real-time completion progress bar, health tags (`On Track`, `At Risk`, `Delayed`), engineering lead avatars, and due dates.
- **Interactive 4-Column Kanban Board:** Full workflow stages (*Todo*, *In Progress*, *In Review*, *Done*) with fast single-click column transitions.
- **Create Project & Task Modals:** Accessible dialogs with form validation, key auto-generation (e.g. `HYP-01`), and assignee pickers.

### 2. 📈 Analytics & Live Metrics
- **4 Real-Time KPI Cards:** Sprint Velocity, Pull Requests Merged, Task Completion Rate, and Active Deployments with custom SVG sparkline graphs.
- **Interactive Sprint Burndown Chart:** SVG chart comparing Ideal Burn trajectory against Actual Story Point resolution with hover tooltips.

### 3. 🚀 DevOps & CI/CD Telemetry
- **Live Pipeline Monitor:** Real-time workflow runs across *Staging*, *Production*, and *Preview* with branch metadata and commit SHAs.
- **Interactive Workflow Triggers:** Trigger live deployment builds with animated status timers and toast notifications.
- **Microservice Infrastructure Health:** p99 Latency (ms), Uptime %, error rates, and cluster load capacity bars with interactive health state simulation (*Healthy*, *Degraded*, *Incident*).

### 4. 👥 Engineering Resources & Capacity
- **Team Workload Matrix:** Engineer bandwidth utilization percentages, active task focus indicators, and delivery statistics.
- **User Work Status Switcher:** Toggle status between *Focus Mode*, *Online*, *In Code Review*, and *Offline*.

### 5. 🤖 Universal DevPulse AI Copilot
- **Context-Aware Engineering Intelligence:** Inspects live workspace state to answer questions about sprint blockers, latency spikes, and urgent tasks.
- **Full-Stack Knowledge Engine:** Answers questions on Next.js, React, Rust, Go, SQL, Kubernetes, pgvector, Raft consensus, and system design.
- **Persona Switcher:** Switch between *All-Round*, *System Architect*, *Code & Debug*, *DevOps/SRE*, and *Sprint Scrum*.
- **In-Chat Executable Actions:** Interactive action chips to trigger pipelines, switch tabs, or filter tickets directly from chat.
- **Copyable Code Snippets:** Formatted syntax blocks with copy confirmation feedback.

### 6. ⌨️ Global Command Palette (`⌘K` / `Ctrl+K`)
- Full keyboard navigation (`↑` `↓` `↵` `ESC`) to search initiatives, jump to views, trigger builds, and simulate loading states.

### 7. 🔔 Notifications & Feedback
- Glassmorphic **Toast Notification System** for all actions.
- Real-time **Notification Popover** with unread count badge and type filters (*commits, PRs, alerts, mentions*).
- Shimmering **Skeleton Loaders** previewable with one-click **"Simulate Load"** button.

---

## 📁 Repository Structure

```
developer-dashboard/
├── .env.example                               # Environment variable documentation
├── .gitignore                                 # Git exclusions
├── package.json                               # Dependencies & scripts
├── tsconfig.json                              # TypeScript configuration
├── tailwind.config.ts                         # Tailwind CSS tokens & dark theme
├── next.config.mjs                            # Next.js configuration
├── vercel.json                                # Vercel deployment configuration
├── src/
│   ├── app/
│   │   ├── globals.css                        # Dark design tokens & scrollbars
│   │   ├── layout.tsx                         # Root layout with Inter font & provider
│   │   └── page.tsx                           # Master dashboard page with dynamic tabs
│   ├── types/
│   │   └── index.ts                           # Strict TypeScript interfaces
│   ├── data/
│   │   └── mock-data.ts                       # Realistic seed fixtures & telemetry data
│   ├── context/
│   │   └── dashboard-context.tsx              # React Context with localStorage persistence
│   ├── lib/
│   │   └── utils.ts                           # Tailwind class merge & date utilities
│   └── components/
│       ├── ui/
│       │   ├── button.tsx                     # Framer Motion multi-variant button
│       │   ├── badge.tsx                      # Status, priority & health badges
│       │   ├── progress-bar.tsx               # Glowing gradient progress bar
│       │   ├── modal.tsx                      # Accessible dialog with blur backdrop
│       │   ├── skeleton.tsx                   # Shimmering loader components
│       │   └── toast-container.tsx            # Floating glassmorphic toast stack
│       ├── layout/
│       │   └── navbar.tsx                     # Header with categorized navigation tabs
│       ├── notifications/
│       │   └── notification-dropdown.tsx      # Popover with unread counter
│       └── dashboard/
│           ├── stats-overview.tsx             # Live metric cards with sparklines
│           ├── burndown-chart.tsx             # Interactive SVG burndown analytics
│           ├── project-grid.tsx               # Category-ordered project grid
│           ├── project-card.tsx               # Interactive project card
│           ├── task-board.tsx                 # Sprint backlog list view
│           ├── task-card.tsx                  # Task item with inline status selector
│           ├── kanban-board.tsx               # 4-column drag/shift Kanban board
│           ├── pipeline-monitor.tsx           # Real-time CI/CD workflow runs
│           ├── service-health.tsx             # Infrastructure latency & telemetry
│           ├── team-workload.tsx              # Engineer bandwidth & focus matrix
│           ├── command-palette.tsx            # Keyboard-navigable ⌘K command menu
│           ├── ai-copilot.tsx                 # Full-stack AI Copilot assistant
│           ├── create-project-modal.tsx       # Project creation form
│           ├── create-task-modal.tsx          # Task creation form
│           └── empty-state.tsx                # Contextual empty state illustrations
```

---

## ⚙️ Installation & Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18.18+ or v20+
- `npm` (v9+) or `yarn` / `pnpm`

### 1. Clone the Repository
```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/developer-dashboard.git
cd developer-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🔑 Environment Variables (`.env.example`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_NAME` | Name displayed across the workspace | `DevPulse Engineering Workspace` |
| `NEXT_PUBLIC_APP_URL` | Base application URL | `http://localhost:3000` |
| `NODE_ENV` | Application environment mode | `development` / `production` |
| `OPENAI_API_KEY` | *(Optional)* OpenAI API key for external LLM calls | `your_openai_api_key_here` |
| `AI_MODEL_NAME` | *(Optional)* Model identifier for AI Copilot | `gpt-4o` |
| `GITHUB_WEBHOOK_SECRET` | *(Optional)* Secret token for CI/CD webhooks | `your_webhook_secret_here` |

---

## 🚀 Deployment to Vercel

### Option 1: Via Vercel CLI
```bash
npx vercel
npx vercel --prod
```

### Option 2: Via GitHub Integration
1. Push this repository to your GitHub account:
```bash
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
git branch -M main
git push -u origin main
```
2. Import the project on [Vercel](https://vercel.com/new).
3. Click **Deploy** (Next.js is automatically configured with zero setup).

---

## 📄 License
This project is licensed under the MIT License.
