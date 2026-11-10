"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createVolunteer(data: {
  name: string;
  email: string;
  phone?: string;
  volunteer_type: string;
  availability?: string;
  skills?: string;
  interest_area?: string;
  status: string;
  hours_logged?: number;
  notes?: string;
}) {
  const admin = createAdminClient();

  const { error } = await admin.from("volunteers").insert([{
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    volunteer_type: data.volunteer_type,
    availability: data.availability || null,
    skills: data.skills || null,
    interest_area: data.interest_area || null,
    status: data.status,
    hours_logged: data.hours_logged || 0,
    notes: data.notes || null,
  }]);

  if (error) return { error: error.message };

  revalidatePath("/admin/volunteers");
  return { success: true };
}

export async function updateVolunteer(id: number, data: {
  name: string;
  email: string;
  phone?: string;
  volunteer_type: string;
  availability?: string;
  skills?: string;
  interest_area?: string;
  status: string;
  hours_logged?: number;
  notes?: string;
}) {
  const admin = createAdminClient();

  const { error } = await admin.from("volunteers").update({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    volunteer_type: data.volunteer_type,
    availability: data.availability || null,
    skills: data.skills || null,
    interest_area: data.interest_area || null,
    status: data.status,
    hours_logged: data.hours_logged || 0,
    notes: data.notes || null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/volunteers");
  return { success: true };
}

export async function deleteVolunteer(id: number) {
  const admin = createAdminClient();

  const { error } = await admin.from("volunteers").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/volunteers");
  return { success: true };
}
