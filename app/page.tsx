import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/lib/db";
import { content } from "@/lib/db/schema";
import { getRole } from "@/lib/roles";

export default async function Home() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const role = await getRole();
  if (!role) {
    redirect("/onboarding");
  }

  const allContent = await db.select().from(content).orderBy(desc(content.createdAt));

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
              {item.authorName} · {new Date(item.createdAt).toLocaleString()}
            </footer>
          </article>
        ))}
      </div>
    </main>
  );
}
