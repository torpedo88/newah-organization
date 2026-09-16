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
        <h2 className="text-sm font-semibold text-[#0A0E27] dark:text-white mb-4">
          Donation Amount
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
                  ? "border-[#FF7A45] bg-[#FF7A45] text-white dark:bg-[#FF7A45]"
                  : "border-[#E8F0F7] dark:border-[#2A2E4E] bg-[#E8F0F7] dark:bg-[#161B35] text-[#0A0E27] dark:text-white hover:border-[#FF7A45]"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div>
          <label className="block text-sm font-semibold text-[#0A0E27] dark:text-white mb-3">
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
              className="flex-1 px-3 py-2 rounded-lg bg-[#E8F0F7] dark:bg-[#1a2a3a] border border-[#E8F0F7] dark:border-[#2a3a4a] text-[#0A0E27] dark:text-white placeholder-[#7a8a9a] dark:placeholder-[#8a9aaa] focus:outline-none focus:border-[#FF7A45] transition-colors"
            />
          </div>
        </div>

        {donationError && (
          <p className="mt-2 text-sm text-[#FF3B30] dark:text-[#FF453A]">{donationError.message}</p>
        )}
      </div>

      {/* Summary */}
      {selectedAmount && (
        <div className="p-4 bg-[#FFF3ED] dark:bg-[#3a2820] border border-[#FF7A45] rounded-lg">
          <p className="text-sm text-[#0A0E27] dark:text-white">
            You are donating <span className="font-semibold">${selectedAmount.toFixed(2)}</span> to support Newah Organization.
          </p>
        </div>
      )}
    </div>
  );
}
