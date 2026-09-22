"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import { DONATION_PRESETS, EVENT, MAX_DONATION } from "@/lib/constants/event";
import { grossUpCents, processingFeeCents, toDollars } from "@/lib/payments/fees";
import { Registration } from "@/lib/validation/registration";

/**
 * Donation is independent of everything else on the form: someone may bring
 * food, give money, both, or neither.
 */
export default function DonationFields({ form }: { form: UseFormReturn<Registration> }) {
  const amount = useWatch({ control: form.control, name: "donationAmount" });
  const selected = typeof amount === "number" ? amount : undefined;
  const isPreset = selected !== undefined && DONATION_PRESETS.includes(selected as never);

  const setAmount = (value: number | undefined) =>
    form.setValue("donationAmount", value, { shouldValidate: true, shouldDirty: true });

  const cents = selected && selected > 0 ? Math.round(selected * 100) : 0;
  const fee = cents ? processingFeeCents(cents) : 0;
  const total = cents ? grossUpCents(cents) : 0;

  return (
    <div className="space-y-4 border-t border-white/10 pt-6">
      <div>
        <h2 className="text-sm font-semibold text-white">Make a donation</h2>
        <p className="mt-1 text-sm text-white/60">
          Optional, and separate from bringing food. 100% goes to the {EVENT.fundName}.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {DONATION_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(selected === preset ? undefined : preset)}
            className={`rounded-xl border-2 py-3 font-semibold transition-all ${
              selected === preset
                ? "border-patasi bg-patasi/35 text-white shadow-[0_12px_32px_-16px_rgba(192,16,43,0.95)]"
                : "border-white/12 bg-white/5 text-white backdrop-blur-sm hover:border-patasi/60 hover:bg-patasi/12"
            }`}
          >
            ${preset}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="customAmount" className="mb-2 block text-sm font-semibold text-white">
          Or another amount
        </label>
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">$</span>
          <input
            id="customAmount"
            type="number"
            inputMode="decimal"
            min="1"
            max={MAX_DONATION}
            step="0.01"
            value={selected !== undefined && !isPreset ? String(selected) : ""}
            onChange={(event) => {
              const raw = event.target.value;
              if (raw === "") return setAmount(undefined);
              const parsed = Number.parseFloat(raw);
              setAmount(Number.isNaN(parsed) ? undefined : parsed);
            }}
            placeholder="Enter an amount"
            className="flex-1 rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-white placeholder-white/50 transition-all focus:border-patasi focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_rgba(192,16,43,0.35)] focus:outline-none"
          />
          {selected !== undefined && (
            <button
              type="button"
              onClick={() => setAmount(undefined)}
              className="px-2 text-sm text-white/60 underline underline-offset-2 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
        {form.formState.errors.donationAmount && (
          <p className="mt-1 text-sm text-alert">{form.formState.errors.donationAmount.message}</p>
        )}
      </div>

      {/* The donor sees the fee before they are sent to the card page. */}
      {cents > 0 && (
        <div className="rounded-xl border border-patasi/40 bg-patasi/12 p-4 text-sm text-white">
          <div className="flex justify-between">
            <span>To the fund</span>
            <span className="font-semibold">${toDollars(cents)}</span>
          </div>
          <div className="mt-1 flex justify-between text-white/70">
            <span>Card processing you cover</span>
            <span>${toDollars(fee)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-white/15 pt-2 font-semibold">
            <span>You will be charged</span>
            <span>${toDollars(total)}</span>
          </div>
          <p className="mt-2 text-xs text-white/60">
            Covering the fee is what lets the full ${toDollars(cents)} reach the fund.
          </p>
        </div>
      )}
    </div>
  );
}
