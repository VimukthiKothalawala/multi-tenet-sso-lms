import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserRole } from "@/lib/db/users";
import { ContentForm } from "@/app/components/ContentForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewContentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
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
