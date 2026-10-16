import { z } from "zod";
import { MHAPUJA_MAX_PER_TIER } from "@/lib/constants/mhapuja";
import { emailProblem, isValidPhone } from "@/lib/validation/contact";

/**
 * The Mha Puja registration schema.
 *
 * Mirrors the Indra Jatra schema in shape — same consent gate, same
 * submissionId idempotency, same phone/email validation — and differs where
 * the event does: two integer head counts instead of a guest list, and at
 * least one of them has to be positive. Zero of both is a registration for
 * nobody, which is not what this flow is for.
 */
export const mhapujaRegistrationSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .trim()
      .optional(),

    // Same reasoning as the Indra Jatra schema: shape is checked via
    // isValidPhone after punctuation is stripped, so a strict digits-only
    // rule here does not reject real phone numbers typed with brackets.
    phone: z.string().trim().optional(),
    email: z.string().email("Please enter a valid email").trim().toLowerCase().optional(),

    /** 10 and over. */
    adultCount: z
      .number()
      .int("Please enter a whole number")
      .min(0, "Count cannot be negative")
      .max(MHAPUJA_MAX_PER_TIER, `Please contact us for parties over ${MHAPUJA_MAX_PER_TIER}`)
      .optional(),

    /** Under 10. */
    childCount: z
      .number()
      .int("Please enter a whole number")
      .min(0, "Count cannot be negative")
      .max(MHAPUJA_MAX_PER_TIER, `Please contact us for parties over ${MHAPUJA_MAX_PER_TIER}`)
      .optional(),

    consentGiven: z.boolean().optional(),

    /**
     * Identifies one filled-in form, generated once when the page loads.
     * A resubmit — a double click, a browser retry, a flaky connection —
     * carries the same id and must not become a second attendee.
     */
    submissionId: z.string().uuid().optional(),
  })
  .superRefine((data, ctx) => {
    const fail = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });

    if (!data.fullName || data.fullName.trim().length < 2) {
      fail(["fullName"], "Please enter your name");
    }
    if (!data.phone || !isValidPhone(data.phone)) {
      fail(["phone"], "Please enter a 10-digit US phone number");
    }
    const emailIssue = emailProblem(data.email ?? "");
    if (emailIssue) fail(["email"], emailIssue);

    // Head counts have to be explicit numbers, both of them. Silence is the
    // difference between "none" and "I did not notice the field".
    const adults = data.adultCount;
    const children = data.childCount;
    if (typeof adults !== "number") fail(["adultCount"], "Please enter how many adults are coming");
    if (typeof children !== "number") fail(["childCount"], "Please enter how many children are coming");

    if (typeof adults === "number" && typeof children === "number") {
      if (adults + children < 1) {
        // A registration for nobody has nobody to charge. The database stops
        // this too, but it is a better user experience to say so in the form.
        fail(["adultCount"], "At least one ticket is needed");
      }
    }

    // No submission without an affirmative tick. Never default this to true.
    if (data.consentGiven !== true) fail(["consentGiven"], "Please agree before submitting");
  });

export type MhapujaRegistration = z.infer<typeof mhapujaRegistrationSchema>;
