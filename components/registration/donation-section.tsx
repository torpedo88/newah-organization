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

  const donationError = form.formState.errors.donationAmount;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-white mb-4">
          Donation Amount
        </h2>

        {/* Predefined Amounts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {DONATION_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handlePredefinedAmount(amount)}
              className={`p-3 rounded-xl border-2 font-semibold transition-all ${
                selectedAmount === amount
                  ? "border-[#FF7A45] bg-[rgba(255,122,69,0.15)] text-white"
                  : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-white hover:border-[rgba(255,122,69,0.5)] hover:bg-[rgba(255,122,69,0.08)]"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            Other Amount
          </label>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">$</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => handleCustomAmount(e.target.value)}
              placeholder="Enter custom amount"
              min="1"
              max="10000"
              step="0.01"
              className="flex-1 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#FF7A45] focus:bg-[rgba(255,255,255,0.12)] focus:shadow-[0_0_0_4px_rgba(255,122,69,0.2)] transition-all"
            />
          </div>
        </div>

        {donationError && (
          <p className="mt-1 text-sm text-[#FF3B30]">{donationError.message}</p>
        )}
      </div>

      {/* Summary */}
      {selectedAmount && (
        <div className="p-4 bg-[rgba(255,122,69,0.1)] border border-[rgba(255,122,69,0.3)] rounded-xl">
          <p className="text-sm text-white">
            You are donating <span className="font-semibold">${selectedAmount.toFixed(2)}</span> to support Newah Organization.
          </p>
        </div>
      )}
    </div>
  );
}
