"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getOrCreateCurrentUser, type Role } from "@/lib/db/users";

export async function setRole(role: Role) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const existing = await getOrCreateCurrentUser();
  if (existing?.role) {
    redirect("/");
  }

  await db.update(users).set({ role }).where(eq(users.id, userId));

  redirect("/");
}
