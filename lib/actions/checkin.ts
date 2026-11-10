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
  identifier: string,
  guestCount: number,
): Promise<CheckinResult> {
  try {
    if (!identifier || identifier.length === 0) {
      return { success: false, error: "Registration code or phone number is required" };
    }

    if (guestCount < 1 || guestCount > 20) {
      return { success: false, error: "Guest count must be between 1 and 20" };
    }

    const supabase = await createClient();

    // Try to find by registration code first
    let { data: registration, error: lookupError } = await supabase
      .from("mhapuja_registrations")
      .select("id, full_name")
      .eq("registration_code", identifier.toUpperCase())
      .single();

    // If not found by code, try by phone
    if (!registration && !lookupError) {
      const phoneMatch = identifier.replace(/\D/g, "");
      if (phoneMatch.length >= 10) {
        const { data: phoneReg, error: phoneError } = await supabase
          .from("mhapuja_registrations")
          .select("id, full_name")
          .eq("phone", identifier)
          .single();
        registration = phoneReg;
        lookupError = phoneError;
      }
    }

    if (lookupError || !registration) {
      return {
        success: false,
        error: "Registration not found. Please check your code or phone number and try again.",
      };
    }

    const now = new Date().toISOString();

    // Try to record check-in. Note: checked_in_at and guests_present columns must exist in DB.
    // If migration hasn't been applied yet, this will fail - apply migration 0020_checkin.sql
    try {
      const { error: updateError } = await supabase
        .from("mhapuja_registrations")
        .update({
          checked_in_at: now,
          guests_present: guestCount,
        })
        .eq("id", registration.id);

      if (updateError) {
        // If columns don't exist, provide helpful error
        if (updateError.message?.includes("checked_in_at") || updateError.message?.includes("guests_present")) {
          return {
            success: false,
            error: "Check-in system not yet initialized. Please contact support.",
          };
        }
        console.error("Check-in update error:", updateError);
        return { success: false, error: "Failed to record check-in" };
      }
    } catch (err) {
      console.error("Check-in exception:", err);
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
