"use server";

import { createClient } from "@/lib/supabase/server";

export type CheckinResult = {
  success: boolean;
  name?: string;
  checkedInAt?: string;
  guestCount?: number;
  error?: string;
};

export async function checkInRegistration(
  registrationCode: string,
  guestCount: number,
): Promise<CheckinResult> {
  try {
    if (!registrationCode || registrationCode.length === 0) {
      return { success: false, error: "Registration code is required" };
    }

    if (guestCount < 1 || guestCount > 20) {
      return { success: false, error: "Guest count must be between 1 and 20" };
    }

    const supabase = await createClient();

    // Find registration by code
    const { data: registration, error: lookupError } = await supabase
      .from("mhapuja_registrations")
      .select("id, full_name, checked_in_at")
      .eq("registration_code", registrationCode)
      .single();

    if (lookupError || !registration) {
      return {
        success: false,
        error: "Registration code not found. Please check and try again.",
      };
    }

    if (registration.checked_in_at) {
      return {
        success: false,
        error: `Already checked in at ${new Date(registration.checked_in_at).toLocaleTimeString()}`,
      };
    }

    const now = new Date().toISOString();

    // Record check-in
    const { error: updateError } = await supabase
      .from("mhapuja_registrations")
      .update({
        checked_in_at: now,
        guests_present: guestCount,
      })
      .eq("id", registration.id);

    if (updateError) {
      console.error("Check-in update error:", updateError);
      return { success: false, error: "Failed to record check-in" };
    }

    return {
      success: true,
      name: registration.full_name,
      checkedInAt: now,
      guestCount,
    };
  } catch (error) {
    console.error("Check-in error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
