"use client";

import { useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { DONATION_PRESETS, EVENT, MAX_DONATION } from "@/lib/constants/event";
import { settlement, toDollars } from "@/lib/payments/fees";
import { Registration } from "@/lib/validation/registration";

/**
 * Donation is independent of everything else: someone may bring food, give
 * money, both, or neither.
 */
export default function DonationFields({ form }: { form: UseFormReturn<Registration> }) {
  const amount = useWatch({ control: form.control, name: "donationAmount" });
  const choice = useWatch({ control: form.control, name: "donationChoice" });
  const coversFee = useWatch({ control: form.control, name: "coversFee" }) === true;
  const selected = typeof amount === "number" ? amount : undefined;

  /**
   * What the donor has typed, kept separately from the validated number.
   *
   * Deriving the input's value from the form state meant the field blanked
   * itself the instant the partial number happened to equal a preset: typing
   * 52 passed through 5, matched the $5 button, cleared, and left "2". A
   * donor meaning $52 was charged $2, and $1000 became $0. The typed string
   * is the donor's, and nothing but the donor edits it.
   */
  const [typed, setTyped] = useState("");

  // Choosing an amount and declining are both explicit acts; picking one
  // always clears the other so the two can never disagree.
  const setAmount = (value: number | undefined) => {
    setTyped("");
    form.setValue("donationAmount", value, { shouldDirty: true });
    form.setValue("donationChoice", value === undefined ? undefined : "amount", {
      shouldDirty: true,
    });
  };

  const declineDonation = () => {
    setTyped("");
    form.setValue("donationAmount", undefined, { shouldDirty: true });
    form.setValue("donationChoice", "none", { shouldDirty: true });
  };

  const cents = selected && selected > 0 ? Math.round(selected * 100) : 0;
  const { chargedCents, toOrganizationCents, feeCents } = settlement(cents, coversFee);

  return (
    <div className="space-y-4 border-t border-gray-200 pt-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">Make a donation</h2>
        <p className="mt-1 text-sm text-gray-600">
          Optional, and separate from bringing food. After the event&rsquo;s expenses are
          covered, all remaining proceeds go to the {EVENT.fundName}.
        </p>
      </div>

      <button
        type="button"
        onClick={declineDonation}
        aria-pressed={choice === "none"}
        className={`w-full rounded-lg border-2 py-2 font-semibold transition-all ${
          choice === "none"
            ? "border-blue-500 bg-blue-50 text-blue-900 shadow-md"
            : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        No donation
      </button>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {DONATION_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(selected === preset ? undefined : preset)}
            className={`rounded-lg border-2 py-2 text-sm font-semibold transition-all ${
              selected === preset
                ? "border-blue-500 bg-blue-50 text-blue-900 shadow-md"
                : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            ${preset}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="customAmount" className="mb-2 block text-sm font-semibold text-gray-900">
          Or another amount
        </label>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">$</span>
          <input
            id="customAmount"
            type="number"
            inputMode="decimal"
            min="1"
            max={MAX_DONATION}
            step="0.01"
            value={typed}
            onChange={(event) => {
              const raw = event.target.value;
              setTyped(raw);
              if (raw.trim() === "") {
                form.setValue("donationAmount", undefined, { shouldDirty: true });
                form.setValue("donationChoice", undefined, { shouldDirty: true });
                return;
              }
              const parsed = Number.parseFloat(raw);
              form.setValue("donationAmount", Number.isNaN(parsed) ? undefined : parsed, {
                shouldDirty: true,
              });
              form.setValue("donationChoice", Number.isNaN(parsed) ? undefined : "amount", {
                shouldDirty: true,
              });
            }}
            placeholder="Enter an amount"
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
          {selected !== undefined && (
            <button
              type="button"
              onClick={() => {
                setTyped("");
                form.setValue("donationAmount", undefined, { shouldDirty: true });
                form.setValue("donationChoice", undefined, { shouldDirty: true });
              }}
              className="px-2 text-sm text-gray-600 underline underline-offset-2 hover:text-gray-900"
            >
              Clear
            </button>
          )}
        </div>
        {form.formState.errors.donationAmount && (
          <p className="mt-1 text-sm text-alert">{form.formState.errors.donationAmount.message}</p>
        )}
        {form.formState.errors.donationChoice && (
          <p className="mt-2 text-sm text-alert">{form.formState.errors.donationChoice.message}</p>
        )}
      </div>

      {choice === "amount" && cents > 0 && (
        <>
          {/* The choice, and its consequence, stated before they reach the card page. */}
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-300 bg-blue-50 p-4">
            <input
              type="checkbox"
              {...form.register("coversFee")}
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-blue-600"
            />
            <span className="text-sm leading-relaxed text-gray-800">
              Add the card processing fee so the organization receives my full donation.
              <span className="mt-1 block text-gray-600">
                If you leave this unticked the fee is taken out of your donation instead.
              </span>
            </span>
          </label>

          <div className="rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-gray-900">
            <div className="flex justify-between">
              <span>Your donation</span>
              <span className="font-semibold">${toDollars(cents)}</span>
            </div>
            <div className="mt-1 flex justify-between text-gray-700">
              <span>{coversFee ? "Processing fee you add" : "Processing fee deducted"}</span>
              <span>
                {coversFee ? "+" : "−"}${toDollars(feeCents)}
              </span>
            </div>
            <div className="mt-2 flex justify-between border-t border-blue-200 pt-2 font-semibold">
              <span>You will be charged</span>
              <span>${toDollars(chargedCents)}</span>
            </div>
            <div className="mt-1 flex justify-between text-gray-700">
              <span>The organization receives</span>
              <span>${toDollars(toOrganizationCents)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
