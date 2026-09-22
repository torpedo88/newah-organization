"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, Registration, FoodRegistration, DonationRegistration } from "@/lib/validation/registration";
import { registerFood, registerDonation } from "@/lib/actions/register";
import FoodSection from "./food-section";
import DonationSection from "./donation-section";
import SuccessScreen from "./success-screen";
import FestivalBackdrop, { FestivalPhotoCredit } from "@/components/ui/festival-backdrop";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { UtensilsCrossed, HeartHandshake, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { ORG } from "@/lib/legal/org";

export default function RegistrationForm() {
  const [registrationType, setRegistrationType] = useState<"FOOD" | "DONATION" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    type: "FOOD" | "DONATION";
    code: string;
    data: FoodRegistration | DonationRegistration;
  } | null>(null);

  const form = useForm<Registration>({
    resolver: zodResolver(registrationSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      numberOfGuests: 1,
      registrationType: undefined,
      foodOption: "",
      donationAmount: undefined,
      // Never pre-ticked: consent has to be an affirmative act.
      consentGiven: false,
    },
  });

  // Above the early return below: hooks must run in the same order every render.
  const consentGiven =
    useWatch({ control: form.control, name: "consentGiven" }) === true;

  const handleRegistrationTypeChange = (type: "FOOD" | "DONATION") => {
    setRegistrationType(type);
    form.setValue("registrationType", type);

    if (type === "FOOD") {
      form.setValue("foodOption", "");
      form.setValue("donationAmount", undefined);
    } else {
      form.setValue("foodOption", "");
      form.setValue("donationAmount", undefined);
    }
  };

  const onSubmit = async (data: Registration) => {
    setIsSubmitting(true);
    try {
      if (data.registrationType === "FOOD") {
        const result = await registerFood(data as FoodRegistration);
        if (result.success && result.registrationCode) {
          setSuccessData({
            type: "FOOD",
            code: result.registrationCode,
            data: data as FoodRegistration,
          });
        } else {
          form.setError("root", { message: result.error });
        }
      } else if (data.registrationType === "DONATION") {
        const result = await registerDonation(data as DonationRegistration);
        if (result.success && result.sessionUrl) {
          window.location.href = result.sessionUrl;
        } else if (result.sessionUrl) {
          form.setError("root", { message: "Could not create Stripe session" });
        } else {
          form.setError("root", { message: result.error });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return <SuccessScreen type={successData.type} code={successData.code} data={successData.data} />;
  }

  const isFoodSelected = registrationType === "FOOD";
  const isDonationSelected = registrationType === "DONATION";
  const canSubmit = form.formState.isValid && !isSubmitting;

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <FestivalBackdrop />
      <div className="relative mx-auto max-w-md">
        {/* Header with Full Logo */}
        <div className="mb-12 text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/newah-full-logo-transparent.png"
              alt="Newah Organization of America"
              width={1024}
              height={1024}
              priority
              className="size-44 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Register
          </h1>
          <p className="text-base text-[rgba(255,255,255,0.7)]">
            Join Newah Community
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[rgba(255,255,255,0.08)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-3xl p-8 md:p-10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-white">
                Your Information
              </h2>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  {...form.register("fullName")}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#FF7A45] focus:bg-[rgba(255,255,255,0.12)] focus:shadow-[0_0_0_4px_rgba(255,122,69,0.2)] transition-all"
                />
                {form.formState.errors.fullName && (
                  <p className="mt-1 text-sm text-[#FF3B30]">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...form.register("phone")}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#FF7A45] focus:bg-[rgba(255,255,255,0.12)] focus:shadow-[0_0_0_4px_rgba(255,122,69,0.2)] transition-all"
                />
                {form.formState.errors.phone && (
                  <p className="mt-1 text-sm text-[#FF3B30]">{form.formState.errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...form.register("email")}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#FF7A45] focus:bg-[rgba(255,255,255,0.12)] focus:shadow-[0_0_0_4px_rgba(255,122,69,0.2)] transition-all"
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-[#FF3B30]">{form.formState.errors.email.message}</p>
                )}
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  {...form.register("numberOfGuests", {
                    valueAsNumber: true,
                    setValueAs: (val) => (val === "" || val === null ? 1 : Number(val)),
                  })}
                  placeholder="1"
                  min="1"
                  max="100"
                  defaultValue={1}
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#FF7A45] focus:bg-[rgba(255,255,255,0.12)] focus:shadow-[0_0_0_4px_rgba(255,122,69,0.2)] transition-all"
                />
                {form.formState.errors.numberOfGuests && (
                  <p className="mt-1 text-sm text-[#FF3B30]">{form.formState.errors.numberOfGuests.message}</p>
                )}
              </div>
            </div>

            {/* Registration Type Section */}
            <div className="space-y-4 pt-6">
              <h2 className="text-sm font-semibold text-white">
                How would you like to help?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Food Button */}
                <button
                  type="button"
                  onClick={() => handleRegistrationTypeChange("FOOD")}
                  className={`p-6 rounded-2xl border-2 font-semibold text-lg transition-all min-h-[120px] flex flex-col items-center justify-center gap-2 ${
                    isFoodSelected
                      ? "border-[#FF7A45] bg-[linear-gradient(140deg,rgba(242,85,28,0.4),rgba(255,168,106,0.16))] text-white shadow-[0_14px_36px_-16px_rgba(255,122,69,0.95)]"
                      : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] text-white backdrop-blur-sm hover:border-[rgba(255,122,69,0.5)] hover:bg-[rgba(255,122,69,0.1)]"
                  }`}
                >
                  <UtensilsCrossed className="size-8" strokeWidth={1.5} aria-hidden />
                  <span>Food</span>
                </button>

                {/* Donation Button */}
                <button
                  type="button"
                  onClick={() => handleRegistrationTypeChange("DONATION")}
                  className={`p-6 rounded-2xl border-2 font-semibold text-lg transition-all min-h-[120px] flex flex-col items-center justify-center gap-2 ${
                    isDonationSelected
                      ? "border-[#FF7A45] bg-[linear-gradient(140deg,rgba(242,85,28,0.4),rgba(255,168,106,0.16))] text-white shadow-[0_14px_36px_-16px_rgba(255,122,69,0.95)]"
                      : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] text-white backdrop-blur-sm hover:border-[rgba(255,122,69,0.5)] hover:bg-[rgba(255,122,69,0.1)]"
                  }`}
                >
                  <HeartHandshake className="size-8" strokeWidth={1.5} aria-hidden />
                  <span>Donation</span>
                </button>
              </div>
            </div>

            {/* Conditional Sections with fade transition */}
            {isFoodSelected && (
              <div className="animate-fade-in space-y-6 pt-4">
                <FoodSection form={form} />
              </div>
            )}
            {isDonationSelected && (
              <div className="animate-fade-in space-y-6 pt-4">
                <DonationSection form={form} />
              </div>
            )}

            {/* Error Message */}
            {form.formState.errors.root && (
              <div className="p-4 bg-[rgba(255,59,48,0.1)] border border-[#FF3B30] rounded-lg">
                <p className="text-sm text-[#FF3B30]">{form.formState.errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            {/* Consent gate. The wording lives in lib/legal/org.ts and is stored
                verbatim with the registration, so the organization can show
                exactly what was agreed to and when. */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  {...form.register("consentGiven")}
                  className="mt-1 size-5 shrink-0 cursor-pointer accent-[#FF7A45]"
                />
                <span className="text-sm leading-relaxed text-white/80">
                  I agree to the{" "}
                  <Link href="/terms" target="_blank" className="font-semibold text-white underline underline-offset-2">
                    Terms and Conditions
                  </Link>{" "}
                  and the{" "}
                  <Link href="/privacy" target="_blank" className="font-semibold text-white underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  , and I consent to {ORG.name} using the information I provide to contact
                  me about requests for support, membership drives, upcoming and future
                  events, and other communications from the organization. I understand I
                  can withdraw this consent at any time by emailing{" "}
                  <span className="font-semibold text-white">{ORG.contactEmail}</span>.
                </span>
              </label>
              {!consentGiven && form.formState.isSubmitted && (
                <p className="mt-2 text-sm text-[#FF3B30]">
                  Please agree before submitting.
                </p>
              )}
            </div>

            <LiquidButton type="submit" disabled={!canSubmit} size="xxl" className="w-full text-white">
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" aria-hidden />
                  <span>
                    {isFoodSelected
                      ? "Registering\u2026"
                      : isDonationSelected
                        ? "Redirecting to Stripe\u2026"
                        : "Working\u2026"}
                  </span>
                </>
              ) : (
                <span>{isDonationSelected ? "Donate with Stripe" : "Register"}</span>
              )}
            </LiquidButton>
          </form>
        </div>

        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/50">
          <Link href="/privacy" className="underline underline-offset-2 hover:text-white/80">
            Privacy Policy
          </Link>
          <Link href="/terms" className="underline underline-offset-2 hover:text-white/80">
            Terms and Conditions
          </Link>
        </nav>

        <FestivalPhotoCredit className="mt-4 text-center text-xs text-white/40" />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
