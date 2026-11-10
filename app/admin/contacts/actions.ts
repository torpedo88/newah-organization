"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";

export async function deleteContact(id: string) {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: gate.error };
  const supabase = gate.admin;

  const { error } = await supabase.from("contacts").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function updateContactStatus(id: string, status: string) {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: gate.error };
  const supabase = gate.admin;

  const { error } = await supabase.from("contacts").update({ status }).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function getContacts() {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: gate.error };
  const supabase = gate.admin;

  const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });

  if (error) return { error: error.message };

  return { contacts: data };
}
