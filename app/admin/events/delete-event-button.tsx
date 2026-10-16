"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteEvent } from "./actions";

/**
 * Delete with a confirm step. A client component because the confirm needs
 * an onClick, which a server component cannot attach.
 */
export default function DeleteEventButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this event?")) return;
        startTransition(async () => {
          const result = await deleteEvent(id);
          if ("error" in result) alert(result.error);
        });
      }}
      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
    >
      <Trash2 className="size-3" />
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
