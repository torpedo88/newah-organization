"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { MHAPUJA_ADULT_PRICE_CENTS, MHAPUJA_CHILD_PRICE_CENTS } from "@/lib/constants/mhapuja";
import { emailProblem, isValidPhone, normalizeEmail, normalizePhone } from "@/lib/validation/contact";

export type DoorRegistrationResult = {
  success: boolean;
  registrationCode?: string;
  name?: string;
  chargedCents?: number;
  error?: string;
};

/**
 * Register and check in a walk-in who pays a volunteer in cash or by Zelle.
 *
 * Admin session only. The price comes from the ticket constants here on the
 * server, never from the form, so the amount recorded is what was owed.
 */
export async function doorRegisterAttendee(
  fullName: string,
  phone: string,
  email: string,
  adultCount: number,
  childCount: number,
  paymentMethod: "cash" | "zelle",
): Promise<DoorRegistrationResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { success: false, error: gate.error };

  const name = (fullName ?? "").trim();
  if (name.length < 2 || name.length > 100) {
    return { success: false, error: "Enter the guest's name." };
  }
  if (
    !Number.isInteger(adultCount) ||
    !Number.isInteger(childCount) ||
    adultCount < 0 ||
    childCount < 0 ||
    adultCount > 20 ||
    childCount > 20 ||
    adultCount + childCount < 1
  ) {
    return { success: false, error: "At least one guest, and no more than 20 of each." };
  }
  if (paymentMethod !== "cash" && paymentMethod !== "zelle") {
    return { success: false, error: "Choose cash or Zelle." };
  }

  // Both optional at the door; checked only when given.
  const phoneIn = (phone ?? "").trim();
  if (phoneIn && !isValidPhone(phoneIn)) return { success: false, error: "That phone number isn't valid." };
  const emailIn = (email ?? "").trim();
  if (emailIn && emailProblem(emailIn)) return { success: false, error: "That email isn't valid." };

  const chargedCents = adultCount * MHAPUJA_ADULT_PRICE_CENTS + childCount * MHAPUJA_CHILD_PRICE_CENTS;
  // MHD- keeps door codes apart from online MHP- codes.
  const code = `MHD-${new Date().getFullYear()}-${randomBytes(4).toString("hex").toUpperCase()}`;
  const now = new Date().toISOString();

  const { error } = await gate.admin.from("door_registrations").insert({
    registration_code: code,
    full_name: name,
    phone: phoneIn ? `+1${normalizePhone(phoneIn)}` : null,
    email: emailIn ? normalizeEmail(emailIn) : null,
    adult_count: adultCount,
    child_count: childCount,
    adult_price_cents: MHAPUJA_ADULT_PRICE_CENTS,
    child_price_cents: MHAPUJA_CHILD_PRICE_CENTS,
    charged_cents: chargedCents,
    payment_method: paymentMethod,
    checked_in_at: now,
    adults_present: adultCount,
    children_present: childCount,
  });

  if (error) {
    console.error("Door registration error:", error);
    return { success: false, error: "Could not save the registration. Try again." };
  }

  revalidatePath("/admin");
  return { success: true, registrationCode: code, name, chargedCents };
}
