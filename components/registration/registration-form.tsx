"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, Registration, FoodRegistration, DonationRegistration } from "@/lib/validation/registration";
import { registerFood, registerDonation } from "@/lib/actions/register";
import FoodSection from "./food-section";
import DonationSection from "./donation-section";
import SuccessScreen from "./success-screen";

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
      numberOfGuests: undefined,
      registrationType: undefined,
      foodOption: "",
      donationAmount: undefined,
    },
  });

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
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] to-[#1A1E3F] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        {/* Header with Full Logo */}
        <div className="mb-12 text-center">
          <div className="mb-8 flex justify-center">
            <img
              src="/images/newah-full-logo.png"
              alt="Newah Organization of America"
              className="h-48 w-auto max-w-full"
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
                  {...form.register("numberOfGuests", { valueAsNumber: true })}
                  placeholder="1"
                  min="1"
                  max="100"
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
                      ? "border-[#FF7A45] bg-[rgba(255,122,69,0.15)] text-white"
                      : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-white hover:border-[rgba(255,122,69,0.5)] hover:bg-[rgba(255,122,69,0.08)]"
                  }`}
                >
                  <span className="text-3xl">🍽</span>
                  <span>Food</span>
                </button>

                {/* Donation Button */}
                <button
                  type="button"
                  onClick={() => handleRegistrationTypeChange("DONATION")}
                  className={`p-6 rounded-2xl border-2 font-semibold text-lg transition-all min-h-[120px] flex flex-col items-center justify-center gap-2 ${
                    isDonationSelected
                      ? "border-[#FF7A45] bg-[rgba(255,122,69,0.15)] text-white"
                      : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-white hover:border-[rgba(255,122,69,0.5)] hover:bg-[rgba(255,122,69,0.08)]"
                  }`}
                >
                  <span className="text-3xl">❤️</span>
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
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-gradient-to-r from-[#FF7A45] to-[#FF9A6A] hover:shadow-[0_12px_32px_rgba(255,122,69,0.4)] text-white font-bold py-4 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_12px_32px_rgba(255,122,69,0.4)] hover:shadow-[0_16px_48px_rgba(255,122,69,0.5)]"
            >
              {isSubmitting ? (
                <span>
                  {isFoodSelected ? "registering..." : isDonationSelected ? "redirecting to stripe..." : "register"}
                </span>
              ) : (
                <span>{isDonationSelected ? "Donate with Stripe" : "Register"}</span>
              )}
            </button>
          </form>
        </div>
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
