import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getCurrentUserRole } from "@/lib/db/users";
import { ContentForm } from "@/app/components/ContentForm";

export default async function NewContentPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const role = await getCurrentUserRole();
  if (!role) {
    redirect("/onboarding");
  }
  if (role !== "teacher") {
    redirect("/");
  }

  return (
    <main className="max-w-2xl w-full mx-auto px-4 py-10 flex-1">
      <Link href="/" className="text-sm text-gray-600 hover:underline">
        ← Back
      </Link>
      <h1 className="text-2xl font-bold mb-6 mt-2">New content</h1>
      <ContentForm />
    </main>
  );
}
