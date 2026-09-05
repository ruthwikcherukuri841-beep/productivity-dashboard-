import { z } from "zod";

export const ProjectCategoryEnum = z.enum([
  "Core Infrastructure",
  "Frontend & Design Systems",
  "Security & Identity",
  "DevOps & Observability",
  "AI & Machine Learning",
]);

export const ProjectStatusEnum = z.enum([
  "Active",
  "Planning",
  "Completed",
  "On Hold",
]);

export const ProjectHealthEnum = z.enum([
  "On Track",
  "At Risk",
  "Delayed",
]);

export const projectLeadSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Lead name must be at least 2 characters"),
  avatar: z.string().url("Lead avatar must be a valid URL"),
  role: z.string().optional(),
});

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters").max(100, "Project name cannot exceed 100 characters"),
  key: z
    .string()
    .min(2, "Project key must be at least 2 characters")
    .max(10, "Project key cannot exceed 10 characters")
    .regex(/^[A-Z0-9-]+$/, "Project key must contain only uppercase letters, numbers, and hyphens (e.g. ENG-01)"),
  category: ProjectCategoryEnum,
  description: z.string().min(5, "Description must be at least 5 characters").max(1000, "Description cannot exceed 1000 characters"),
  status: ProjectStatusEnum.default("Planning"),
  health: ProjectHealthEnum.default("On Track"),
  lead: projectLeadSchema,
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format"),
  tags: z.array(z.string().min(1).max(30)).default([]),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectQuerySchema = z.object({
  category: ProjectCategoryEnum.optional(),
  status: ProjectStatusEnum.optional(),
  health: ProjectHealthEnum.optional(),
  search: z.string().optional(),
  leadName: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["name", "dueDate", "progress", "createdAt", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const projectIdParamSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
});
