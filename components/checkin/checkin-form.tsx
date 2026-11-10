"use client";

import { useState } from "react";
import { checkInRegistration } from "@/lib/actions/checkin";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import PatasiFrame from "@/components/ui/patasi-frame";
import { AlertCircle, CheckCircle2, Loader } from "lucide-react";

const fieldClass =
  "w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/15 text-white placeholder-white/50 focus:outline-none focus:border-patasi focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_rgba(192,16,43,0.35)] transition-all";

export default function CheckinForm() {
  const [registrationCode, setRegistrationCode] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedInName, setCheckedInName] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setCheckedInName(null);

    try {
      const count = parseInt(guestCount) || 1;
      const result = await checkInRegistration(registrationCode.trim().toUpperCase(), count);

      if (!result.success) {
        setError(result.error || "Check-in failed");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setCheckedInName(result.name || null);
      setRegistrationCode("");
      setGuestCount("1");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
        setCheckedInName(null);
      }, 5000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
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
            </div>
          )}

          {success && checkedInName && (
            <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                <div className="text-sm text-green-400">
                  <p className="font-semibold">Welcome, {checkedInName}!</p>
                  <p className="mt-1">You're checked in. Enjoy Mha Puja!</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="code" className="mb-2 block text-sm font-semibold text-white">
              Registration Code
            </label>
            <input
              id="code"
              type="text"
              placeholder="e.g., MHP-2026-ABC123"
              value={registrationCode}
              onChange={(e) => setRegistrationCode(e.target.value)}
              className={fieldClass}
              disabled={loading}
              autoFocus
            />
            <p className="mt-1 text-xs text-white/50">
              Check your confirmation email for your registration code
            </p>
          </div>

          <div>
            <label htmlFor="guests" className="mb-2 block text-sm font-semibold text-white">
              Number of Guests Present
            </label>
            <input
              id="guests"
              type="number"
              min="1"
              max="20"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              className={fieldClass}
              disabled={loading}
            />
            <p className="mt-1 text-xs text-white/50">
              Include yourself in the count
            </p>
          </div>

          <LiquidButton
            type="submit"
            disabled={loading || !registrationCode.trim()}
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

          <p className="text-center text-xs text-white/50">
            Check-in is recorded at {new Date().toLocaleTimeString()}
          </p>
        </form>
      </div>
    </PatasiFrame>
  );
}
