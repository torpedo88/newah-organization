"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";

export async function createMembership(data: {
  name: string;
  email: string;
  phone?: string;
  membership_type: string;
  membership_status: string;
  annual_fee?: number;
  paid: boolean;
}) {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: gate.error };
  const admin = gate.admin;

  const { error } = await admin.from("memberships").insert([{
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    membership_type: data.membership_type,
    membership_status: data.membership_status,
    annual_fee: data.annual_fee || null,
    paid: data.paid,
  }]);

  if (error) return { error: error.message };

  revalidatePath("/admin/memberships");
  return { success: true };
}

export async function updateMembership(id: number, data: {
  name: string;
  email: string;
  phone?: string;
  membership_type: string;
  membership_status: string;
  annual_fee?: number;
  paid: boolean;
}) {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: gate.error };
  const admin = gate.admin;

  const { error } = await admin.from("memberships").update({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    membership_type: data.membership_type,
    membership_status: data.membership_status,
    annual_fee: data.annual_fee || null,
    paid: data.paid,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/memberships");
  return { success: true };
}

export async function deleteMembership(id: number) {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: gate.error };
  const admin = gate.admin;

  const { error } = await admin.from("memberships").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/memberships");
  return { success: true };
}
