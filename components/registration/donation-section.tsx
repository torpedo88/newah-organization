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
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#666666] dark:text-[#B0B0B0] mb-4">
          Donation Amount *
        </h2>

        {/* Predefined Amounts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {DONATION_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handlePredefinedAmount(amount)}
              className={`p-3 rounded-lg border font-semibold transition-all ${
                selectedAmount === amount
                  ? "border-[#9D4EDD] bg-[#9D4EDD] text-white dark:bg-[#9D4EDD]"
                  : "border-[#E5E5E7] dark:border-[#2A2E4E] bg-white dark:bg-[#161B35] text-[#0A0E27] dark:text-white hover:border-[#9D4EDD]"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#999999] dark:text-[#808090] mb-3">
            Other Amount
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[#0A0E27] dark:text-white font-medium">$</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => handleCustomAmount(e.target.value)}
              placeholder="Enter custom amount"
              min="1"
              max="10000"
              step="0.01"
              className="flex-1 px-0 py-2 border-b border-[#E5E5E7] dark:border-[#2A2E4E] bg-transparent text-[#0A0E27] dark:text-white placeholder-[#D0D0D5] dark:placeholder-[#808090] focus:outline-none focus:border-b-2 focus:border-[#9D4EDD] dark:focus:border-[#9D4EDD] transition-colors"
            />
          </div>
        </div>

        {donationError && (
          <p className="mt-2 text-sm text-[#FF3B30] dark:text-[#FF453A]">{donationError.message}</p>
        )}
      </div>

      {/* Summary */}
      {selectedAmount && (
        <div className="p-4 bg-[#F5EFFF] dark:bg-[#2A1E4E] border border-[#9D4EDD] rounded-lg">
          <p className="text-sm text-[#0A0E27] dark:text-white">
            You are donating <span className="font-semibold">${selectedAmount.toFixed(2)}</span> to support Newah Organization.
          </p>
        </div>
      )}
    </div>
  );
}
