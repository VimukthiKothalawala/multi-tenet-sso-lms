"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { content } from "@/lib/db/schema";

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

  const user = await currentUser();
  if (user?.publicMetadata.role !== "teacher") {
    return { error: "Only teachers can post content." };
  }

  const body = String(formData.get("body") ?? "").trim();
  if (!body) {
    return { error: "Content cannot be empty." };
  }

  const authorName =
    user?.fullName ?? user?.username ?? user?.primaryEmailAddress?.emailAddress ?? "Teacher";

  await db.insert(content).values({
    body,
    authorId: userId,
    authorName,
  });

  revalidatePath("/");
  return {};
}
