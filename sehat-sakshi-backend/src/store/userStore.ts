import { User } from "../types/user";

// In-memory store (replace with database in production)
const users: Map<string, User> = new Map();

export const userStore = {
  findByEmail: (email: string): User | undefined => {
    for (const user of users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  },

  findById: (id: string): User | undefined => {
    return users.get(id);
  },

  create: (user: User): User => {
    users.set(user.id, user);
    return user;
  },

  update: (id: string, updates: Partial<User>): User | undefined => {
    const user = users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    users.set(id, updated);
    return updated;
  },

  delete: (id: string): boolean => {
    return users.delete(id);
  }
};
