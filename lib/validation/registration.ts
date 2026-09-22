import { z } from "zod";
import { MAX_DONATION, MIN_DONATION } from "@/lib/constants/event";

/**
 * One registration. Everyone registers to attend; bringing food and donating
 * are independent options, either, both or neither of which may apply.
 *
 * Fields are declared optional and the rules are enforced in the refine below,
 * which keeps react-hook-form's partial values type-compatible while the form
 * is being filled in.
 */
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
    numberOfGuests: z
      .number()
      .int("Must be a whole number")
      .min(1, "At least 1 guest")
      .max(100, "Max 100 guests")
      .optional(),

    /** Did they bring food? Independent of any donation. */
    broughtFood: z.boolean().optional(),
    /** What they brought. Required only when broughtFood is true. */
    foodDescription: z.string().max(300, "Please keep this under 300 characters").trim().optional(),

    /** Donation in whole dollars and cents. Absent means no donation. */
    donationAmount: z.number().optional(),

    consentGiven: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (!data.fullName || data.fullName.trim().length < 2) return false;
      if (!data.phone || !/^\d{10}$/.test(data.phone)) return false;
      if (!data.email) return false;
      if (data.numberOfGuests === undefined || data.numberOfGuests < 1) return false;

      // Saying you brought food without saying what helps nobody at the desk.
      if (data.broughtFood === true) {
        if (!data.foodDescription || data.foodDescription.trim().length < 2) return false;
      }

      // A donation is optional, but a stated one has to be a sane amount.
      if (data.donationAmount !== undefined && data.donationAmount !== null) {
        if (data.donationAmount < MIN_DONATION || data.donationAmount > MAX_DONATION) return false;
      }

      // No submission without an affirmative tick. Never default this to true.
      if (data.consentGiven !== true) return false;
      return true;
    },
    { message: "Please fill all required fields correctly" },
  );

export type Registration = z.infer<typeof registrationSchema>;
