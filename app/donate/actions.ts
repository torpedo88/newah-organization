"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitDonation(data: {
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  donation_type: string;
  purpose?: string;
  anonymous: boolean;
}) {
  const supabase = await createClient();

  const { error, data: donation } = await supabase.from("donations").insert([{
    donor_name: data.anonymous ? "Anonymous" : data.donor_name,
    donor_email: data.donor_email,
    donor_phone: data.donor_phone || null,
    amount: data.amount,
    donation_type: data.donation_type,
    purpose: data.purpose || null,
    payment_status: "pending",
    anonymous: data.anonymous,
  }]).select().single();

  if (error) return { error: error.message };

  return { success: true, donation };
}
