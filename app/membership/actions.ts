"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitMembershipSignup(data: {
  name: string;
  email: string;
  phone?: string;
  membership_type: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("memberships").insert([{
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    membership_type: data.membership_type,
    membership_status: "active",
    paid: false,
  }]);

  if (error) return { error: error.message };

  return { success: true };
}
