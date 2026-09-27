"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createEvent(data: {
  title: string;
  slug: string;
  description: string;
  event_date: string;
  location: string;
  capacity: number;
  image_url?: string;
}) {
  const admin = createAdminClient();

  const { error } = await admin.from("events").insert([
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

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/events");
  return { success: true };
}

export async function updateEvent(
  id: number,
  data: {
    title: string;
    slug: string;
    description: string;
    event_date: string;
    location: string;
    capacity: number;
    image_url?: string;
  }
) {
  const admin = createAdminClient();

  const { error } = await admin.from("events").update({
    title: data.title,
    slug: data.slug,
    description: data.description,
    event_date: data.event_date,
    location: data.location,
    capacity: data.capacity,
    image_url: data.image_url || null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/events");
  return { success: true };
}

export async function deleteEvent(id: number) {
  const admin = createAdminClient();

  const { error } = await admin.from("events").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/events");
  return { success: true };
}

export async function togglePublish(id: number) {
  const admin = createAdminClient();

  const { data: event, error: fetchError } = await admin
    .from("events")
    .select("published")
    .eq("id", id)
    .single();

  if (fetchError) {
    return { error: fetchError.message };
  }

  const { error } = await admin
    .from("events")
    .update({ published: !event.published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/events");
  return { success: true };
}
