"use server";

import { createClient } from "@/lib/supabase/server";

export type DoorRegistrationResult = {
  success: boolean;
  registrationId?: number;
  registrationCode?: string;
  message?: string;
  error?: string;
};

export async function doorRegisterAttendee(
  fullName: string,
  phone: string,
  email: string,
  adultCount: number,
  childCount: number,
): Promise<DoorRegistrationResult> {
  try {
    if (!fullName?.trim()) {
      return { success: false, error: "Name required" };
    }

    if (adultCount < 0 || childCount < 0) {
      return { success: false, error: "Guest counts must be non-negative" };
    }

    if (adultCount + childCount < 1) {
      return { success: false, error: "At least one guest must be registered" };
    }

    const supabase = await createClient();

    // Generate registration code
    const code = `MHP-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create registration with cash payment pending
    const { data, error } = await supabase
      .from("mhapuja_registrations")
      .insert({
        registration_code: code,
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        adult_count: adultCount,
        child_count: childCount,
        payment_status: "pending",
        charged_cents: 0,
        consent_given: true,
        consent_at: new Date().toISOString(),
        checked_in_at: new Date().toISOString(),
        adults_present: adultCount,
        children_present: childCount,
      })
      .select("id, registration_code")
      .single();

    if (error) {
      console.error("Door registration error:", error);
      return {
        success: false,
        error: error.message || "Failed to register attendee",
      };
    }

    return {
      success: true,
      registrationId: data.id,
      registrationCode: data.registration_code,
      message: `Registered ${fullName}. Code: ${data.registration_code}`,
    };
  } catch (error) {
    console.error("Door registration exception:", error);
    return { success: false, error: "An error occurred" };
  }
}
