import { z } from "zod";

export const registrationTypeSchema = z.enum(["FOOD", "DONATION"]);

export const baseSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .trim(),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits")
    .trim(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  registrationType: registrationTypeSchema.optional(),
  foodOption: z.string().optional(),
  donationAmount: z.number().optional(),
});

export const registrationSchema = baseSchema.refine(
  (data) => {
    if (!data.registrationType) return false;
    if (data.registrationType === "FOOD" && (!data.foodOption || data.foodOption.trim().length < 2)) return false;
    if (data.registrationType === "DONATION" && (!data.donationAmount || data.donationAmount < 1 || data.donationAmount > 10000)) return false;
    return true;
  },
  { message: "Please complete all required fields" }
);

export type Registration = z.infer<typeof registrationSchema>;

export type FoodRegistration = Registration & { registrationType: "FOOD"; foodOption: string };
export type DonationRegistration = Registration & { registrationType: "DONATION"; donationAmount: number };
