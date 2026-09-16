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
  registrationType: registrationTypeSchema.optional(),
});

export const registrationSchema = baseRegistrationSchema
  .extend({
    foodOption: z.string().optional(),
    donationAmount: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate registration type is selected
    if (!data.registrationType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["registrationType"],
        message: "Please select a registration type",
      });
      return;
    }

    // Validate Food-specific fields
    if (data.registrationType === "FOOD") {
      if (!data.foodOption || data.foodOption.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["foodOption"],
          message: "Please select a food option",
        });
      }
    }

    // Validate Donation-specific fields
    if (data.registrationType === "DONATION") {
      if (!data.donationAmount || data.donationAmount < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["donationAmount"],
          message: "Donation amount must be at least $1",
        });
      }
      if (data.donationAmount && data.donationAmount > 10000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["donationAmount"],
          message: "Donation amount must not exceed $10,000",
        });
      }
    }
  });

export type Registration = z.infer<typeof registrationSchema>;

export type FoodRegistration = Registration & { registrationType: "FOOD"; foodOption: string };
export type DonationRegistration = Registration & { registrationType: "DONATION"; donationAmount: number };
