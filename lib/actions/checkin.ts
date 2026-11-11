"use server";

import { requireAdmin } from "@/lib/admin/require-admin";
import { formatDateTime } from "@/lib/constants/time";
import { normalizePhone } from "@/lib/validation/contact";

export type CheckinResult = {
  success: boolean;
  name?: string;
  checkedInAt?: string;
  guestCount?: number;
  /** Set when cash was taken for this check-in. */
  cashCents?: number;
  error?: string;
  /** Registered but unpaid: the volunteer may take this much cash and retry. */
  cashDue?: { code: string; name: string; cents: number };
};

type Row = {
  id: number;
  registration_code: string;
  full_name: string;
  payment_status: string;
  adult_count: number;
  child_count: number;
  checked_in_at: string | null;
  charged_cents: number;
};

const COLUMNS =
  "id, registration_code, full_name, payment_status, adult_count, child_count, checked_in_at, charged_cents";

/**
 * Volunteer check-in at the door.
 *
 * Registrations hold names, phones and emails and anon has no access to the
 * table, so this runs only for a signed-in admin session, with the service-role
 * client requireAdmin hands back. Lookups use .eq() only: what the volunteer
 * types never becomes part of a filter string.
 */
export async function checkInRegistration(
  identifier: string,
  adultCount: number,
  childCount: number,
  cashCollected = false,
): Promise<CheckinResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { success: false, error: gate.error };
  const db = gate.admin;

  const input = (identifier ?? "").trim();
  if (!input) {
    return { success: false, error: "Enter a registration code, phone number, or email." };
  }
  if (
    !Number.isInteger(adultCount) ||
    !Number.isInteger(childCount) ||
    adultCount < 0 ||
    childCount < 0 ||
    adultCount + childCount < 1
  ) {
    return { success: false, error: "At least one guest must be present." };
  }

  // Pick the column from the shape of the input. Phones are stored as +1XXXXXXXXXX.
  const digits = normalizePhone(input);
  let query = db.from("mhapuja_registrations").select(COLUMNS);
  if (input.includes("@")) {
    query = query.eq("email", input.toLowerCase());
  } else if (/^MHP-/i.test(input)) {
    query = query.eq("registration_code", input.toUpperCase());
  } else if (digits.length === 10) {
    query = query.eq("phone", `+1${digits}`);
  } else {
    return { success: false, error: "That isn't a registration code, 10-digit phone, or email." };
  }

  const { data, error } = await query.order("created_at", { ascending: false }).limit(20);
  if (error) {
    console.error("Check-in lookup error:", error);
    return { success: false, error: "Could not look up registrations. Try again." };
  }

  const rows = (data ?? []) as Row[];
  if (rows.length === 0) {
    return { success: false, error: "No registration found. Check the spelling, or send them to an organizer." };
  }

  // One phone or email can hold several registrations, including abandoned
  // unpaid ones. Paid rows come first; an unpaid one is only offered for cash
  // when nothing under this lookup has been paid.
  const paid = rows.filter((r) => r.payment_status === "paid");
  let reg: Row;
  let takingCash = false;

  if (paid.length === 0) {
    const unpaid = rows.filter((r) => r.payment_status === "pending" || r.payment_status === "failed");
    if (unpaid.length === 0) {
      return { success: false, error: `Payment is ${rows[0].payment_status}. Send them to an organizer.` };
    }
    if (unpaid.length > 1) {
      return {
        success: false,
        error: `Several unpaid registrations match: ${unpaid.map((r) => r.registration_code).join(", ")}. Enter the code instead.`,
      };
    }
    reg = unpaid[0];
    if (!cashCollected) {
      return {
        success: false,
        error: `${reg.full_name} registered but did not pay.`,
        cashDue: { code: reg.registration_code, name: reg.full_name, cents: reg.charged_cents },
      };
    }
    takingCash = true;
  } else {
    const open = paid.filter((r) => !r.checked_in_at);
    if (open.length === 0) {
      const r = paid[0];
      return {
        success: false,
        error: `${r.full_name} (${r.registration_code}) is already checked in, at ${formatDateTime(r.checked_in_at)}.`,
      };
    }
    if (open.length > 1) {
      return {
        success: false,
        error: `Several paid registrations match: ${open.map((r) => r.registration_code).join(", ")}. Enter the code instead.`,
      };
    }
    reg = open[0];
  }

  // Part of a group may stay home; more people than were paid for may not.
  if (adultCount > reg.adult_count || childCount > reg.child_count) {
    return {
      success: false,
      error: `Paid for ${reg.adult_count} adult${reg.adult_count === 1 ? "" : "s"} and ${reg.child_count} child${reg.child_count === 1 ? "" : "ren"}. Extra guests need a new registration.`,
    };
  }

  const now = new Date().toISOString();
  // checked_in_at is null in the filter so two volunteers can't both admit the same ticket.
  // Cash charges what was registered: the row's price check ties charged_cents
  // to the ticket counts, and the counts are what the money was due for.
  const update = takingCash
    ? { checked_in_at: now, adults_present: adultCount, children_present: childCount, payment_status: "paid", paid_cash_at: now }
    : { checked_in_at: now, adults_present: adultCount, children_present: childCount };
  let write = db.from("mhapuja_registrations").update(update).eq("id", reg.id).is("checked_in_at", null);
  // Only from the status the volunteer saw, so cash is never taken twice.
  write = takingCash ? write.eq("payment_status", reg.payment_status) : write.eq("payment_status", "paid");
  const { data: updated, error: updateError } = await write.select("id");
  if (updateError) {
    console.error("Check-in update error:", updateError);
    return { success: false, error: "Could not record check-in. Try again." };
  }
  if (!updated || updated.length === 0) {
    return { success: false, error: `${reg.full_name} was just checked in by someone else.` };
  }

  return {
    success: true,
    name: reg.full_name,
    checkedInAt: now,
    guestCount: adultCount + childCount,
    cashCents: takingCash ? reg.charged_cents : undefined,
  };
}
