import type { User } from "@shared/schema";

export type SafeUser = Omit<User, "password">;

export function sanitizeUser(user: User | null | undefined): SafeUser | null {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}
