import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/lib/db";
import { content, users } from "@/lib/db/schema";
import { getCurrentUserRole } from "@/lib/db/users";

export default async function Home() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const role = await getCurrentUserRole();
  if (!role) {
    redirect("/onboarding");
  }

  const allContent = await db
    .select({
      id: content.id,
      body: content.body,
      createdAt: content.createdAt,
      authorName: users.name,
    })
    .from(content)
    .leftJoin(users, eq(content.authorId, users.id))
    .orderBy(desc(content.createdAt));

  return (
    <main className="max-w-2xl w-full mx-auto px-4 py-10 flex-1">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Content</h1>
        {role === "teacher" && (
          <Link
            href="/new"
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            New content
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {allContent.length === 0 && (
          <p className="text-gray-500">No content yet.</p>
        )}
        {allContent.map((item) => (
          <article key={item.id} className="border rounded p-4">
            <p className="whitespace-pre-wrap">{item.body}</p>
            <footer className="mt-2 text-sm text-gray-500">
              {item.authorName ?? "Unknown"} · {new Date(item.createdAt).toLocaleString()}
            </footer>
          </article>
        ))}
      </div>
    </main>
  );
}
