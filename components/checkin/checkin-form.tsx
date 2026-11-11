"use client";

import { useState } from "react";
import { checkInRegistration, type CheckinResult } from "@/lib/actions/checkin";
import { toDollars } from "@/lib/payments/fees";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import PatasiFrame from "@/components/ui/patasi-frame";
import { AlertCircle, CheckCircle2, Loader } from "lucide-react";

const fieldClass =
  "w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/15 text-white placeholder-white/50 focus:outline-none focus:border-patasi focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_rgba(192,16,43,0.35)] transition-all";

export default function CheckinForm() {
  const [identifier, setIdentifier] = useState("");
  const [adultCount, setAdultCount] = useState("1");
  const [childCount, setChildCount] = useState("0");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedInName, setCheckedInName] = useState<string | null>(null);
  const [cashDue, setCashDue] = useState<CheckinResult["cashDue"] | null>(null);
  const [cashTaken, setCashTaken] = useState<number | null>(null);

  const submit = async (cashCollected: boolean) => {
    setLoading(true);
    setCashDue(null);
    setCashTaken(null);
    setError(null);
    setSuccess(false);
    setCheckedInName(null);

    try {
      const adults = parseInt(adultCount, 10) || 0;
      const children = parseInt(childCount, 10) || 0;
      // With cash, look up by the code the server offered, not what was typed.
      const lookup = cashCollected && cashDue ? cashDue.code : identifier.trim();
      const result = await checkInRegistration(lookup, adults, children, cashCollected);

      if (!result.success) {
        setError(result.error || "Check-in failed");
        setCashDue(result.cashDue ?? null);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setCheckedInName(result.name || null);
      setCashTaken(result.cashCents ?? null);
      setIdentifier("");
      setAdultCount("1");
      setChildCount("0");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
        setCheckedInName(null);
      }, 5000);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit(false);
  };

  return (
    <PatasiFrame>
      <div className="bg-haku/35 p-8 backdrop-blur-[3px] md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-alert bg-alert/10 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-alert" />
                <p className="text-sm text-alert">{error}</p>
              </div>
              {cashDue && (
                <button
                  type="button"
                  onClick={() => void submit(true)}
                  disabled={loading}
                  className="mt-3 w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-haku hover:bg-white/90 disabled:opacity-50"
                >
                  Took ${toDollars(cashDue.cents)} cash &mdash; mark paid and check in
                </button>
              )}
            </div>
          )}

          {success && checkedInName && (
            <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                <div className="text-sm text-green-400">
                  <p className="font-semibold">Checked in: {checkedInName}</p>
                  {cashTaken != null && (
                    <p className="mt-1">Cash recorded: ${toDollars(cashTaken)}</p>
                  )}
                  <p className="mt-1">Welcome them in. Enjoy Mha Puja!</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="identifier" className="mb-2 block text-sm font-semibold text-white">
              Registration Code, Phone Number, or Email
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="e.g., MHP-2026-ABC123 or (555) 123-4567 or email@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={fieldClass}
              disabled={loading}
              autoFocus
            />
            <p className="mt-1 text-xs text-white/50">
              Enter your registration code, phone number, or email from your confirmation
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="adults" className="mb-2 block text-sm font-semibold text-white">
                Adults Present
              </label>
              <input
                id="adults"
                type="number"
                min="0"
                max="20"
                value={adultCount}
                onChange={(e) => setAdultCount(e.target.value)}
                className={fieldClass}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="children" className="mb-2 block text-sm font-semibold text-white">
                Children Present
              </label>
              <input
                id="children"
                type="number"
                min="0"
                max="20"
                value={childCount}
                onChange={(e) => setChildCount(e.target.value)}
                className={fieldClass}
                disabled={loading}
              />
            </div>
          </div>
          <p className="text-xs text-white/50">
            Ages 10+ count as adults, under 10 as children
          </p>

          <LiquidButton
            type="submit"
            disabled={loading || !identifier.trim()}
            size="xxl"
            className="w-full text-white"
          >
            {loading ? (
              <>
                <Loader className="size-5 animate-spin" aria-hidden />
                <span>Checking in...</span>
              </>
            ) : (
              <span>Check In</span>
            )}
          </LiquidButton>

        </form>
      </div>
    </PatasiFrame>
  );
}
