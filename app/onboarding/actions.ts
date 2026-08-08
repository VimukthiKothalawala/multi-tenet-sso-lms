"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { userRoles } from "@/lib/db/schema";
import { getOrCreateCurrentUserRole, type Role } from "@/lib/db/users";
import { createClient } from "@/lib/supabase/server";

export async function setRole(role: Role) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) {
    redirect("/sign-in");
  }

  const existing = await getOrCreateCurrentUserRole();
  if (existing?.role) {
    redirect("/");
  }

  await db.update(userRoles).set({ role }).where(eq(userRoles.id, authUser.id));

  redirect("/");
}
