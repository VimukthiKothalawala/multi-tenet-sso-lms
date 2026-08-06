import { currentUser } from "@clerk/nextjs/server";

export type Role = "student" | "teacher";

export async function getRole(): Promise<Role | null> {
  const user = await currentUser();
  return user?.publicMetadata.role ?? null;
}
