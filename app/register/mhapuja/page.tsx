import { Metadata } from "next";
import { MHAPUJA_EVENT } from "@/lib/constants/mhapuja";
import MhapujaForm from "@/components/registration/mhapuja-form";
import MhapujaTicketReturn from "@/components/registration/mhapuja-ticket-return";

const PAGE_TITLE = `${MHAPUJA_EVENT.name} Registration — Newah Organization`;
const PAGE_DESCRIPTION =
  `Register for ${MHAPUJA_EVENT.name} with the Newah Organization of America, ` +
  `Northern California Chapter. ${MHAPUJA_EVENT.tagline}`;

// Same reasoning as the Indra Jatra page: Next merges a parent's openGraph
// block into a child's, so leaving only `description` set here would share
// the root's og:description — which is about the organization, not this
// event. The explicit block gives this page its own card copy.
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/register/mhapuja" },
  openGraph: {
    url: "/register/mhapuja",
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
 * Stripe sends the attendee back here with ?ticket=success|cancelled&code=...
 * Rendering the blank form at that point loses the confirmation entirely, and
 * reads as though nothing happened — which invites a second registration and
 * a second charge.
 */
export default async function RegisterMhaPujaPage({
  searchParams,
}: {
  searchParams: Promise<{ ticket?: string; code?: string }>;
}) {
  const { ticket, code } = await searchParams;
  if (ticket === "success" || ticket === "cancelled") {
    return <MhapujaTicketReturn outcome={ticket} code={code ?? ""} />;
  }
  return <MhapujaForm />;
}
