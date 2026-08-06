import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, type User } from "@/lib/db/schema";

export type Role = "student" | "teacher";

/**
 * Looks up the signed-in user's row, creating it on first sight.
 * Clerk only proves who the user is; this table is the source of truth for role/access.
 */
export async function getOrCreateCurrentUser(): Promise<User | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const [existing] = await db.select().from(users).where(eq(users.id, clerkUser.id));
  if (existing) return existing;

  const email = clerkUser.primaryEmailAddress?.emailAddress ?? "";
  const name = clerkUser.fullName ?? clerkUser.username ?? email;

  const [created] = await db
    .insert(users)
    .values({ id: clerkUser.id, email, name })
    .onConflictDoNothing()
    .returning();

  if (created) return created;

  const [row] = await db.select().from(users).where(eq(users.id, clerkUser.id));
  return row ?? null;
}

export async function getCurrentUserRole(): Promise<Role | null> {
  const user = await getOrCreateCurrentUser();
  return user?.role ?? null;
}
