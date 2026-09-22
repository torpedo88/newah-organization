import Link from "next/link";
import FestivalBackdrop from "@/components/ui/festival-backdrop";
import { ORG } from "@/lib/legal/org";

/**
 * What the donor sees on returning from Stripe.
 *
 * Deliberately careful about what it claims. The query string that brings
 * someone here is typed by Stripe's redirect but can be typed by anyone, so
 * nothing on this page asserts that money moved — only the webhook, against a
 * Stripe signature, establishes payment. What this page can honestly say is
 * that the registration exists and what happens next.
 */
export default function CheckoutReturn({
  outcome,
  code,
}: {
  outcome: "success" | "cancelled";
  code: string;
}) {
  // Only render a code that looks like one we issued, rather than echoing
  // whatever arrives in the URL back onto the page.
  const shown = /^NOA-\d{4}-[A-Z0-9]{6}$/.test(code) ? code : null;
  const completed = outcome === "success";

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <FestivalBackdrop />
      <div className="relative mx-auto w-full max-w-2xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-8 text-center backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]">
          <h1 className="mb-2 text-3xl font-bold text-white">
            {completed ? "Thank you" : "Payment cancelled"}
          </h1>
          <p className="mb-8 text-lg text-white/70">
            {completed
              ? "Your registration is confirmed."
              : "Your registration is still confirmed — only the donation was cancelled."}
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
              your name {shown ? "tags" : "tag"}. Show this registration number or simply give your
              name.
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-lun/50 bg-lun/10 p-5 text-left">
            {completed ? (
              <>
                <p className="font-bold text-white">Your donation is being confirmed.</p>
                <p className="mt-1 text-sm text-white/75">
                  Card payments are confirmed by our payment processor rather than by this page, so
                  it may take a moment to settle. You will receive a receipt from Stripe by email.
                  If anything looks wrong, write to {ORG.contactEmail}.
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-white">No payment was taken.</p>
                <p className="mt-1 text-sm text-white/75">
                  You can still donate at the registration desk on the day, or write to{" "}
                  {ORG.contactEmail}. There is no need to register a second time.
                </p>
              </>
            )}
          </div>

          <p className="text-sm text-white/55">
            <Link href="/" className="underline underline-offset-4 hover:text-white/80">
              Back to the home page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
