"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createPhoto(data: {
  slug: string;
  image_url: string;
  alt_text: string;
  credit?: string;
  display_order: number;
  published: boolean;
}) {
  const admin = createAdminClient();

  const { error } = await admin.from("community_photos").insert([
    {
      slug: data.slug,
      image_url: data.image_url,
      alt_text: data.alt_text,
      credit: data.credit || null,
      display_order: data.display_order,
      published: data.published,
    },
  ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/community-photos");
  return { success: true };
}

export async function updatePhoto(
  id: number,
  data: {
    slug: string;
    image_url: string;
    alt_text: string;
    credit?: string;
    display_order: number;
    published: boolean;
  }
) {
  const admin = createAdminClient();

  const { error } = await admin.from("community_photos").update({
    slug: data.slug,
    image_url: data.image_url,
    alt_text: data.alt_text,
    credit: data.credit || null,
    display_order: data.display_order,
    published: data.published,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/community-photos");
  return { success: true };
}

export async function deletePhoto(id: number) {
  const admin = createAdminClient();

  const { error } = await admin.from("community_photos").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/community-photos");
  return { success: true };
}
