"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Minus, Plus } from "lucide-react";
import {
  mhapujaRegistrationSchema,
  MhapujaRegistration,
} from "@/lib/validation/mhapuja-registration";
import { formatPhoneAsTyped } from "@/lib/validation/contact";
import { registerMhaPuja } from "@/lib/actions/register-mhapuja";
import NhuDayaBackdrop from "@/components/ui/nhu-daya-backdrop";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import PatasiFrame from "@/components/ui/patasi-frame";
import { CONSENT_TEXT } from "@/lib/legal/org";
import { settlement, toDollars } from "@/lib/payments/fees";
import {
  MHAPUJA_ADULT_PRICE_CENTS,
  MHAPUJA_CHILD_PRICE_CENTS,
  MHAPUJA_CHILD_AGE_CEILING,
  MHAPUJA_EVENT,
  MHAPUJA_MAX_PER_TIER,
} from "@/lib/constants/mhapuja";

/**
 * Mha Puja registration form.
 *
 * Mirrors the Indra Jatra registration form in look, but drops the donation
 * section and the attending-adults list. Tickets are the whole point: adult
 * and child counts with a live total above the submit button, so a change
 * to either count has an immediate visible consequence.
 */
const fieldClass =
  "w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/15 text-white placeholder-white/50 focus:outline-none focus:border-patasi focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_rgba(192,16,43,0.35)] transition-all";

const ADULT_PRICE = MHAPUJA_ADULT_PRICE_CENTS / 100;
const CHILD_PRICE = MHAPUJA_CHILD_PRICE_CENTS / 100;

