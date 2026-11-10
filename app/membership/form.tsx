"use client";

import { useState } from "react";
import { submitMembershipSignup } from "./actions";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function MembershipForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    membership_type: "regular",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await submitMembershipSignup({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      membership_type: formData.membership_type,
    });

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        membership_type: "regular",
      });
      setLoading(false);
      setTimeout(() => setSuccess(false), 5000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
          <p className="text-green-400 text-sm">Thank you for joining! Welcome to the Newah community.</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white mb-1">Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Email *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Membership Type *</label>
        <div className="space-y-2">
          {[
            { value: "regular", label: "Regular - $50/year" },
            { value: "family", label: "Family - $75/year" },
            { value: "lifetime", label: "Lifetime - $500" },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3">
              <input
                type="radio"
                name="membership_type"
                value={option.value}
                checked={formData.membership_type === option.value}
                onChange={(e) => setFormData({ ...formData, membership_type: e.target.value })}
                className="size-4"
              />
              <span className="text-sm text-white">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <LiquidButton type="submit" disabled={loading} className="w-full text-white text-sm">
        {loading ? "Processing..." : "Join Now"}
      </LiquidButton>
    </form>
  );
}
