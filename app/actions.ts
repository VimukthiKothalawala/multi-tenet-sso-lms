"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { content } from "@/lib/db/schema";
import { getOrCreateCurrentUserRole } from "@/lib/db/users";
import { createClient } from "@/lib/supabase/server";

export type ContentFormState = {
  error?: string;
};

export async function createContent(
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) {
    return { error: "You must be signed in to post." };
  }

  const userRole = await getOrCreateCurrentUserRole();
  if (userRole?.role !== "teacher") {
    return { error: "Only teachers can post content." };
  }

  const body = String(formData.get("body") ?? "").trim();
  if (!body) {
    return { error: "Content cannot be empty." };
  }

  await db.insert(content).values({
    body,
    authorId: authUser.id,
  });

  revalidatePath("/");
  return {};
}
