import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { userRoles, type UserRole } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";

export type Role = "student" | "teacher";

/**
 * Looks up the signed-in user's role row, creating it on first sight.
 * Supabase Auth is the source of truth for identity; this table only tracks role.
 */
export async function getOrCreateCurrentUserRole(): Promise<UserRole | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const [existing] = await db.select().from(userRoles).where(eq(userRoles.id, authUser.id));
  if (existing) return existing;

  const [created] = await db
    .insert(userRoles)
    .values({ id: authUser.id })
    .onConflictDoNothing()
    .returning();

  if (created) return created;

  const [row] = await db.select().from(userRoles).where(eq(userRoles.id, authUser.id));
  return row ?? null;
}

export async function getCurrentUserRole(): Promise<Role | null> {
  const row = await getOrCreateCurrentUserRole();
  return row?.role ?? null;
}
