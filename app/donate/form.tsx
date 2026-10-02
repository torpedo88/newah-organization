"use client";

import { useState } from "react";
import { submitDonation } from "./actions";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function DonationForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    donor_name: "",
    donor_email: "",
    donor_phone: "",
    amount: "50",
    donation_type: "",
    anonymous: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const amount = parseFloat(formData.amount);
      if (!amount || amount < 1) {
        setError("Please enter a valid donation amount");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_name: formData.donor_name,
          donor_email: formData.donor_email,
          donor_phone: formData.donor_phone,
          amount,
          donation_type: formData.donation_type || "general",
          anonymous: formData.anonymous,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        setError(data.error || "Failed to create checkout session");
        setLoading(false);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
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
          <p className="text-green-400 text-sm">Thank you for your donation! We'll send you a receipt shortly.</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white mb-1">Name *</label>
        <input
          type="text"
          required
          value={formData.donor_name}
          onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Email *</label>
        <input
          type="email"
          required
          value={formData.donor_email}
          onChange={(e) => setFormData({ ...formData, donor_email: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Phone</label>
        <input
          type="tel"
          value={formData.donor_phone}
          onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Amount *</label>
        <div className="space-y-2">
          {[
            { value: "25", label: "$25 - Student/Limited Income" },
            { value: "50", label: "$50 - Standard Donation" },
            { value: "100", label: "$100 - Generous Donation" },
            { value: "custom", label: "Custom Amount" },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3">
              <input
                type="radio"
                name="amount"
                value={option.value}
                checked={formData.amount === option.value}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="size-4"
              />
              <span className="text-sm text-white">{option.label}</span>
            </label>
          ))}
        </div>

        {formData.amount === "custom" && (
          <input
            type="number"
            placeholder="Enter custom amount"
            value={formData.amount === "custom" ? "" : formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm mt-2"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Donation Purpose</label>
        <select
          value={formData.donation_type}
          onChange={(e) => setFormData({ ...formData, donation_type: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-white/40 focus:outline-none text-sm"
        >
          <option value="">General Fund</option>
          <option value="scholarship">Scholarship Fund</option>
          <option value="event">Event Support</option>
          <option value="project">Cultural Projects</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.anonymous}
            onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
            className="size-4 rounded"
          />
          <span className="text-sm text-white/80">Make this donation anonymous</span>
        </label>
      </div>

      <LiquidButton type="submit" disabled={loading} className="w-full text-white text-sm">
        {loading ? "Processing..." : "Proceed to Checkout"}
      </LiquidButton>

      <p className="text-xs text-white/50 text-center">
        Secure payment processing via Stripe. All donations are tax-deductible.
      </p>
    </form>
  );
}
