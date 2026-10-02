"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ADMIN_COOKIE, sessionTokenIsValid } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";

/** What every action below returns: either it worked, or it says why not. */
type ActionResult = { success: true } | { error: string };

type EventInput = {
  title: string;
  slug: string;
  description: string;
  event_date: string;
  location: string;
  capacity: number;
  image_url?: string;
};

/**
 * Re-establish the admin session before touching the database.
 *
 * A server action is its own endpoint. Anyone who knows its id can post to it
 * directly, and the cookie check on the page that renders the form does
 * nothing to stop them — that check only decides what gets painted. Without
 * the gate below these four actions would let any visitor create, edit,
 * publish or delete the chapter's events.
 *
 * The service-role client is handed back from here so that a caller cannot
 * reach the database without having passed the check first.
 */
async function requireAdmin(): Promise<
  { ok: true; admin: SupabaseClient } | { ok: false; error: string }
> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token || !sessionTokenIsValid(token)) {
    return { ok: false, error: "Your session has expired. Sign in again." };
  }

  const admin = createAdminClient();
  if (!admin) {
    return {
      ok: false,
      error: "SUPABASE_SERVICE_ROLE_KEY is not set, so events cannot be edited.",
    };
  }

  return { ok: true, admin };
}

export async function createEvent(data: EventInput): Promise<ActionResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: gate.error };

  const { error } = await gate.admin.from("events").insert([
    {
      title: data.title,
      slug: data.slug,
      description: data.description,
      event_date: data.event_date,
      location: data.location,
      capacity: data.capacity,
      image_url: data.image_url || null,
      published: false,
    },
  ]);

  if (error) return { error: error.message };

  revalidatePath("/admin/events");
  return { success: true };
}

export async function updateEvent(id: number, data: EventInput): Promise<ActionResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: gate.error };

  const { error } = await gate.admin
    .from("events")
    .update({
      title: data.title,
      slug: data.slug,
      description: data.description,
      event_date: data.event_date,
      location: data.location,
      capacity: data.capacity,
      image_url: data.image_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/events");
  return { success: true };
}

export async function deleteEvent(id: number): Promise<ActionResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: gate.error };

  const { error } = await gate.admin.from("events").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/events");
  return { success: true };
}

export async function togglePublish(id: number): Promise<ActionResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: gate.error };

  const { data: event, error: fetchError } = await gate.admin
    .from("events")
    .select("published")
    .eq("id", id)
    .single();

  if (fetchError) return { error: fetchError.message };
  if (!event) return { error: "That event no longer exists." };

  const { error } = await gate.admin
    .from("events")
    .update({ published: !event.published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/events");
  return { success: true };
}
