"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createDonation(data: {
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  donation_type: string;
  purpose?: string;
  payment_status: string;
  anonymous: boolean;
}) {
  const admin = createAdminClient();

  const { error } = await admin.from("donations").insert([{
    donor_name: data.donor_name,
    donor_email: data.donor_email,
    donor_phone: data.donor_phone || null,
    amount: data.amount,
    donation_type: data.donation_type,
    purpose: data.purpose || null,
    payment_status: data.payment_status,
    anonymous: data.anonymous,
  }]);

  if (error) return { error: error.message };

  revalidatePath("/admin/donations");
  return { success: true };
}

export async function updateDonation(id: number, data: {
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  donation_type: string;
  purpose?: string;
  payment_status: string;
  anonymous: boolean;
}) {
  const admin = createAdminClient();

  const { error } = await admin.from("donations").update({
    donor_name: data.donor_name,
    donor_email: data.donor_email,
    donor_phone: data.donor_phone || null,
    amount: data.amount,
    donation_type: data.donation_type,
    purpose: data.purpose || null,
    payment_status: data.payment_status,
    anonymous: data.anonymous,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/donations");
  return { success: true };
}

export async function deleteDonation(id: number) {
  const admin = createAdminClient();

  const { error } = await admin.from("donations").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/donations");
  return { success: true };
}
