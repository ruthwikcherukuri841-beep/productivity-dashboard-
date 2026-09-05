import { z } from "zod";

export const UserRoleEnum = z.enum([
  "Engineer",
  "Staff Architect",
  "DevOps Lead",
  "Security Specialist",
  "Engineering Manager",
  "Product Manager",
  "Designer",
]);

export const UserStatusEnum = z.enum([
  "Online",
  "Focus",
  "Reviewing",
  "Offline",
]);

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80, "Name must be at most 80 characters"),
  email: z.string().email("Invalid email address format"),
  avatar: z.string().url("Avatar must be a valid URL").optional().default("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"),
  role: UserRoleEnum.default("Engineer"),
  status: UserStatusEnum.default("Online"),
  bio: z.string().max(300, "Bio must not exceed 300 characters").optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const userQuerySchema = z.object({
  role: UserRoleEnum.optional(),
  status: UserStatusEnum.optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["name", "email", "createdAt", "role"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const userIdParamSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});
