import { z } from "zod";
import { MAX_ADULT_GUESTS, MAX_DONATION, MIN_DONATION } from "@/lib/constants/event";

/**
 * An additional attending adult, for the name tag.
 *
 * Adults only. The form states plainly that no details should be entered for
 * anyone under 18, and nothing here accepts an age or a date of birth.
 */
export const adultGuestSchema = z.object({
  name: z.string().max(100, "Name must be less than 100 characters").trim().optional(),
  email: z.string().trim().toLowerCase().optional(),
});

export type AdultGuest = z.infer<typeof adultGuestSchema>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registrationSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .trim()
      .optional(),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone must be 10 digits")
      .trim()
      .optional(),
    email: z.string().email("Please enter a valid email").trim().toLowerCase().optional(),

    /** Every other attending adult, by name and email, for their name tags. */
    adultGuests: z.array(adultGuestSchema).max(MAX_ADULT_GUESTS).optional(),

    broughtFood: z.boolean().optional(),
    foodDescription: z.string().max(300, "Please keep this under 300 characters").trim().optional(),

    donationAmount: z.number().optional(),
    /** Whether the donor pays the card processing fee on top. */
    coversFee: z.boolean().optional(),

    consentGiven: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const fail = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });

    if (!data.fullName || data.fullName.trim().length < 2) fail(["fullName"], "Please enter your name");
    if (!data.phone || !/^\d{10}$/.test(data.phone)) fail(["phone"], "Phone must be 10 digits");
    if (!data.email) fail(["email"], "Please enter a valid email");

    // A guest row is only useful with both a name and an email, since the
    // point of collecting it is a name tag and a confirmation.
    (data.adultGuests ?? []).forEach((guest, index) => {
      const name = guest.name?.trim() ?? "";
      const email = guest.email?.trim() ?? "";
      if (!name && !email) return; // an untouched row is simply ignored
      if (name.length < 2) fail(["adultGuests", index, "name"], "Please enter this guest's name");
      if (!EMAIL.test(email)) fail(["adultGuests", index, "email"], "Please enter a valid email");
    });

    if (data.broughtFood === true) {
      if (!data.foodDescription || data.foodDescription.trim().length < 2) {
        fail(["foodDescription"], "Please tell us what you brought");
      }
    }

    if (data.donationAmount !== undefined && data.donationAmount !== null) {
      if (data.donationAmount < MIN_DONATION || data.donationAmount > MAX_DONATION) {
        fail(["donationAmount"], `Please enter between $${MIN_DONATION} and $${MAX_DONATION}`);
      }
    }

    // No submission without an affirmative tick. Never default this to true.
    if (data.consentGiven !== true) fail(["consentGiven"], "Please agree before submitting");
  });

export type Registration = z.infer<typeof registrationSchema>;

/** Rows the registrant actually filled in. */
export function filledGuests(guests: AdultGuest[] | undefined): Required<AdultGuest>[] {
  return (guests ?? [])
    .map((guest) => ({ name: guest.name?.trim() ?? "", email: guest.email?.trim() ?? "" }))
    .filter((guest) => guest.name !== "" && guest.email !== "");
}
