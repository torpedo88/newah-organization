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
    <div className="min-h-screen bg-white dark:bg-[#0A0E27] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        {/* Header with Logo */}
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF7A45] to-[#FF6B35] flex items-center justify-center shadow-lg">
              <img
                src="/images/newah-logo.png"
                alt="Newah Organization Logo"
                className="h-16 w-auto"
              />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0A0E27] dark:text-white mb-2">
            Registration
          </h1>
          <p className="text-base text-[#666666] dark:text-[#B0B0B0]">
            Register for food or make a donation
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-transparent p-0">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-[#0A0E27] dark:text-white">
                Your Information
              </h2>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-[#0A0E27] dark:text-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  {...form.register("fullName")}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F0F7] dark:bg-[#1a2a3a] border border-[#E8F0F7] dark:border-[#2a3a4a] text-[#0A0E27] dark:text-white placeholder-[#7a8a9a] dark:placeholder-[#8a9aaa] focus:outline-none focus:border-[#FF7A45] transition-colors"
                />
                {form.formState.errors.fullName && (
                  <p className="mt-1 text-sm text-[#FF3B30] dark:text-[#FF453A]">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-[#0A0E27] dark:text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...form.register("phone")}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F0F7] dark:bg-[#1a2a3a] border border-[#E8F0F7] dark:border-[#2a3a4a] text-[#0A0E27] dark:text-white placeholder-[#7a8a9a] dark:placeholder-[#8a9aaa] focus:outline-none focus:border-[#FF7A45] transition-colors"
                />
                {form.formState.errors.phone && (
                  <p className="mt-1 text-sm text-[#FF3B30] dark:text-[#FF453A]">{form.formState.errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#0A0E27] dark:text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...form.register("email")}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F0F7] dark:bg-[#1a2a3a] border border-[#E8F0F7] dark:border-[#2a3a4a] text-[#0A0E27] dark:text-white placeholder-[#7a8a9a] dark:placeholder-[#8a9aaa] focus:outline-none focus:border-[#FF7A45] transition-colors"
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-[#FF3B30] dark:text-[#FF453A]">{form.formState.errors.email.message}</p>
                )}
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-semibold text-[#0A0E27] dark:text-white mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  {...form.register("numberOfGuests", { valueAsNumber: true })}
                  placeholder="1"
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F0F7] dark:bg-[#1a2a3a] border border-[#E8F0F7] dark:border-[#2a3a4a] text-[#0A0E27] dark:text-white placeholder-[#7a8a9a] dark:placeholder-[#8a9aaa] focus:outline-none focus:border-[#FF7A45] transition-colors"
                />
                {form.formState.errors.numberOfGuests && (
                  <p className="mt-1 text-sm text-[#FF3B30] dark:text-[#FF453A]">{form.formState.errors.numberOfGuests.message}</p>
                )}
              </div>
            </div>

            {/* Registration Type Section */}
            <div className="space-y-4 pt-6">
              <h2 className="text-sm font-semibold text-[#0A0E27] dark:text-white">
                How Would You Like to Help?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Food Button */}
                <button
                  type="button"
                  onClick={() => handleRegistrationTypeChange("FOOD")}
                  className={`p-6 rounded-lg border-2 font-semibold text-lg transition-all min-h-[120px] flex flex-col items-center justify-center gap-2 ${
                    isFoodSelected
                      ? "border-[#FF7A45] bg-[#FFF3ED] dark:bg-[#3a2820] text-[#FF7A45]"
                      : "border-[#E5E5E7] dark:border-[#2A2E4E] bg-white dark:bg-[#0A0E27] text-[#0A0E27] dark:text-white hover:border-[#FF7A45] dark:hover:border-[#FF7A45]"
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
                      ? "border-[#FF7A45] bg-[#FFF3ED] dark:bg-[#3a2820] text-[#FF7A45]"
                      : "border-[#E5E5E7] dark:border-[#2A2E4E] bg-white dark:bg-[#0A0E27] text-[#0A0E27] dark:text-white hover:border-[#FF7A45] dark:hover:border-[#FF7A45]"
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
              <div className="p-4 bg-[#FFF0F0] dark:bg-[#3E1F1F] border border-[#FF3B30] dark:border-[#FF453A] rounded-lg">
                <p className="text-sm text-[#FF3B30] dark:text-[#FF453A]">{form.formState.errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-[#FF7A45] hover:bg-[#FF6B35] dark:hover:bg-[#FF8555] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
