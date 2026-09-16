"use server";

import { registrationSchema, FoodRegistration, DonationRegistration } from "@/lib/validation/registration";

// TODO: Implement when Supabase is configured
// This will:
// 1. Validate input (already done by client, but re-validate here)
// 2. Upsert person by email
// 3. Generate unique registration code (NEWAH-2026-XXXXX format)
// 4. Insert registration record
// 5. Send confirmation email

export async function registerFood(input: FoodRegistration): Promise<{
  success: boolean;
  registrationCode?: string;
  message?: string;
  error?: string;
}> {
  try {
    // Validate input
    const validated = registrationSchema.parse(input);

    if (validated.registrationType !== "FOOD") {
      throw new Error("Invalid registration type");
    }

    // TODO: Implement database operations
    // - Create or get person by email
    // - Generate registration code
    // - Insert into organization_registrations table
    // - Send confirmation email via Resend

    return {
      success: true,
      registrationCode: "NEWAH-2026-DEMO00", // Placeholder
      message: "Food registration successful (demo - database not configured)",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

export async function registerDonation(
  input: DonationRegistration,
): Promise<{
  success: boolean;
  sessionUrl?: string | null;
  message?: string;
  error?: string;
}> {
  try {
    // Validate input
    const validated = registrationSchema.parse(input);

    if (validated.registrationType !== "DONATION") {
      throw new Error("Invalid registration type");
    }

    // TODO: Implement when Stripe is configured
    // - Create or get person by email
    // - Generate registration code
    // - Insert pending registration (status = PENDING, payment_status = PENDING)
    // - Create Stripe Checkout Session
    // - Return session URL for redirect

    return {
      success: true,
      sessionUrl: null,
      message: "Donation flow not yet configured (awaiting Stripe setup)",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Donation registration failed",
    };
  }
}
