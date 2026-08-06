"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { content } from "@/lib/db/schema";
import { getOrCreateCurrentUser } from "@/lib/db/users";

export type ContentFormState = {
  error?: string;
};

export async function createContent(
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in to post." };
  }

  const user = await getOrCreateCurrentUser();
  if (user?.role !== "teacher") {
    return { error: "Only teachers can post content." };
  }

  const body = String(formData.get("body") ?? "").trim();
  if (!body) {
    return { error: "Content cannot be empty." };
  }

  await db.insert(content).values({
    body,
    authorId: userId,
  });

  revalidatePath("/");
  return {};
}
