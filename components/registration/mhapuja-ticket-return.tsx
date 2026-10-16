import Link from "next/link";
import NhuDayaBackdrop from "@/components/ui/nhu-daya-backdrop";
import { ORG } from "@/lib/legal/org";

/**
 * What the attendee sees on returning from Stripe for a Mha Puja ticket.
 *
 * Deliberately careful about what it claims, for the same reason the Indra
 * Jatra return screen is: the ?ticket=success query string is TYPED by Stripe
 * but can be typed by anyone. Nothing on this page asserts the money moved —
 * only the webhook, against a Stripe signature, establishes payment. What it
 * can honestly say is what the registration is and what happens next.
 *
 * The one meaningful difference from the Indra Jatra return: a Mha Puja
 * registration without payment is NOT a valid ticket, so the cancelled copy
 * tells the registrant their tickets are not yet held, and offers the retry.
 */
export default function MhapujaTicketReturn({
  outcome,
  code,
}: {
  outcome: "success" | "cancelled";
  code: string;
}) {
  // Only render a code that matches the format THIS flow issues (MHP-YYYY-XXXXXX)
  // rather than echoing whatever arrives in the URL back onto the page.
  const shown = /^MHP-\d{4}-[A-Z0-9]{6}$/.test(code) ? code : null;
  const completed = outcome === "success";

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <NhuDayaBackdrop />
      <div className="relative mx-auto w-full max-w-2xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-8 text-center backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]">
          <h1 className="mb-2 text-3xl font-bold text-white">
            {completed ? "Thank you" : "Payment cancelled"}
          </h1>
          <p className="mb-8 text-lg text-white/70">
            {completed
              ? "Your Mha Puja tickets are being confirmed."
              : "No tickets were purchased. Nothing was charged."}
          </p>

          {shown && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.06] p-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/55">
                Registration number
              </p>
              <p className="font-mono text-3xl font-bold text-white">{shown}</p>
            </div>
          )}

          <div className="mb-8 rounded-2xl border-2 border-patasi bg-patasi/15 p-6 text-left">
            <p className="mb-1 font-bold text-white">When you arrive</p>
            <p className="text-white/85">
              Please go to the <strong className="text-white">registration desk</strong> to pick up
              your tickets. Show this registration number or simply give your name.
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-lun/50 bg-lun/10 p-5 text-left">
            {completed ? (
              <>
                <p className="font-bold text-white">Your payment is being confirmed.</p>
                <p className="mt-1 text-sm text-white/75">
                  Card payments are confirmed by our payment processor rather than by this page, so
                  it may take a moment to settle. You will receive a receipt from Stripe by email,
                  and a confirmation from us once the payment is recorded. If anything looks wrong,
                  write to {ORG.contactEmail}.
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-white">Your tickets are not yet held.</p>
                <p className="mt-1 text-sm text-white/75">
                  Payment is what reserves your Mha Puja tickets. You can retry from the
                  registration page below, or write to {ORG.contactEmail} if you have trouble.
                </p>
              </>
            )}
          </div>

          <p className="text-sm text-white/55">
            <Link
              href={completed ? "/" : "/register/mhapuja"}
              className="underline underline-offset-4 hover:text-white/80"
            >
              {completed ? "Back to the home page" : "Retry registration"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
