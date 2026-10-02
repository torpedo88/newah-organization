"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteContact(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("contacts").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function updateContactStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("contacts").update({ status }).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function getContacts() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });

  if (error) return { error: error.message };

  return { contacts: data };
}
