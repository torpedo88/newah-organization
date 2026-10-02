"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitVolunteerSignup(data: {
  name: string;
  email: string;
  phone?: string;
  volunteer_type: string;
  skills?: string;
  interest_area?: string;
  availability?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("volunteers").insert([{
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    volunteer_type: data.volunteer_type,
    skills: data.skills || null,
    interest_area: data.interest_area || null,
    availability: data.availability || null,
    status: "active",
    hours_logged: 0,
  }]);

  if (error) return { error: error.message };

  revalidatePath("/volunteer");
  return { success: true };
}
