"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { DONATION_AMOUNTS } from "@/lib/constants/food";
import { Registration } from "@/lib/validation/registration";

interface DonationSectionProps {
  form: UseFormReturn<Registration>;
}

export default function DonationSection({ form }: DonationSectionProps) {
  const [customAmount, setCustomAmount] = useState("");
  const selectedAmount = form.watch("donationAmount");

  const handlePredefinedAmount = (amount: number) => {
    form.setValue("donationAmount", amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    if (value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue > 0) {
        form.setValue("donationAmount", numValue);
      }
    }
  };

  const donationError = (form.formState.errors as any).donationAmount;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-[#1A1A18] dark:text-[#FAFAF8] mb-4">
          donation amount *
        </h2>

        {/* Predefined Amounts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {DONATION_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handlePredefinedAmount(amount)}
              className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                selectedAmount === amount
                  ? "border-[#C41E3A] bg-[#C41E3A] text-white dark:bg-[#C41E3A]"
                  : "border-[#E8E8E5] dark:border-[#2A2A28] bg-white dark:bg-[#0F0F0D] text-[#1A1A18] dark:text-[#FAFAF8] hover:border-[#C41E3A]"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div>
          <label className="block text-sm font-semibold lowercase text-[#8B8B85] dark:text-[#A0A09A] mb-2">
            other amount
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[#1A1A18] dark:text-[#FAFAF8] font-medium">$</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => handleCustomAmount(e.target.value)}
              placeholder="Enter custom amount"
              min="1"
              max="10000"
              step="0.01"
              className="flex-1 px-0 py-3 border-b-2 border-[#E8E8E5] dark:border-[#2A2A28] bg-transparent text-[#1A1A18] dark:text-[#FAFAF8] placeholder-[#C0C0B8] dark:placeholder-[#666660] focus:outline-none focus:border-b-2 focus:border-[#C41E3A] dark:focus:border-[#C41E3A] transition-colors"
            />
          </div>
        </div>

        {donationError && (
          <p className="mt-2 text-sm text-[#C41E3A]">{donationError.message}</p>
        )}
      </div>

      {/* Summary */}
      {selectedAmount && (
        <div className="p-4 bg-[#2D5016] bg-opacity-10 dark:bg-opacity-20 border border-[#2D5016] rounded-lg">
          <p className="text-sm text-[#2D5016] dark:text-[#7FD876]">
            You are donating <span className="font-semibold">${selectedAmount.toFixed(2)}</span> to support Newah Organization.
          </p>
        </div>
      )}
    </div>
  );
}
