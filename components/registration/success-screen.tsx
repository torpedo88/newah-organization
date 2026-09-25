"use client";

import Link from "next/link";
import FestivalBackdrop, { FestivalPhotoCredit } from "@/components/ui/festival-backdrop";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { EVENT } from "@/lib/constants/event";
import { ORG } from "@/lib/legal/org";
import { toDollars } from "@/lib/payments/fees";

export type SuccessData = {
  code: string;
  name: string;
  broughtFood: boolean;
  foodDescription: string;
  donationCents: number | null;
  /** Number of additional adults whose name tags are also waiting. */
  guestCount: number;
  /** A donation exists but was never charged, because Stripe is unconfigured. */
  paymentPending: boolean;
  /** Whether a confirmation email actually went out. */
  emailSent: boolean;
};

export default function SuccessScreen({ data }: { data: SuccessData }) {
  const donated = typeof data.donationCents === "number" && data.donationCents > 0;

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <FestivalBackdrop />
      <div className="relative mx-auto w-full max-w-2xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-8 text-center backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]">
          <h1 className="mb-2 text-3xl font-bold text-white">You&rsquo;re registered</h1>
          <p className="mb-8 text-lg text-white/70">
            Thank you{data.name ? `, ${data.name}` : ""}. We look forward to seeing you.
          </p>

          <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.06] p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/55">
              Registration number
            </p>
            <p className="font-mono text-3xl font-bold text-white">{data.code}</p>
          </div>

          {/* The instruction everyone needs, given the most weight on the page. */}
          <div className="mb-8 rounded-2xl border-2 border-patasi bg-patasi/15 p-6 text-left">
            <p className="mb-1 font-bold text-white">When you arrive</p>
            <p className="text-white/85">
              Please go to the <strong className="text-white">registration desk</strong> to pick up
              {data.guestCount > 0 ? " your name tags" : " your name tag"}. Show this registration
              number or simply give your name.
            </p>
            {data.guestCount > 0 && (
              <p className="mt-2 text-sm text-white/70">
                {data.guestCount + 1} name tags will be ready for your party.
              </p>
            )}
          </div>

          {data.broughtFood && (
            <p className="mb-6 text-white/80">
              Thank you for bringing food
              {data.foodDescription ? (
                <>
                  {" "}&mdash; <span className="font-semibold text-white">{data.foodDescription}</span>
                </>
              ) : null}
              . Let the registration desk know when you arrive so we can set it out.
            </p>
          )}

          {donated && !data.paymentPending && (
            <div className="mb-6 rounded-2xl border border-lun/50 bg-lun/10 p-5 text-left">
              <p className="font-bold text-white">
                Thank you for your donation of ${toDollars(data.donationCents!)}.
              </p>
              <p className="mt-1 text-sm text-white/75">
                After the event&rsquo;s expenses are covered, all remaining proceeds are donated to
                the {EVENT.fundName}.
              </p>
            </div>
          )}

          {donated && data.paymentPending && (
            <div className="mb-6 rounded-2xl border border-lun/50 bg-lun/10 p-5 text-left">
              <p className="font-bold text-white">
                Your donation of ${toDollars(data.donationCents!)} is recorded but not yet paid.
              </p>
              <p className="mt-1 text-sm text-white/75">
                Online payment is not available at the moment. Your registration is confirmed, and
                the organization will be in touch at {ORG.contactEmail} about completing the
                donation.
              </p>
            </div>
          )}

          <p className="mb-8 text-sm text-white/65">
            {data.emailSent
              ? "A confirmation has been sent to your email."
              : "Please keep a note of your registration number \u2014 we were not able to send a confirmation email."}
          </p>

          <LiquidButton asChild size="xl" className="text-white">
            <Link href="/">Done</Link>
          </LiquidButton>
        </div>

        <FestivalPhotoCredit className="mt-8 text-center text-xs text-white/55" />
      </div>
    </div>
  );
}
