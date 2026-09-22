import { Metadata } from "next";
import { EVENT } from "@/lib/constants/event";
import RegistrationForm from "@/components/registration/registration-form";
import CheckoutReturn from "@/components/registration/checkout-return";

export const metadata: Metadata = {
  title: `${EVENT.name} Registration - Newah Organization`,
  description: `Register for ${EVENT.name} with the Newah Organization of America, Northern California Chapter.`,
};

/**
 * Stripe sends the donor back here with ?donation=success|cancelled&code=...
 * Rendering the blank form at that point loses the confirmation entirely and
 * reads as though nothing happened, which invites a second registration.
 */
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ donation?: string; code?: string }>;
}) {
  const { donation, code } = await searchParams;
  if (donation === "success" || donation === "cancelled") {
    return <CheckoutReturn outcome={donation} code={code ?? ""} />;
  }
  return <RegistrationForm />;
}
