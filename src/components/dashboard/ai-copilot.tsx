"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Play,
  ArrowRight,
  Terminal,
  Server,
  CheckSquare,
  Flame,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Cpu,
  ShieldCheck,
  Zap,
  Copy,
  Check,
} from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { ChatMessage, ChatAction } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CopilotMode = "all" | "architect" | "coder" | "devops" | "scrum";

const INITIAL_AI_MESSAGES: ChatMessage[] = [
  {
    id: "msg-welcome",
    sender: "assistant",
    text: "Hello Alex! I am **DevPulse AI Copilot**, your full-stack engineering assistant. I can answer **any technical question**, write & debug code, analyze system architecture, or triage your sprint dashboard metrics and CI/CD pipelines.\n\nAsk me anything or select a prompt below!",
    timestamp: "Just now",
    actions: [
      { label: "Summarize Sprint #39 Health", actionType: "navigate_tab", payload: "overview" },
      { label: "Inspect Latency Alerts", actionType: "navigate_tab", payload: "infrastructure" },
      { label: "Trigger Production CI/CD", actionType: "trigger_pipeline", payload: "Production Zero-Downtime Rollout" },
    ],
  },
];

export function AICopilot() {
  const {
    projects,
    tasks,
    pipelines,
    services,
    teamMembers,
    setActiveTab,
    triggerPipeline,
    setTaskFilter,
    showToast,
  } = useDashboard();

  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeMode, setActiveMode] = useState<CopilotMode>("all");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_AI_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    showToast("Copied to Clipboard", "Code snippet copied successfully", "success");
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleExecuteAction = (action: ChatAction) => {
    switch (action.actionType) {
      case "navigate_tab":
        setActiveTab(action.payload);
        showToast("Navigation", `Switched to ${action.payload} view`, "info");
        break;
      case "trigger_pipeline":
        triggerPipeline(action.payload, "production");
        break;
      case "filter_status":
        setTaskFilter(action.payload);
        setActiveTab("kanban");
        break;
      case "simulate_load":
        showToast("Simulation", "Simulating system latency test", "info");
        break;
      default:
        break;
    }
  };

  // Comprehensive AI Knowledge Engine
  const generateResponse = (userPrompt: string): { text: string; actions?: ChatAction[]; codeSnippet?: string } => {
    const q = userPrompt.toLowerCase().trim();

    // 1. Next.js / React / Frontend questions
    if (q.includes("next.js") || q.includes("nextjs") || q.includes("react") || q.includes("app router") || q.includes("server component") || q.includes("tailwind") || q.includes("hook")) {
      if (q.includes("server component") || q.includes("rsc") || q.includes("client")) {
        return {
          text: `### ⚛️ Next.js App Router: Server vs Client Components\n\n` +
            `In Next.js 14/15, all components inside \`src/app\` are **Server Components by default**.\n\n` +
            `**Key Rules:**\n` +
            `1. **Server Components:** Render on the server, zero client bundle cost, direct access to databases & backend secrets.\n` +
            `2. **Client Components (\`'use client'\`):** Required when using React hooks (\`useState\`, \`useEffect\`, \`useContext\`), browser APIs, or event handlers (\`onClick\`, \`onChange\`).\n\n` +
            `*Best Practice:* Keep Client Components at the leaves of your component tree to maximize performance and minimize bundle hydration overhead.`,
          codeSnippet: `// Example: Composing Server & Client Components\n// ServerComponent.tsx (Default - runs on server)\nimport { ClientInteractiveWidget } from './ClientWidget';\n\nexport async function ProjectOverview({ id }: { id: string }) {\n  const project = await db.project.findUnique({ where: { id } });\n  return (\n    <div className="p-6 bg-zinc-900 rounded-xl">\n      <h1 className="text-xl font-bold">{project.name}</h1>\n      <ClientInteractiveWidget initialData={project} />\n    </div>\n  );\n}`,
        };
      }

      return {
        text: `### ⚡ Modern Next.js 15 & React Optimization\n\n` +
          `• **Turbopack Build Acceleration:** Fast hot module reloading and tree shaking.\n` +
          `• **Partial Prerendering (PPR):** Combines static shell caching with dynamic streaming slots.\n` +
          `• **Server Actions:** Perform mutations without creating separate API endpoints.\n` +
          `• **Tailwind CSS & Framer Motion:** Fluid UI animations paired with utility design tokens.`,
        codeSnippet: `// Example: Next.js Server Action with Revalidation\n'use server';\nimport { revalidatePath } from 'next/cache';\n\nexport async function updateTaskStatus(taskId: string, status: string) {\n  await db.task.update({ where: { id: taskId }, data: { status } });\n  revalidatePath('/dashboard');\n  return { success: true };\n}`,
      };
    }

    // 2. Rust / Go / Backend / Distributed Systems
    if (q.includes("rust") || q.includes("raft") || q.includes("grpc") || q.includes("go") || q.includes("golang") || q.includes("kafka") || q.includes("distributed")) {
      return {
        text: `### 🦀 Distributed Systems & Raft Consensus Pattern\n\n` +
          `The **Raft Consensus Protocol** manages replicated state machines across distributed nodes by electing a distinguished leader, replicating log entries, and applying committed changes.\n\n` +
          `**Key Invariants:**\n` +
          `• **Election Safety:** At most one leader elected per term.\n` +
          `• **Leader Append-Only:** A leader never overwrites or truncates its log entries.\n` +
          `• **Log Matching:** If two logs contain an entry with identical index and term, then logs are identical in all entries up through the given index.\n` +
          `• **Log Compaction:** Snapshots truncate applied state to prevent unbounded memory growth.`,
        codeSnippet: `// Rust: Tokio gRPC Streaming Worker Pattern\nuse tokio::sync::mpsc;\nuse tonic::{Request, Response, Status};\n\npub struct StateEngineService;\n\n#[tonic::async_trait]\nimpl RaftService for StateEngineService {\n    async fn append_entries(&self, request: Request<AppendRequest>) -> Result<Response<AppendResponse>, Status> {\n        let req = request.into_inner();\n        // Validate term and commit index\n        Ok(Response::new(AppendResponse { term: req.term, success: true }))\n    }\n}`,
        actions: [
          { label: "View Nebula Core Engine (ENG-01)", actionType: "navigate_tab", payload: "overview" },
        ],
      };
    }

    // 3. Database / SQL / pgvector / Redis / Caching
    if (q.includes("database") || q.includes("sql") || q.includes("pgvector") || q.includes("redis") || q.includes("cache") || q.includes("postgres") || q.includes("indexing")) {
      return {
        text: `### 🗄️ Database & Semantic Vector Search Architecture\n\n` +
          `When scaling hybrid text and vector search on **PostgreSQL with pgvector**:\n\n` +
          `1. **HNSW (Hierarchical Navigable Small World) Indexing:** Outperforms IVFFlat for high-cardinality recall (>99%) with sub-10ms query times.\n` +
          `2. **L2 Multi-Tier Caching with Redis:** Cache computed cosine distance queries with an LRU policy to reduce database CPU spikes by up to 75%.\n` +
          `3. **Connection Pooling:** Use PgBouncer or Envoy poolers to maintain stable connections under spike traffic.`,
        codeSnippet: `-- pgvector HNSW Index Creation\nCREATE EXTENSION IF NOT EXISTS vector;\n\nCREATE TABLE document_embeddings (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  document_id TEXT NOT NULL,\n  embedding vector(1536),\n  metadata JSONB,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Create fast HNSW Cosine Distance Index\nCREATE INDEX ON document_embeddings \nUSING hnsw (embedding vector_cosine_ops) \nWITH (m = 16, ef_construction = 64);`,
        actions: [
          { label: "Inspect Vector DB Health", actionType: "navigate_tab", payload: "infrastructure" },
        ],
      };
    }

    // 4. Docker / Kubernetes / DevOps / CI/CD
    if (q.includes("docker") || q.includes("k8s") || q.includes("kubernetes") || q.includes("ci/cd") || q.includes("pipeline") || q.includes("deploy") || q.includes("helm")) {
      const failed = pipelines.filter((p) => p.status === "failed");
      return {
        text: `### 🚢 Kubernetes & CI/CD Deployment Strategy\n\n` +
          `**Zero-Downtime Rolling Updates on K8s:**\n` +
          `• **Readiness & Liveness Probes:** Prevent traffic routing to unready pods.\n` +
          `• **RollingUpdate Strategy:** Configured with \`maxSurge: 25%\` and \`maxUnavailable: 0\`.\n` +
          `• **Graceful Shutdown:** Handle SIGTERM signals with connection draining in Envoy.\n\n` +
          (failed.length > 0 ? `⚠️ *Current alert:* Pipeline \`${failed[0].workflow}\` failed recently due to test timeouts.` : `✅ All CI/CD pipelines are operational.`),
        codeSnippet: `# Kubernetes Zero-Downtime Deployment Spec\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: core-engine-pod\nspec:\n  replicas: 4\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 1\n      maxUnavailable: 0\n  template:\n    spec:\n      containers:\n      - name: app\n        image: devpulse/engine:v2.14.0\n        readinessProbe:\n          httpGet:\n            path: /healthz\n            port: 8080\n          initialDelaySeconds: 5\n          periodSeconds: 10`,
        actions: [
          { label: "Trigger Production Rollout", actionType: "trigger_pipeline", payload: "Production Zero-Downtime Rollout" },
          { label: "View Pipelines Tab", actionType: "navigate_tab", payload: "pipelines" },
        ],
      };
    }

    // 5. System Design / Architecture
    if (q.includes("system design") || q.includes("architecture") || q.includes("cqrs") || q.includes("microservice") || q.includes("scale") || q.includes("rate limit")) {
      return {
        text: `### 🏛️ High-Scale Microservices Architecture Patterns\n\n` +
          `**Key Architectural Pillars for Enterprise Productivity Suites:**\n` +
          `1. **CQRS (Command Query Responsibility Segregation):** Separate read projections (ClickHouse / Elasticsearch) from transactional write logs (PostgreSQL).\n` +
          `2. **Distributed Tracing (OpenTelemetry):** Trace RPC lifecycles from API Gateway through background worker queues with unique \`trace_id\` propagation.\n` +
          `3. **Token Bucket Rate Limiting:** Enforce per-tenant throughput limits in Envoy before requests hit compute pods.\n` +
          `4. **Idempotency Keys:** Ensure network retry safety for all mutations.`,
        codeSnippet: `// Rate Limiter: Redis Token Bucket Implementation\nexport async function checkRateLimit(userId: string, limit = 100, windowSec = 60) {\n  const key = \`rate_limit:\${userId}\`;\n  const current = await redis.incr(key);\n  if (current === 1) {\n    await redis.expire(key, windowSec);\n  }\n  return current <= limit;\n}`,
      };
    }

    // 6. Security / Auth / WebAuthn / IAM
    if (q.includes("security") || q.includes("auth") || q.includes("webauthn") || q.includes("jwt") || q.includes("iam") || q.includes("oauth") || q.includes("passkey")) {
      return {
        text: `### 🔐 WebAuthn Passkeys & Zero-Trust Authentication\n\n` +
          `**FIDO2 / WebAuthn Authentication Flow:**\n` +
          `1. **Ceremony Initialization:** Server generates cryptographically random challenge and passes allowed credentials.\n` +
          `2. **Biometric Assertion:** User authenticates via TouchID/FaceID on device enclave.\n` +
          `3. **Signature Verification:** Server verifies the signature using the user's registered public key and checks counter replay protection.\n\n` +
          `*Project Status:* Initiative **Quantum Auth & IAM (SEC-12)** is currently in progress under Marcus Vance.`,
        codeSnippet: `// WebAuthn Passkey Registration Ceremony (Client)\nimport { create } from '@github/webauthn-json';\n\nexport async function registerPasskey(optionsFromServer: any) {\n  const credential = await create(optionsFromServer);\n  const verification = await fetch('/api/auth/register-verify', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(credential)\n  });\n  return verification.json();\n}`,
        actions: [
          { label: "View Quantum Auth Initiative", actionType: "navigate_tab", payload: "overview" },
        ],
      };
    }

    // 7. Sprint & Dashboard specific checks
    if (q.includes("blocker") || q.includes("delayed") || q.includes("health") || q.includes("risk") || q.includes("sprint")) {
      const delayed = projects.filter((p) => p.health === "Delayed" || p.health === "At Risk");
      return {
        text: `### 📊 Sprint #39 Health & Triage\n\n` +
          `• **Velocity Rate:** 89.4% completion rate\n` +
          `• **Total Story Points:** 42 of 50 resolved\n` +
          `• **At-Risk Initiatives (${delayed.length}):**\n` +
          delayed.map((d) => `  - **${d.name} (${d.key})**: Status \`${d.status}\`, Progress \`${d.progress}%\`, Due ${d.dueDate}`).join("\n") +
          `\n\n*Actionable recommendation:* Re-allocate 1 SRE engineer from completed tasks to assist Devon with the APM pipeline.`,
        actions: [
          { label: "View Overview Dashboard", actionType: "navigate_tab", payload: "overview" },
          { label: "Check Team Workloads", actionType: "navigate_tab", payload: "team" },
        ],
      };
    }

    if (q.includes("task") || q.includes("backlog") || q.includes("urgent")) {
      const urgent = tasks.filter((t) => t.priority === "Urgent");
      return {
        text: `### 📋 Urgent Backlog Tickets\n\n` +
          `Found **${urgent.length} urgent tasks** requiring immediate turnaround:\n\n` +
          urgent.map((t) => `• **${t.title}**\n  Assignee: ${t.assignee.name} | Estimate: ${t.estimateHours}h | Status: \`${t.status}\``).join("\n\n"),
        actions: [
          { label: "Open Kanban Board", actionType: "navigate_tab", payload: "kanban" },
        ],
      };
    }

    if (q.includes("team") || q.includes("who") || q.includes("capacity")) {
      return {
        text: `### 👥 Engineering Capacity Overview\n\n` +
          teamMembers.map((m) => `• **${m.name}** (${m.role}): **${m.bandwidthUsage}% capacity** | Status: *${m.status}* | Focus: _"${m.currentTaskTitle || "Sprint reviews"}"_`).join("\n") +
          `\n\nAverage sprint capacity is healthy at **78%**.`,
        actions: [
          { label: "View Team Matrix", actionType: "navigate_tab", payload: "team" },
        ],
      };
    }

    // Default Comprehensive Developer Answer
    return {
      text: `### 💡 Engineering Copilot Analysis\n\n` +
        `Regarding: "*${userPrompt}*"\n\n` +
        `Here is the architectural and operational breakdown:\n\n` +
        `1. **Implementation Pattern:** Ensure loose coupling, strong typing with TypeScript, and deterministic state mutations.\n` +
        `2. **Performance & Reliability:** Keep p99 response times under 20ms using distributed caching and edge optimization.\n` +
        `3. **Current Environment Context:** Workspace has **${projects.length} active initiatives** and **${tasks.length} sprint tasks** with 99.98% infrastructure uptime.\n\n` +
        `Let me know if you would like me to generate a specific implementation, write unit tests, or run CI/CD diagnostics!`,
      codeSnippet: `// Quick snippet utility\nexport function calculateThroughput(completedPoints: number, totalPoints: number): number {\n  if (totalPoints === 0) return 0;\n  return Math.round((completedPoints / totalPoints) * 100);\n}`,
      actions: [
        { label: "View Kanban Board", actionType: "navigate_tab", payload: "kanban" },
        { label: "Inspect Infrastructure", actionType: "navigate_tab", payload: "infrastructure" },
      ],
    };
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    setInputValue("");

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const responseData = generateResponse(userText);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "assistant",
        text: responseData.text,
        timestamp: "Just now",
        actions: responseData.actions,
        codeSnippet: responseData.codeSnippet,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 550);
  };

  const clearChat = () => {
    setMessages(INITIAL_AI_MESSAGES);
    showToast("Chat Cleared", "Conversation reset to initial state", "info");
  };

  const quickPromptsByMode = {
    all: [
      "Summarize delayed initiatives",
      "Explain Next.js Server Components vs Client Components",
      "Which services have high latency?",
      "Show urgent backlog tasks",
    ],
    architect: [
      "Explain Raft Consensus protocol and log compaction",
      "Best practices for pgvector HNSW indexing",
      "CQRS vs Event Sourcing architecture pattern",
    ],
    coder: [
      "Show Next.js Server Action with revalidation",
      "Write Redis Token Bucket rate limiter in TypeScript",
      "How to implement WebAuthn FIDO2 ceremony",
    ],
    devops: [
      "Kubernetes zero-downtime rolling update deployment spec",
      "Trigger Production Rollout CI/CD pipeline",
      "Inspect pgvector high latency alerts",
    ],
    scrum: [
      "Sprint #39 burndown velocity summary",
      "Engineering team capacity allocation",
      "Show urgent backlog tickets",
    ],
  };

  return (
    <>
      {/* Floating Copilot Launcher Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle DevPulse AI Copilot"
          className={cn(
            "relative flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 border text-xs font-semibold select-none",
            isOpen
              ? "bg-indigo-600 text-white border-indigo-400/40 shadow-[0_0_25px_rgba(99,102,241,0.5)]"
              : "bg-zinc-900/90 hover:bg-zinc-850 text-zinc-100 border-zinc-750 backdrop-blur-xl hover:border-indigo-500/50 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          )}
        >
          <div className="relative">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          </div>
          <span>DevPulse AI Copilot</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
            GPT-4o
          </span>
        </motion.button>
      </div>

      {/* Copilot Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ type: "spring", damping: 26, stiffness: 340 }}
            className={cn(
              "fixed z-50 flex flex-col bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 shadow-2xl rounded-2xl overflow-hidden transition-all duration-200",
              isMaximized
                ? "inset-4 sm:inset-10"
                : "bottom-20 left-6 w-[92vw] sm:w-[500px] h-[620px] max-h-[85vh]"
            )}
          >
            {/* Top Header Bar */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/80 bg-zinc-900/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-white tracking-tight">DevPulse AI Copilot</h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-zinc-400">Full-Stack Intelligence & Architecture Copilot</p>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1 text-zinc-400">
                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMaximized(!isMaximized)}
                  title={isMaximized ? "Restore window" : "Maximize window"}
                  className="p-1.5 rounded-lg hover:text-zinc-200 hover:bg-zinc-800 transition-colors hidden sm:inline-flex"
                >
                  {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close Copilot"
                  className="p-1.5 rounded-lg hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Persona Modes Bar */}
            <div className="px-4 py-2 border-b border-zinc-850/80 bg-zinc-950/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              {(
                [
                  { id: "all", label: "All-Round", icon: <Bot className="w-3 h-3" /> },
                  { id: "architect", label: "System Architect", icon: <Layers className="w-3 h-3" /> },
                  { id: "coder", label: "Code & Debug", icon: <Code2 className="w-3 h-3" /> },
                  { id: "devops", label: "DevOps & SRE", icon: <Server className="w-3 h-3" /> },
                  { id: "scrum", label: "Sprint Scrum", icon: <Flame className="w-3 h-3" /> },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActiveMode(mode.id)}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap",
                    activeMode === mode.id
                      ? "bg-indigo-600/30 text-indigo-200 border border-indigo-500/40"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  )}
                >
                  {mode.icon}
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 border-b border-zinc-850/80 bg-zinc-950/50 overflow-x-auto flex items-center gap-1.5">
              <span className="text-[10px] text-zinc-500 shrink-0 uppercase font-mono">Suggested:</span>
              {quickPromptsByMode[activeMode].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setInputValue(prompt);
                    setTimeout(() => handleSendMessage(), 50);
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Message History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={cn("flex flex-col", isUser ? "items-end" : "items-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed",
                        isUser
                          ? "bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20"
                          : "bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-bl-none shadow-sm"
                      )}
                    >
                      <div className="whitespace-pre-wrap font-sans space-y-1.5 leading-relaxed">
                        {msg.text}
                      </div>

                      {/* Code Snippet Box with Copy Button */}
                      {msg.codeSnippet && (
                        <div className="mt-3 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] font-mono text-zinc-400">
                            <span>Code Snippet</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(msg.id, msg.codeSnippet!)}
                              className="flex items-center gap-1 hover:text-white transition-colors"
                            >
                              {copiedCodeId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-3 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
                            <pre>{msg.codeSnippet}</pre>
                          </div>
                        </div>
                      )}

                      {/* Executable Action Chips */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
                          {msg.actions.map((act) => (
                            <button
                              key={act.label}
                              type="button"
                              onClick={() => handleExecuteAction(act)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-indigo-300 hover:text-white border border-zinc-750 text-[11px] font-medium transition-colors"
                            >
                              <span>{act.label}</span>
                              <ArrowRight className="w-3 h-3 text-indigo-400" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-zinc-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </motion.div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 w-24">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800/80 bg-zinc-900/60">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything: code, architecture, Next.js, sprint status, debugging..."
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
