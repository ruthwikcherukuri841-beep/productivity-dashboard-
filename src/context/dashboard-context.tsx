"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  Project,
  Task,
  NotificationItem,
  MetricStat,
  PipelineRun,
  Microservice,
  TeamMember,
  BurndownPoint,
  ToastMessage,
  DashboardTab,
  FilterStatus,
  CategoryFilter,
  TaskFilterStatus,
  TaskStatus,
  PriorityFilter,
  ServiceStatus,
} from "@/types";
import {
  INITIAL_METRICS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PIPELINES,
  INITIAL_SERVICES,
  TEAM_MEMBERS,
  BURNDOWN_DATA,
} from "@/data/mock-data";

interface DashboardContextType {
  // Navigation & Tabs
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Data state
  projects: Project[];
  tasks: Task[];
  notifications: NotificationItem[];
  metrics: MetricStat[];
  pipelines: PipelineRun[];
  services: Microservice[];
  teamMembers: TeamMember[];
  burndownData: BurndownPoint[];
  isLoading: boolean;

  // Toast Stack
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: "success" | "info" | "warning" | "error") => void;
  dismissToast: (id: string) => void;

  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  projectFilter: FilterStatus;
  setProjectFilter: (filter: FilterStatus) => void;
  categoryFilter: CategoryFilter;
  setCategoryFilter: (filter: CategoryFilter) => void;
  taskFilter: TaskFilterStatus;
  setTaskFilter: (filter: TaskFilterStatus) => void;
  priorityFilter: PriorityFilter;
  setPriorityFilter: (filter: PriorityFilter) => void;

  // Project Actions
  addProject: (project: Omit<Project, "id" | "progress" | "taskCount">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Task Actions
  addTask: (task: Omit<Task, "id">) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;

  // Pipeline Actions
  triggerPipeline: (workflowName: string, environment?: "production" | "staging" | "preview") => void;
  rerunPipeline: (id: string) => void;

  // Infrastructure Actions
  toggleServiceHealth: (id: string, status: ServiceStatus) => void;

  // Notification Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // UI / Demo Actions
  simulateLoading: (durationMs?: number) => void;
  resetToMockData: () => void;

  // Computed
  unreadNotificationCount: number;
  filteredProjects: Project[];
  filteredTasks: Task[];
}

