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
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Donation Amount *</h2>

        {/* Predefined Amounts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {DONATION_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handlePredefinedAmount(amount)}
              className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                selectedAmount === amount
                  ? "border-blue-500 bg-blue-600 text-white dark:bg-blue-700"
                  : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-slate-500"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Other Amount
          </label>
          <div className="flex items-center gap-2">
            <span className="text-slate-700 dark:text-slate-300 font-medium">$</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => handleCustomAmount(e.target.value)}
              placeholder="Enter custom amount"
              min="1"
              max="10000"
              step="0.01"
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {donationError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{donationError.message}</p>
        )}
      </div>

      {/* Summary */}
      {selectedAmount && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            You are donating <span className="font-semibold">${selectedAmount.toFixed(2)}</span> to support Newah Organization.
          </p>
        </div>
      )}
    </div>
  );
}
