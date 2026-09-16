"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
      registrationType: undefined as any,
      foodOption: "",
      donationAmount: 0,
    },
  });

  const handleRegistrationTypeChange = (type: "FOOD" | "DONATION") => {
    setRegistrationType(type);
    form.setValue("registrationType", type);

    if (type === "FOOD") {
      form.setValue("donationAmount", 0);
    } else {
      form.setValue("foodOption", "");
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
          // Redirect to Stripe
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Newah Organization
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">Registration</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Basic Information</h2>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...form.register("fullName")}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {form.formState.errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  {...form.register("phone")}
                  placeholder="10-digit number (e.g., 5101234567)"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {form.formState.errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...form.register("email")}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Registration Type Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">How would you like to register?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Food Card */}
                <button
                  type="button"
                  onClick={() => handleRegistrationTypeChange("FOOD")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isFoodSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500"
                  }`}
                >
                  <div className="text-2xl mb-2">🍽</div>
                  <p className="font-semibold text-slate-900 dark:text-white">Food</p>
                </button>

                {/* Donation Card */}
                <button
                  type="button"
                  onClick={() => handleRegistrationTypeChange("DONATION")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isDonationSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500"
                  }`}
                >
                  <div className="text-2xl mb-2">❤️</div>
                  <p className="font-semibold text-slate-900 dark:text-white">Donation</p>
                </button>
              </div>
            </div>

            {/* Conditional Sections */}
            {isFoodSelected && <FoodSection form={form} />}
            {isDonationSelected && <DonationSection form={form} />}

            {/* Error Message */}
            {form.formState.errors.root && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-400">{form.formState.errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>
                  {isFoodSelected ? "Registering..." : "Redirecting to Stripe..."}
                </span>
              ) : (
                <span>{isFoodSelected ? "Register" : "Donate with Stripe"}</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
