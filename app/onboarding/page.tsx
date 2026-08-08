import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/db/users";
import { createClient } from "@/lib/supabase/server";
import { setRole } from "./actions";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const role = await getCurrentUserRole();
  if (role) {
    redirect("/");
  }

  const setStudent = setRole.bind(null, "student");
  const setTeacher = setRole.bind(null, "teacher");

  return (
    <main className="max-w-md w-full mx-auto px-4 py-16 flex-1 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Who are you?</h1>
        <p className="text-gray-600">Pick a role to continue. This can't be changed later.</p>
      </div>
      <form className="flex flex-col gap-3">
        <button
          formAction={setStudent}
          className="border rounded p-4 text-left hover:bg-gray-50"
        >
          <span className="font-semibold block">Student</span>
          <span className="text-sm text-gray-600">Read content posted by teachers.</span>
        </button>
        <button
          formAction={setTeacher}
          className="border rounded p-4 text-left hover:bg-gray-50"
        >
          <span className="font-semibold block">Teacher</span>
          <span className="text-sm text-gray-600">Post content for students to read.</span>
        </button>
      </form>
    </main>
  );
}
