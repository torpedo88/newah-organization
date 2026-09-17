"use server";

import { registrationSchema, FoodRegistration, DonationRegistration } from "@/lib/validation/registration";
import { supabase } from "@/lib/supabase/client";

export async function registerFood(input: FoodRegistration): Promise<{
  success: boolean;
  registrationCode?: string;
  message?: string;
  error?: string;
}> {
  try {
    const validated = registrationSchema.parse(input);

    if (validated.registrationType !== "FOOD") {
      throw new Error("Invalid registration type");
    }

    const registrationCode = `NEWAH-2026-${Math.floor(Math.random() * 1000000).toString().padStart(6, "0")}`;

    const { error } = await supabase.from("registrations").insert({
      registration_code: registrationCode,
      registration_type: "food",
      full_name: input.fullName,
      phone: input.phone,
      email: input.email,
      number_of_guests: input.numberOfGuests,
      food_option: input.foodOption,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase error:", error);
      if (error.code === "PGRST205") {
        throw new Error("Database not initialized. Run SQL migration in Supabase dashboard.");
      }
      throw new Error(`Failed to save registration: ${error.message}`);
    }

    return {
      success: true,
      registrationCode,
    };
  } catch (error) {
    console.error("Food registration error:", error);
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
    const validated = registrationSchema.parse(input);

    if (validated.registrationType !== "DONATION") {
      throw new Error("Invalid registration type");
    }

    const registrationCode = `NEWAH-2026-${Math.floor(Math.random() * 1000000).toString().padStart(6, "0")}`;

    const { error } = await supabase.from("registrations").insert({
      registration_code: registrationCode,
      registration_type: "donation",
      full_name: input.fullName,
      phone: input.phone,
      email: input.email,
      donation_amount: input.donationAmount,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase error:", error);
      if (error.code === "PGRST205") {
        throw new Error("Database not initialized. Run SQL migration in Supabase dashboard.");
      }
      throw new Error(`Failed to save registration: ${error.message}`);
    }

    // TODO: Create Stripe checkout session
    const sessionUrl = `https://checkout.stripe.com/demo`;

    return {
      success: true,
      sessionUrl,
    };
  } catch (error) {
    console.error("Donation registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Donation registration failed",
    };
  }
}