export default function MhapujaForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coversFee, setCoversFee] = useState(false);

  const form = useForm<MhapujaRegistration>({
    resolver: zodResolver(mhapujaRegistrationSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      adultCount: 1,
      childCount: 0,
      // Never pre-ticked: consent has to be an affirmative act.
      consentGiven: false,
    },
  });

  // Above the early return. Hooks must run in the same order every render.
  const adultCount = useWatch({ control: form.control, name: "adultCount" }) ?? 0;
  const childCount = useWatch({ control: form.control, name: "childCount" }) ?? 0;
  const consentGiven = useWatch({ control: form.control, name: "consentGiven" }) === true;

  const totalCents = (adultCount * MHAPUJA_ADULT_PRICE_CENTS + childCount * MHAPUJA_CHILD_PRICE_CENTS);
  const total = totalCents / 100;
  const { chargedCents, toOrganizationCents, feeCents } = settlement(totalCents, coversFee);

  // Split so the two document names can be links while every character of
  // the sentence still comes from CONSENT_TEXT.
  const consentParts = CONSENT_TEXT.split(/(Terms and Conditions|Privacy Policy)/);

  // One id per filled-in form, fixed for the life of this page. A resubmit
  // carries the same value so the server recognises it as the same
  // registration rather than a second attendee.
  const [submissionId] = useState(() => crypto.randomUUID());

  const onSubmit = async (data: MhapujaRegistration) => {
    setIsSubmitting(true);
    try {
      const result = await registerMhaPuja({ ...data, submissionId, coversFee });
      if (!result.success) {
        if (result.error?.toLowerCase().includes("email")) {
          form.setError("email", { message: result.error });
        } else {
          form.setError("root", { message: result.error });
        }
        return;
      }
      // Payment is required, so there is always a checkout URL on success.
      // The alreadyRegistered branch comes back without a URL — in that case
      // land on a short confirmation here instead of a Stripe redirect.
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      form.setError("root", {
        message:
          "You are already registered under this email. Please check your inbox for the original " +
          "confirmation, or contact us if you cannot find it.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <NhuDayaBackdrop />
      <div className="relative mx-auto max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/newah-full-logo-transparent.png"
              alt="Newah Organization of America"
              width={1024}
              height={1024}
              priority
              className="size-40 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
            />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-white">
            {MHAPUJA_EVENT.name} Registration
          </h1>
          <p className="text-lg font-semibold text-lun">{MHAPUJA_EVENT.nepalBhasaTitle}</p>
          <p className="mt-2 text-base text-white/70">{MHAPUJA_EVENT.tagline}</p>
        </div>

        <PatasiFrame>
          <div className="bg-haku/35 p-8 backdrop-blur-[3px] md:p-10">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white">Your Information</h2>

                <div>
                  <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-white">Name</label>
                  <input
                    id="fullName"
                    type="text"
                    {...form.register("fullName")}
                    placeholder="Your name"
                    className={fieldClass}
                  />
                  {form.formState.errors.fullName && (
                    <p className="mt-1 text-sm text-alert">{form.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-white">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(555) 123-4567"
                    className={fieldClass}
                    {...form.register("phone")}
                    onChange={(event) => {
                      event.target.value = formatPhoneAsTyped(event.target.value);
                      form.register("phone").onChange(event);
                    }}
                  />
                  {form.formState.errors.phone && (
                    <p className="mt-1 text-sm text-alert">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-white">Email</label>
                  <input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                  {form.formState.errors.email && (
                    <p className="mt-1 text-sm text-alert">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-5 border-t border-white/10 pt-6">
                <h2 className="text-sm font-semibold text-white">Tickets</h2>

                <TicketStepper
                  label={`Adults (${MHAPUJA_CHILD_AGE_CEILING} and over)`}
                  priceLabel={`$${ADULT_PRICE} each`}
                  value={adultCount}
                  onChange={(v) => form.setValue("adultCount", v, { shouldValidate: true })}
                />
                {form.formState.errors.adultCount && (
                  <p className="-mt-3 text-sm text-alert">{form.formState.errors.adultCount.message}</p>
                )}

                <TicketStepper
                  label={`Children (under ${MHAPUJA_CHILD_AGE_CEILING})`}
                  priceLabel={`$${CHILD_PRICE} each`}
                  value={childCount}
                  onChange={(v) => form.setValue("childCount", v, { shouldValidate: true })}
                />
                {form.formState.errors.childCount && (
                  <p className="-mt-3 text-sm text-alert">{form.formState.errors.childCount.message}</p>
                )}

                <div className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-3">
                  <div className="flex justify-between text-sm text-white">
                    <span>Ticket subtotal:</span>
                    <span>${toDollars(totalCents)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Processing fee:</span>
                    <span>${toDollars(feeCents)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-medium text-white">
                    <span>You will be charged:</span>
                    <span>${toDollars(chargedCents)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Organization receives:</span>
                    <span>${toDollars(toOrganizationCents)}</span>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={coversFee}
                    onChange={(e) => setCoversFee(e.target.checked)}
                    className="size-4 rounded accent-patasi cursor-pointer"
                  />
                  <span className="text-sm text-white/80">
                    {coversFee
                      ? "I'm covering the processing fee so the organization gets the full amount"
                      : "Deduct processing fee from the organization's portion"}
                  </span>
                </label>

                <p className="text-xs text-white/55">
                  Payment is taken securely by Stripe at the next step. Card only. Prices are
                  recorded at the time of registration — a future price change will not affect
                  what you paid.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    {...form.register("consentGiven")}
                    className="mt-1 size-5 shrink-0 cursor-pointer accent-patasi"
                  />
                  <span className="text-sm leading-relaxed text-white/80">
                    {consentParts.map((part, index) =>
                      part === "Terms and Conditions" || part === "Privacy Policy" ? (
                        <Link
                          key={index}
                          href={part === "Privacy Policy" ? "/privacy" : "/terms"}
                          target="_blank"
                          className="font-semibold text-white underline underline-offset-2"
                        >
                          {part}
                        </Link>
                      ) : (
                        <span key={index}>{part}</span>
                      ),
                    )}
                  </span>
                </label>
                {!consentGiven && form.formState.isSubmitted && (
                  <p className="mt-2 text-sm text-alert">Please agree before submitting.</p>
                )}
              </div>

              {form.formState.errors.root && (
                <div className="rounded-lg border border-alert bg-alert/10 p-4">
                  <p className="text-sm text-alert">{form.formState.errors.root.message}</p>
                </div>
              )}

              <LiquidButton
                type="submit"
                disabled={isSubmitting}
                size="xxl"
                className="w-full text-white"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin" aria-hidden />
                    <span>Taking you to payment&hellip;</span>
                  </>
                ) : (
                  <span>Pay ${toDollars(chargedCents)} and register</span>
                )}
              </LiquidButton>
            </form>
          </div>
        </PatasiFrame>

        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/50">
          <Link href="/privacy" className="underline underline-offset-2 hover:text-white/80">Privacy Policy</Link>
          <Link href="/terms" className="underline underline-offset-2 hover:text-white/80">Terms and Conditions</Link>
        </nav>

      </div>
    </div>
  );
}

/** +/- stepper. Clamped so a value past the tier limit never leaves this control. */
function TicketStepper({
  label,
  priceLabel,
  value,
  onChange,
}: {
  label: string;
  priceLabel: string;
  value: number;
  onChange: (next: number) => void;
}) {
  const clamp = (n: number) => Math.max(0, Math.min(MHAPUJA_MAX_PER_TIER, n));
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-white/55">{priceLabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= 0}
          aria-label="Decrease"
          className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white transition hover:bg-white/[0.14] disabled:opacity-40"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-6 text-center text-lg font-bold text-white">{value}</span>
        <button
          type="button"
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= MHAPUJA_MAX_PER_TIER}
          aria-label="Increase"
          className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white transition hover:bg-white/[0.14] disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
