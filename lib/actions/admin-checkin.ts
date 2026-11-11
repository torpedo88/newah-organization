"use server";

import { createClient } from "@/lib/supabase/server";

export type AdminCheckInResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function adminCheckInRegistration(
  registrationId: number,
  adultCount: number,
  childCount: number,
): Promise<AdminCheckInResult> {
  try {
    if (!registrationId) {
      return { success: false, error: "Registration ID required" };
    }

    if (adultCount < 0 || childCount < 0) {
      return { success: false, error: "Guest counts must be non-negative" };
    }

    if (adultCount + childCount < 1) {
      return { success: false, error: "At least one guest must be present" };
    }

    const supabase = await createClient();

    const now = new Date().toISOString();

    // Record check-in
    const { error: updateError } = await supabase
      .from("mhapuja_registrations")
      .update({
        checked_in_at: now,
        adults_present: adultCount,
        children_present: childCount,
      })
      .eq("id", registrationId);

    if (updateError) {
      console.error("Admin check-in error:", updateError);
      return {
        success: false,
        error: updateError.message || "Failed to record check-in",
      };
    }

    return {
      success: true,
      message: "Check-in recorded successfully",
    };
  } catch (error) {
    console.error("Admin check-in exception:", error);
    return { success: false, error: "An error occurred" };
  }
}
