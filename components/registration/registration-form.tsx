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
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
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
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF8] to-[#F5F5F3] dark:from-[#0F0F0D] dark:to-[#1A1A18] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold lowercase tracking-wide text-[#8B8B85] dark:text-[#A0A09A] mb-2">
            newah organization
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A18] dark:text-[#FAFAF8] mb-2">
            Join us
          </h1>
          <p className="text-base text-[#8B8B85] dark:text-[#A0A09A]">
            Register for food or make a donation
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#1A1A18] rounded-lg shadow-sm border border-[#E8E8E5] dark:border-[#2A2A28] p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-[#1A1A18] dark:text-[#FAFAF8]">
                your information
              </h2>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold lowercase text-[#8B8B85] dark:text-[#A0A09A] mb-2">
                  full name *
                </label>
                <input
                  type="text"
                  {...form.register("fullName")}
                  placeholder="Enter your full name"
                  className="w-full px-0 py-3 border-b-2 border-[#E8E8E5] dark:border-[#2A2A28] bg-transparent text-[#1A1A18] dark:text-[#FAFAF8] placeholder-[#C0C0B8] dark:placeholder-[#666660] focus:outline-none focus:border-b-2 focus:border-[#C41E3A] dark:focus:border-[#C41E3A] transition-colors"
                />
                {form.formState.errors.fullName && (
                  <p className="mt-1 text-sm text-[#C41E3A]">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold lowercase text-[#8B8B85] dark:text-[#A0A09A] mb-2">
                  phone number *
                </label>
                <input
                  type="tel"
                  {...form.register("phone")}
                  placeholder="10-digit number"
                  className="w-full px-0 py-3 border-b-2 border-[#E8E8E5] dark:border-[#2A2A28] bg-transparent text-[#1A1A18] dark:text-[#FAFAF8] placeholder-[#C0C0B8] dark:placeholder-[#666660] focus:outline-none focus:border-b-2 focus:border-[#C41E3A] dark:focus:border-[#C41E3A] transition-colors"
                />
                {form.formState.errors.phone && (
                  <p className="mt-1 text-sm text-[#C41E3A]">{form.formState.errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold lowercase text-[#8B8B85] dark:text-[#A0A09A] mb-2">
                  email address *
                </label>
                <input
                  type="email"
                  {...form.register("email")}
                  placeholder="your@email.com"
                  className="w-full px-0 py-3 border-b-2 border-[#E8E8E5] dark:border-[#2A2A28] bg-transparent text-[#1A1A18] dark:text-[#FAFAF8] placeholder-[#C0C0B8] dark:placeholder-[#666660] focus:outline-none focus:border-b-2 focus:border-[#C41E3A] dark:focus:border-[#C41E3A] transition-colors"
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-[#C41E3A]">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Registration Type Section */}
            <div className="space-y-4 pt-4">
              <h2 className="text-base font-semibold text-[#1A1A18] dark:text-[#FAFAF8]">
                how would you like to help?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Food Button */}
                <button
                  type="button"
                  onClick={() => handleRegistrationTypeChange("FOOD")}
                  className={`p-6 rounded-lg border-2 font-semibold text-lg transition-all min-h-[120px] flex flex-col items-center justify-center gap-2 ${
                    isFoodSelected
                      ? "border-[#C41E3A] bg-[#FEF5F5] dark:bg-[#2A1A1A] text-[#C41E3A]"
                      : "border-[#E8E8E5] dark:border-[#2A2A28] bg-white dark:bg-[#0F0F0D] text-[#1A1A18] dark:text-[#FAFAF8] hover:border-[#C41E3A] dark:hover:border-[#C41E3A]"
                  }`}
                >
                  <span className="text-3xl">🍽</span>
                  <span>Food</span>
                </button>

                {/* Donation Button */}
                <button
                  type="button"
                  onClick={() => handleRegistrationTypeChange("DONATION")}
                  className={`p-6 rounded-lg border-2 font-semibold text-lg transition-all min-h-[120px] flex flex-col items-center justify-center gap-2 ${
                    isDonationSelected
                      ? "border-[#C41E3A] bg-[#FEF5F5] dark:bg-[#2A1A1A] text-[#C41E3A]"
                      : "border-[#E8E8E5] dark:border-[#2A2A28] bg-white dark:bg-[#0F0F0D] text-[#1A1A18] dark:text-[#FAFAF8] hover:border-[#C41E3A] dark:hover:border-[#C41E3A]"
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
              <div className="p-4 bg-[#FEF5F5] dark:bg-[#2A1A1A] border border-[#C41E3A] rounded-lg">
                <p className="text-sm text-[#C41E3A]">{form.formState.errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-[#C41E3A] hover:bg-[#A01830] dark:hover:bg-[#D42940] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>
                  {isFoodSelected ? "registering..." : "redirecting to stripe..."}
                </span>
              ) : (
                <span>{isFoodSelected ? "Register" : "Donate with Stripe"}</span>
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
