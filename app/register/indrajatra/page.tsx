import { Metadata } from "next";
import { EVENT } from "@/lib/constants/event";
import RegistrationForm from "@/components/registration/registration-form";
import CheckoutReturn from "@/components/registration/checkout-return";

const PAGE_TITLE = `${EVENT.name} Registration \u2014 Newah Organization`;
const PAGE_DESCRIPTION =
  `Register for ${EVENT.name} with the Newah Organization of America, Northern California ` +
  `Chapter. ${EVENT.promise} ${EVENT.fundName}.`;

// openGraph and twitter are set explicitly, not left to `description` alone.
// Next merges the parent's openGraph block into a child's, so a page that sets
// only `description` still shares with the root's og:description — which is
// about the organization, not this event. This page keeps its own card image
// (opengraph-image.png, beside this file) and now its own wording with it.
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/register/indrajatra" },
  openGraph: {
    url: "/register/indrajatra",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
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
