import { z } from "zod";
import { MAX_ADULT_GUESTS, MAX_DONATION, MIN_DONATION } from "@/lib/constants/event";
import { emailProblem, isValidPhone, normalizePhone } from "@/lib/validation/contact";

/**
 * An additional attending adult, for the name tag.
 *
 * Adults only. The form states plainly that no details should be entered for
 * anyone under 18, and nothing here accepts an age or a date of birth.
 */
export const adultGuestSchema = z.object({
  name: z.string().max(100, "Name must be less than 100 characters").trim().optional(),
  email: z.string().trim().toLowerCase().optional(),
  phone: z.string().trim().optional(),
});

export type AdultGuest = z.infer<typeof adultGuestSchema>;

export const registrationSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .trim()
      .optional(),
    // Shape is checked in superRefine via isValidPhone, which strips
    // punctuation first. A strict digits-only rule here would fire before it
    // and reject "(415) 555-0123" — a real number, typed the way people
    // actually write one.
    phone: z.string().trim().optional(),
    email: z.string().email("Please enter a valid email").trim().toLowerCase().optional(),

    /** Every other attending adult, by name and email, for their name tags. */
    adultGuests: z.array(adultGuestSchema).max(MAX_ADULT_GUESTS).optional(),

    broughtFood: z.boolean().optional(),
    foodDescription: z.string().max(300, "Please keep this under 300 characters").trim().optional(),

    donationAmount: z.number().optional(),
    /**
     * An explicit choice, so nobody submits having simply not noticed the
     * donation section. "none" is a decision; undefined is an unanswered
     * question and is rejected.
     */
    donationChoice: z.enum(["none", "amount"]).optional(),
    /** Whether the donor pays the card processing fee on top. */
    coversFee: z.boolean().optional(),

    consentGiven: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const fail = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });

    if (!data.fullName || data.fullName.trim().length < 2) fail(["fullName"], "Please enter your name");
    if (!data.phone || !isValidPhone(data.phone)) {
      // Punctuation is accepted and stripped; this only rejects numbers that
      // cannot exist, such as a leading 0 or 1 in the area code.
      fail(["phone"], "Please enter a 10-digit US phone number");
    }
    const emailIssue = emailProblem(data.email ?? "");
    if (emailIssue) fail(["email"], emailIssue);

    // A guest row is only useful with both a name and an email, since the
    // point of collecting it is a name tag and a confirmation.
    (data.adultGuests ?? []).forEach((guest, index) => {
      const name = guest.name?.trim() ?? "";
      const email = guest.email?.trim() ?? "";
      const phone = guest.phone?.trim() ?? "";
      if (!name && !email && !phone) return; // an untouched row is simply ignored
      if (name.length < 2) fail(["adultGuests", index, "name"], "Please enter this guest's name");
      const guestEmailIssue = emailProblem(email);
      if (guestEmailIssue) fail(["adultGuests", index, "email"], guestEmailIssue);
      if (!isValidPhone(phone)) {
        fail(["adultGuests", index, "phone"], "Please enter a 10-digit US phone number");
      }
    });

    if (data.broughtFood === true) {
      if (!data.foodDescription || data.foodDescription.trim().length < 2) {
        fail(["foodDescription"], "Please tell us what you brought");
      }
    }

    // Either they declined, or they chose an amount. Silence is not an answer.
    if (data.donationChoice !== "none" && data.donationChoice !== "amount") {
      fail(["donationChoice"], "Please choose a donation amount, or select No donation");
    }
    if (data.donationChoice === "amount") {
      const amount = data.donationAmount;
      if (amount === undefined || amount === null) {
        fail(["donationAmount"], "Please choose or enter an amount");
      } else if (amount < MIN_DONATION || amount > MAX_DONATION) {
        fail(["donationAmount"], `Please enter between $${MIN_DONATION} and $${MAX_DONATION}`);
      } else if (Math.abs(amount * 100 - Math.round(amount * 100)) > 1e-9) {
        // A donation is a sum of money, so it has whole cents. Accepting
        // $1.001 and silently rounding it charges a figure nobody chose.
        fail(["donationAmount"], "Please enter an amount in whole cents");
      }
    }

    // Declining and naming an amount contradict each other. The form clears
    // the amount when No donation is picked, but the form is not the only way
    // this action is reached, and the amount is what the charge is built from.
    if (data.donationChoice === "none" && typeof data.donationAmount === "number" && data.donationAmount > 0) {
      fail(["donationAmount"], "Choose an amount, or No donation \u2014 not both");
    }

    // No submission without an affirmative tick. Never default this to true.
    if (data.consentGiven !== true) fail(["consentGiven"], "Please agree before submitting");
  });

export type Registration = z.infer<typeof registrationSchema>;

/** Rows the registrant actually filled in. */
export function filledGuests(guests: AdultGuest[] | undefined): Required<AdultGuest>[] {
  return (guests ?? [])
    .map((guest) => ({
      name: guest.name?.trim() ?? "",
      email: guest.email?.trim() ?? "",
      phone: normalizePhone(guest.phone ?? ""),
    }))
    .filter((guest) => guest.name !== "" && guest.email !== "" && guest.phone !== "");
}
