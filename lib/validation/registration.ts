import { z } from "zod";

export const registrationTypeSchema = z.enum(["FOOD", "DONATION"]);

export const baseSchema = z.object({
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
  numberOfGuests: z.number().int("Must be a whole number").min(1, "At least 1 guest").max(100, "Max 100 guests").optional(),
  registrationType: registrationTypeSchema.optional(),
  foodOption: z.string().optional(),
  donationAmount: z.number().optional(),
  // Consent to the Terms, the Privacy Policy and to being contacted. Optional
  // in the shape, required by the refine below, so it follows the same
  // all-optional-then-validate pattern as every other field here.
  consentGiven: z.boolean().optional(),
});

export const registrationSchema = baseSchema.refine(
  (data) => {
    if (!data.registrationType) return false;
    if (!data.fullName || data.fullName.trim().length < 2) return false;
    if (!data.phone || !/^\d{10}$/.test(data.phone)) return false;
    if (!data.email) return false;
    if (data.registrationType === "FOOD") {
      if (!data.foodOption || data.foodOption.trim().length < 2) return false;
      if (data.numberOfGuests === undefined || data.numberOfGuests === null || data.numberOfGuests < 1) return false;
    }
    if (data.registrationType === "DONATION" && (!data.donationAmount || data.donationAmount < 1 || data.donationAmount > 10000)) return false;
    // No submission without an affirmative tick. Never default this to true.
    if (data.consentGiven !== true) return false;
    return true;
  },
  { message: "Please fill all required fields correctly" }
);

export type Registration = z.infer<typeof registrationSchema>;

export type FoodRegistration = Registration & { registrationType: "FOOD"; foodOption: string };
export type DonationRegistration = Registration & { registrationType: "DONATION"; donationAmount: number };
