"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { registrationSchema, Registration } from "@/lib/validation/registration";
import { formatPhoneAsTyped } from "@/lib/validation/contact";
import { registerAttendee } from "@/lib/actions/register";
import SuccessScreen, { SuccessData } from "./success-screen";
import CauseBanner from "./cause-banner";
import DonationFields from "./donation-fields";
import AdultGuestsFields from "./adult-guests-fields";
import FestivalBackdrop, { FestivalPhotoCredit } from "@/components/ui/festival-backdrop";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import PatasiFrame from "@/components/ui/patasi-frame";
import { CONSENT_TEXT } from "@/lib/legal/org";
import { EVENT } from "@/lib/constants/event";

const fieldClass =
  "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all";

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const form = useForm<Registration>({
    resolver: zodResolver(registrationSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      adultGuests: [],
      coversFee: true,
      broughtFood: false,
      foodDescription: "",
      donationAmount: undefined,
      donationChoice: undefined,
      // Never pre-ticked: consent has to be an affirmative act.
      consentGiven: false,
    },
  });

  // Above the early return below: hooks must run in the same order every render.
  const consentGiven = useWatch({ control: form.control, name: "consentGiven" }) === true;
  const broughtFood = useWatch({ control: form.control, name: "broughtFood" }) === true;

  // The stored sentence, split so the two document names can be links while
  // every character still comes from CONSENT_TEXT.
  const consentParts = CONSENT_TEXT.split(/(Terms and Conditions|Privacy Policy)/);

  // One id per filled-in form, fixed for the life of this page. A resubmit
  // carries the same value so the server can recognise it as the same
  // registration rather than a second attendee.
  const [submissionId] = useState(() => crypto.randomUUID());

  const onSubmit = async (data: Registration) => {
    setIsSubmitting(true);
    try {
      const result = await registerAttendee({ ...data, submissionId });
      if (!result.success) {
        form.setError("root", { message: result.error });
        return;
      }
      // A donation sends them to Stripe; everything else lands on the
      // confirmation screen here.
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      setSuccessData({
        code: result.registrationCode ?? "",
        name: data.fullName ?? "",
        broughtFood: result.broughtFood === true,
        foodDescription: data.foodDescription ?? "",
        donationCents: result.donationCents ?? null,
        guestCount: (data.adultGuests ?? []).filter(
          (guest) => (guest.name ?? "").trim() && (guest.email ?? "").trim(),
        ).length,
        // A donation with no checkout URL means Stripe is not configured.
        paymentPending: Boolean(result.donationCents),
        emailSent: result.emailSent === true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) return <SuccessScreen data={successData} />;

  return (
    <div
      className="relative min-h-screen px-4 py-8 sm:px-6 lg:px-8"
      style={{
        backgroundImage: 'url(/images/registration-backdrop.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />

      <div className="relative mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/images/newah-full-logo-transparent.png"
              alt="Newah Organization of America"
              width={1024}
              height={1024}
              priority
              className="size-32 object-contain"
            />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-white drop-shadow-lg">
            {EVENT.name} Registration
          </h1>
          <p className="text-base text-white drop-shadow font-medium">Join Newah Community</p>
        </div>

        <CauseBanner />

        <div className="mx-auto max-w-md rounded-2xl bg-white shadow-2xl">
          <div className="p-8 md:p-10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">Your Information</h2>

              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-gray-900">Name</label>
                <input id="fullName" type="text" {...form.register("fullName")} placeholder="Your name" className={fieldClass} />
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
                    // Formatted as it is typed, so the shape of the field
                    // tells people what it wants instead of an error after
                    // they submit. Punctuation is stripped before validation.
                    event.target.value = formatPhoneAsTyped(event.target.value);
                    form.register("phone").onChange(event);
                  }}
                />
                {form.formState.errors.phone && (
                  <p className="mt-1 text-sm text-alert">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-900">Email</label>
                <input id="email" type="email" {...form.register("email")} placeholder="you@example.com" className={fieldClass} />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-alert">{form.formState.errors.email.message}</p>
                )}
              </div>

            </div>

            {/* Food: a question, not a category of registration. */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h2 className="text-sm font-semibold text-gray-900">Did you bring any food?</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ].map((option) => {
                  const active = broughtFood === option.value;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => {
                        form.setValue("broughtFood", option.value);
                        if (!option.value) form.setValue("foodDescription", "");
                      }}
                      className={`rounded-lg border-2 py-3 text-base font-semibold transition-all ${
                        active
                          ? "border-blue-500 bg-blue-50 text-blue-900 shadow-md"
                          : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {broughtFood && (
                <div>
                  <label htmlFor="foodDescription" className="mb-2 block text-sm font-semibold text-gray-900">
                    What did you bring?
                  </label>
                  <input
                    id="foodDescription"
                    type="text"
                    {...form.register("foodDescription")}
                    placeholder="e.g. Chatamari, Bara, Samay Baji"
                    className={fieldClass}
                  />
                  {form.formState.errors.foodDescription && (
                    <p className="mt-1 text-sm text-alert">{form.formState.errors.foodDescription.message}</p>
                  )}
                </div>
              )}
            </div>

            <AdultGuestsFields form={form} />

            <DonationFields form={form} />

            {/* Consent gate. The wording lives in lib/legal/org.ts and is stored
                verbatim with the registration. */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" {...form.register("consentGiven")} className="mt-1 size-5 shrink-0 cursor-pointer accent-blue-600" />
                <span className="text-sm leading-relaxed text-gray-700">
                    {/* Rendered FROM CONSENT_TEXT, which is what gets stored, so
                        the record cannot drift from the wording actually shown.
                        Previously the stored sentence opened differently and
                        carried a withdrawal clause this checkbox never
                        displayed. */}
                    {consentParts.map((part, index) =>
                      part === "Terms and Conditions" || part === "Privacy Policy" ? (
                        <Link
                          key={index}
                          href={part === "Privacy Policy" ? "/privacy" : "/terms"}
                          target="_blank"
                          className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-700"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="inline size-5 animate-spin mr-2" aria-hidden />
                  <span>Registering&hellip;</span>
                </>
              ) : (
                <span>Complete Registration</span>
              )}
            </button>
          </form>
          </div>
        </div>

        <nav className="relative mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white drop-shadow">
          <Link href="/privacy" className="underline underline-offset-2 hover:text-gray-200">Privacy Policy</Link>
          <Link href="/terms" className="underline underline-offset-2 hover:text-gray-200">Terms and Conditions</Link>
        </nav>

        <div className="relative mt-4 text-center text-xs text-white drop-shadow" />
      </div>
    </div>
  );
}
