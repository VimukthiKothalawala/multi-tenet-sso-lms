"use client";

import { useActionState, useEffect, useRef } from "react";
import { createContent, type ContentFormState } from "@/app/actions";

const initialState: ContentFormState = {};

export function ContentForm() {
  const [state, formAction, pending] = useActionState(createContent, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state?.error) {
      formRef.current?.reset();
    }
  }, [pending, state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2 mb-8">
      <textarea
        name="body"
        rows={6}
        required
        placeholder="Write content for your students…"
        className="border rounded p-3 resize-none"
      />
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {pending ? "Posting…" : "Post"}
      </button>
    </form>
  );
}
