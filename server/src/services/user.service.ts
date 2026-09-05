import { db } from "../db/database";
import { User, PaginatedResult, Task, Project } from "../types";
import { NotFoundError, ConflictError } from "../errors/AppError";

export class UserService {
  public static getUsers(filter?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): PaginatedResult<User> {
    return db.getUsers(filter);
  }

  public static getUserById(id: string): User {
    const user = db.getUserById(id);
    if (!user) {
      throw new NotFoundError("User", id);
    }
    return user;
  }

  public static getUserTasks(id: string): Task[] {
    const user = this.getUserById(id);
    const allTasks = db.getTasks({ limit: 1000 }).data;
    return allTasks.filter(
      (t) => t.assignee.id === user.id || t.assignee.name.toLowerCase() === user.name.toLowerCase()
    );
  }

  public static getUserProjects(id: string): Project[] {
    const user = this.getUserById(id);
    const allProjects = db.getProjects({ limit: 1000 }).data;
    return allProjects.filter(
      (p) => p.lead.id === user.id || p.lead.name.toLowerCase() === user.name.toLowerCase()
    );
  }

  public static createUser(payload: {
    name: string;
    email: string;
    avatar?: string;
    role?: any;
    status?: any;
    bio?: string;
  }): User {
    const existing = db.getUserByEmail(payload.email);
    if (existing) {
      throw new ConflictError(`User with email '${payload.email}' already exists`);
    }

    return db.createUser({
      name: payload.name,
      email: payload.email,
      avatar:
        payload.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: payload.role || "Engineer",
      status: payload.status || "Online",
      bio: payload.bio,
    });
  }

  public static updateUser(
    id: string,
    updates: Partial<{
      name: string;
      email: string;
      avatar: string;
      role: any;
      status: any;
      bio: string;
    }>
  ): User {
    this.getUserById(id); // Throws if user not found

    if (updates.email) {
      const emailUser = db.getUserByEmail(updates.email);
      if (emailUser && emailUser.id !== id) {
        throw new ConflictError(`Email '${updates.email}' is already in use by another user`);
      }
    }

    const updated = db.updateUser(id, updates);
    if (!updated) {
      throw new NotFoundError("User", id);
    }
    return updated;
  }

  public static deleteUser(id: string): void {
    this.getUserById(id); // Throws if not found
    db.deleteUser(id);
  }
}