const STORAGE_KEYS = {
  PROJECTS: "dev_dash_projects_v2",
  TASKS: "dev_dash_tasks_v2",
  NOTIFICATIONS: "dev_dash_notifications_v2",
  METRICS: "dev_dash_metrics_v2",
  PIPELINES: "dev_dash_pipelines_v2",
  SERVICES: "dev_dash_services_v2",
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [metrics, setMetrics] = useState<MetricStat[]>(INITIAL_METRICS);
  const [pipelines, setPipelines] = useState<PipelineRun[]>(INITIAL_PIPELINES);
  const [services, setServices] = useState<Microservice[]>(INITIAL_SERVICES);
  const [teamMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [burndownData] = useState<BurndownPoint[]>(BURNDOWN_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [projectFilter, setProjectFilter] = useState<FilterStatus>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [taskFilter, setTaskFilter] = useState<TaskFilterStatus>("All");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");

  // Show toast utility
  const showToast = useCallback(
    (title: string, message: string, type: "success" | "info" | "warning" | "error" = "info") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      const storedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const storedMetrics = localStorage.getItem(STORAGE_KEYS.METRICS);
      const storedPipelines = localStorage.getItem(STORAGE_KEYS.PIPELINES);
      const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);

      if (storedProjects) setProjects(JSON.parse(storedProjects));
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      if (storedMetrics) setMetrics(JSON.parse(storedMetrics));
      if (storedPipelines) setPipelines(JSON.parse(storedPipelines));
      if (storedServices) setServices(JSON.parse(storedServices));
    } catch (e) {
      console.warn("Failed to load dashboard state from localStorage", e);
    } finally {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Save helpers
  const saveProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newProjects));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const saveTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(newTasks));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const saveNotifications = useCallback((newNotifs: NotificationItem[]) => {
    setNotifications(newNotifs);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(newNotifs));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const savePipelines = useCallback((newPipelines: PipelineRun[]) => {
    setPipelines(newPipelines);
    try {
      localStorage.setItem(STORAGE_KEYS.PIPELINES, JSON.stringify(newPipelines));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const saveServices = useCallback((newServices: Microservice[]) => {
    setServices(newServices);
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(newServices));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Project Actions
  const addProject = useCallback(
    (newProjectData: Omit<Project, "id" | "progress" | "taskCount">) => {
      const newProject: Project = {
        ...newProjectData,
        id: `proj-${Date.now()}`,
        progress: 0,
        taskCount: {
          total: 0,
          completed: 0,
        },
      };

      const updated = [newProject, ...projects];
      saveProjects(updated);

      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: "Project created",
        description: `Project '${newProject.name}' (${newProject.key}) was created successfully.`,
        timestamp: new Date().toISOString(),
        read: false,
        type: "commit",
      };
      saveNotifications([notif, ...notifications]);

      showToast("Project Created", `Initiative '${newProject.name}' is now active.`, "success");
    },
    [projects, notifications, saveProjects, saveNotifications, showToast]
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      const updated = projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveProjects(updated);
      showToast("Project Updated", "Changes have been persisted.", "info");
    },
    [projects, saveProjects, showToast]
  );

  const deleteProject = useCallback(
    (id: string) => {
      const projectToDelete = projects.find((p) => p.id === id);
      const updated = projects.filter((p) => p.id !== id);
      const updatedTasks = tasks.filter((t) => t.projectId !== id);
      saveProjects(updated);
      saveTasks(updatedTasks);
      showToast(
        "Project Deleted",
        `Removed project ${projectToDelete?.key || id} and its tasks.`,
        "warning"
      );
    },
    [projects, tasks, saveProjects, saveTasks, showToast]
  );

  // Task Actions
  const addTask = useCallback(
    (newTaskData: Omit<Task, "id">) => {
      const newTask: Task = {
        ...newTaskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      const updatedTasks = [newTask, ...tasks];
      saveTasks(updatedTasks);

      // Recalculate parent project
      const projectTasks = updatedTasks.filter((t) => t.projectId === newTask.projectId);
      const completedTasks = projectTasks.filter((t) => t.status === "Done");
      const progress =
        projectTasks.length > 0
          ? Math.round((completedTasks.length / projectTasks.length) * 100)
          : 0;

      const updatedProjects = projects.map((p) => {
        if (p.id === newTask.projectId) {
          return {
            ...p,
            progress,
            taskCount: {
              total: projectTasks.length,
              completed: completedTasks.length,
            },
          };
        }
        return p;
      });
      saveProjects(updatedProjects);

      showToast("Task Created", `Assigned to ${newTask.assignee.name}`, "success");
    },
    [tasks, projects, saveTasks, saveProjects, showToast]
  );

  const updateTaskStatus = useCallback(
    (taskId: string, status: TaskStatus) => {
      let targetProjectId = "";
      let taskTitle = "";
      const updatedTasks = tasks.map((t) => {
        if (t.id === taskId) {
          targetProjectId = t.projectId;
          taskTitle = t.title;
          return { ...t, status };
        }
        return t;
      });

      saveTasks(updatedTasks);

      if (targetProjectId) {
        const projectTasks = updatedTasks.filter((t) => t.projectId === targetProjectId);
        const completedTasks = projectTasks.filter((t) => t.status === "Done");
        const progress =
          projectTasks.length > 0
            ? Math.round((completedTasks.length / projectTasks.length) * 100)
            : 0;

        const updatedProjects = projects.map((p) => {
          if (p.id === targetProjectId) {
            return {
              ...p,
              progress,
              taskCount: {
                total: projectTasks.length,
                completed: completedTasks.length,
              },
            };
          }
          return p;
        });
        saveProjects(updatedProjects);
      }

      showToast("Task Status Changed", `Moved to '${status}'`, "info");
    },
    [tasks, projects, saveTasks, saveProjects, showToast]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      const taskToDelete = tasks.find((t) => t.id === taskId);
      const updatedTasks = tasks.filter((t) => t.id !== taskId);
      saveTasks(updatedTasks);

      if (taskToDelete?.projectId) {
        const projectTasks = updatedTasks.filter((t) => t.projectId === taskToDelete.projectId);
        const completedTasks = projectTasks.filter((t) => t.status === "Done");
        const progress =
          projectTasks.length > 0
            ? Math.round((completedTasks.length / projectTasks.length) * 100)
            : 0;

        const updatedProjects = projects.map((p) => {
          if (p.id === taskToDelete.projectId) {
            return {
              ...p,
              progress,
              taskCount: {
                total: projectTasks.length,
                completed: completedTasks.length,
              },
            };
          }
          return p;
        });
        saveProjects(updatedProjects);
      }

      showToast("Task Removed", "Task deleted from backlog", "warning");
    },
    [tasks, projects, saveTasks, saveProjects, showToast]
  );

  // Pipeline Actions
  const triggerPipeline = useCallback(
    (workflowName: string, environment: "production" | "staging" | "preview" = "staging") => {
      const newRun: PipelineRun = {
        id: `run-${Date.now()}`,
        workflow: workflowName,
        branch: "main",
        commitSha: Math.random().toString(36).substring(2, 9),
        commitMsg: `chore(ci): automated trigger for ${workflowName}`,
        status: "running",
        duration: "0m 10s",
        triggeredBy: "Alex Rivera",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        timestamp: "Just now",
        environment,
      };

      const updated = [newRun, ...pipelines];
      savePipelines(updated);
      showToast("Workflow Triggered", `Running ${workflowName} on ${environment}`, "info");

      // Simulate completion after 5 seconds
      setTimeout(() => {
        setPipelines((curr) =>
          curr.map((p) =>
            p.id === newRun.id
              ? { ...p, status: "success", duration: "0m 48s", timestamp: "1 min ago" }
              : p
          )
        );
        showToast("Workflow Completed", `${workflowName} succeeded with 100% test pass.`, "success");
      }, 5000);
    },
    [pipelines, savePipelines, showToast]
  );

  const rerunPipeline = useCallback(
    (id: string) => {
      const updated = pipelines.map((p) =>
        p.id === id ? { ...p, status: "running" as const, duration: "0m 05s", timestamp: "Just now" } : p
      );
      savePipelines(updated);
      showToast("Re-running Pipeline", "Workflow queued on runner cluster", "info");

      setTimeout(() => {
        setPipelines((curr) =>
          curr.map((p) => (p.id === id ? { ...p, status: "success", duration: "1m 15s" } : p))
        );
        showToast("Pipeline Re-run Finished", "All checks passed successfully.", "success");
      }, 4000);
    },
    [pipelines, savePipelines, showToast]
  );

  // Microservices Actions
  const toggleServiceHealth = useCallback(
    (id: string, status: ServiceStatus) => {
      const updated = services.map((s) => (s.id === id ? { ...s, status } : s));
      saveServices(updated);
      showToast("Service Health Updated", `Status updated to ${status}`, "info");
    },
    [services, saveServices, showToast]
  );

  // Notifications Actions
  const markNotificationRead = useCallback(
    (id: string) => {
      const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveNotifications(updated);
    },
    [notifications, saveNotifications]
  );

  const markAllNotificationsRead = useCallback(() => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
    showToast("Notifications Cleared", "Marked all items as read", "info");
  }, [notifications, saveNotifications, showToast]);

  const clearNotifications = useCallback(() => {
    saveNotifications([]);
  }, [saveNotifications]);

  // Demo Actions
  const simulateLoading = useCallback((durationMs: number = 1500) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, durationMs);
  }, []);

  const resetToMockData = useCallback(() => {
    saveProjects(INITIAL_PROJECTS);
    saveTasks(INITIAL_TASKS);
    saveNotifications(INITIAL_NOTIFICATIONS);
    setMetrics(INITIAL_METRICS);
    savePipelines(INITIAL_PIPELINES);
    saveServices(INITIAL_SERVICES);
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(INITIAL_METRICS));
      localStorage.setItem(STORAGE_KEYS.PIPELINES, JSON.stringify(INITIAL_PIPELINES));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    } catch (e) {
      console.warn(e);
    }
    showToast("Data Reset", "Restored all default fixtures and mock states", "info");
  }, [saveProjects, saveTasks, saveNotifications, savePipelines, saveServices, showToast]);

  // Computed Values
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = projectFilter === "All" || project.status === projectFilter;
    const matchesCategory = categoryFilter === "All" || project.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = taskFilter === "All" || task.status === taskFilter;
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        projects,
        tasks,
        notifications,
        metrics,
        pipelines,
        services,
        teamMembers,
        burndownData,
        isLoading,
        toasts,
        showToast,
        dismissToast,
        searchQuery,
        setSearchQuery,
        projectFilter,
        setProjectFilter,
        categoryFilter,
        setCategoryFilter,
        taskFilter,
        setTaskFilter,
        priorityFilter,
        setPriorityFilter,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTaskStatus,
        deleteTask,
        triggerPipeline,
        rerunPipeline,
        toggleServiceHealth,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        simulateLoading,
        resetToMockData,
        unreadNotificationCount,
        filteredProjects,
        filteredTasks,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
