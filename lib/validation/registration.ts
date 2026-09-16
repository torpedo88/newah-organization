import { z } from "zod";

export const registrationTypeSchema = z.enum(["FOOD", "DONATION"]);

export const baseRegistrationSchema = z.object({
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
  registrationType: registrationTypeSchema,
});

export const foodRegistrationSchema = baseRegistrationSchema.extend({
  registrationType: z.literal("FOOD"),
  foodOption: z.string().min(1, "Please select a food option"),
});

export const donationRegistrationSchema = baseRegistrationSchema.extend({
  registrationType: z.literal("DONATION"),
  donationAmount: z
    .number()
    .min(1, "Donation amount must be at least $1")
    .max(10000, "Donation amount must not exceed $10,000"),
});

export const registrationSchema = z.discriminatedUnion("registrationType", [
  foodRegistrationSchema,
  donationRegistrationSchema,
]);

export type Registration = z.infer<typeof registrationSchema>;
export type FoodRegistration = z.infer<typeof foodRegistrationSchema>;
export type DonationRegistration = z.infer<typeof donationRegistrationSchema>;
