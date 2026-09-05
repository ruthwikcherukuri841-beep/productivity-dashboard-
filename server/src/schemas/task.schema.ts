import { z } from "zod";

export const TaskPriorityEnum = z.enum(["Low", "Medium", "High", "Urgent"]);
export const TaskStatusEnum = z.enum(["Todo", "In Progress", "In Review", "Done"]);

export const taskAssigneeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Assignee name must be at least 2 characters"),
  avatar: z.string().url("Assignee avatar must be a valid URL"),
});

export const createTaskSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title cannot exceed 200 characters"),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").optional(),
  priority: TaskPriorityEnum.default("Medium"),
  status: TaskStatusEnum.default("Todo"),
  assignee: taskAssigneeSchema,
  estimateHours: z.number().min(0.5, "Estimate must be at least 0.5 hours").max(200, "Estimate cannot exceed 200 hours").default(2),
  order: z.number().int().nonnegative().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const updateTaskStatusSchema = z.object({
  status: TaskStatusEnum,
});

export const reorderTasksSchema = z.object({
  taskIds: z.array(z.string().min(1)).min(1, "Must provide at least one task ID to reorder"),
  status: TaskStatusEnum.optional(),
});

export const taskQuerySchema = z.object({
  projectId: z.string().optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  assigneeName: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  sortBy: z.enum(["order", "estimateHours", "priority", "status", "createdAt", "title"]).default("order"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const taskIdParamSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
});
