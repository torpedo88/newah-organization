"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createBoardMember(data: {
  name: string;
  position: string;
  email?: string;
  phone?: string;
  bio?: string;
  image_url?: string;
  term_start?: string;
  term_end?: string;
  active: boolean;
  display_order: number;
}) {
  const admin = createAdminClient();

  const { error } = await admin.from("board_members").insert([{
    name: data.name,
    position: data.position,
    email: data.email || null,
    phone: data.phone || null,
    bio: data.bio || null,
    image_url: data.image_url || null,
    term_start: data.term_start || null,
    term_end: data.term_end || null,
    active: data.active,
    display_order: data.display_order,
  }]);

  if (error) return { error: error.message };

  revalidatePath("/admin/board-members");
  return { success: true };
}

export async function updateBoardMember(id: number, data: {
  name: string;
  position: string;
  email?: string;
  phone?: string;
  bio?: string;
  image_url?: string;
  term_start?: string;
  term_end?: string;
  active: boolean;
  display_order: number;
}) {
  const admin = createAdminClient();

  const { error } = await admin.from("board_members").update({
    name: data.name,
    position: data.position,
    email: data.email || null,
    phone: data.phone || null,
    bio: data.bio || null,
    image_url: data.image_url || null,
    term_start: data.term_start || null,
    term_end: data.term_end || null,
    active: data.active,
    display_order: data.display_order,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/board-members");
  return { success: true };
}

export async function deleteBoardMember(id: number) {
  const admin = createAdminClient();

  const { error } = await admin.from("board_members").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/board-members");
  return { success: true };
}
