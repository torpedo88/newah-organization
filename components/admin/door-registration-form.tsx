"use client";

import { useState } from "react";
import { doorRegisterAttendee } from "@/lib/actions/door-registration";
import { AlertCircle, CheckCircle2, Loader } from "lucide-react";

const fieldClass =
  "w-full px-4 py-2 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-patasi focus:outline-none focus:bg-white/10";

const buttonClass =
  "px-4 py-2 rounded-lg bg-patasi text-white text-sm font-semibold hover:bg-patasi/90 disabled:opacity-50";

export default function DoorRegistrationForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [adultCount, setAdultCount] = useState("1");
  const [childCount, setChildCount] = useState("0");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationCode, setRegistrationCode] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "zelle" | null>(null);

  const handleSubmit = async (paymentMethod: "cash" | "zelle") => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setRegistrationCode(null);

    try {
      const adults = parseInt(adultCount) || 1;
      const children = parseInt(childCount) || 0;

      const result = await doorRegisterAttendee(fullName, phone, email, adults, children, paymentMethod);

      if (!result.success) {
        setError(result.error || "Registration failed");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setRegistrationCode(result.registrationCode || null);
      setFullName("");
      setPhone("");
      setEmail("");
      setAdultCount("1");
      setChildCount("0");

      setTimeout(() => {
        setSuccess(false);
        setRegistrationCode(null);
        if (onSuccess) onSuccess();
      }, 5000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4 rounded-lg border border-white/20 bg-white/5 p-6">
      <h3 className="text-lg font-semibold text-white">Register Walk-In Attendee</h3>

      {error && (
        <div className="rounded-lg border border-alert bg-alert/10 p-3">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 text-alert mt-0.5" />
            <p className="text-sm text-alert">{error}</p>
          </div>
        </div>
      )}

      {success && registrationCode && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3">
          <div className="flex gap-2">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400 mt-0.5" />
            <div className="text-sm text-green-400">
              <p className="font-semibold">{fullName} registered!</p>
              <p className="text-xs text-green-400/80">Code: {registrationCode}</p>
              <p className="text-xs text-green-400/60">
                Payment: {paymentMethod === "cash" ? "Cash at door" : "Zelle"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-white/70">Name *</label>
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={fieldClass}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-white/70">Phone</label>
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-white/70">Email</label>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-white/70">Adults</label>
          <input
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
          <label className="mb-1 block text-xs font-semibold text-white/70">Children</label>
          <input
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

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setPaymentMethod("cash");
            handleSubmit("cash");
          }}
          disabled={loading || !fullName.trim()}
          className={buttonClass}
        >
          {loading ? (
            <>
              <Loader className="inline size-4 animate-spin mr-2" aria-hidden />
              Registering...
            </>
          ) : (
            "Register with Cash"
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setPaymentMethod("zelle");
            handleSubmit("zelle");
          }}
          disabled={loading || !fullName.trim()}
          className={buttonClass}
        >
          {loading ? (
            <>
              <Loader className="inline size-4 animate-spin mr-2" aria-hidden />
              Registering...
            </>
          ) : (
            "Register with Zelle"
          )}
        </button>
      </div>
    </form>
  );
}
