"use client";

import { useState } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { settlement, toDollars } from "@/lib/payments/fees";

export default function DonationForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    donor_name: "",
    donor_email: "",
    donor_phone: "",
    amount: "50",
    amountType: "preset",
    payment_method: "card",
    donation_type: "",
    anonymous: false,
    covers_fee: false,
  });

  const amountCents = Math.round(parseFloat(formData.amount) * 100) || 0;
  const { chargedCents, toOrganizationCents, feeCents } = settlement(amountCents, formData.covers_fee);

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

      if (formData.payment_method === "card") {
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
            covers_fee: formData.covers_fee,
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
      } else {
        // Cash or Zelle - show success message with instructions
        setSuccess(true);
        setLoading(false);
      }
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
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4 space-y-3">
          <p className="text-green-400 text-sm font-semibold">Thank you for your donation!</p>
          {formData.payment_method === "card" && (
            <p className="text-green-400 text-sm">Redirecting to checkout...</p>
          )}
          {formData.payment_method === "zelle" && (
            <div className="text-green-400 text-sm space-y-2">
              <p>Send ${formData.amount} via Zelle to:</p>
              <p className="font-mono text-xs bg-white/10 p-2 rounded">
                zelle@newahorganization.org
              </p>
              <p className="text-xs">Include your name and "Donation - {formData.donation_type || 'General Fund'}" in the memo.</p>
            </div>
          )}
          {formData.payment_method === "cash" && (
            <div className="text-green-400 text-sm space-y-2">
              <p>You can bring ${formData.amount} in cash to our next event.</p>
              <p className="text-xs">Our team will be there to receive your donation.</p>
            </div>
          )}
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
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3">
              <input
                type="radio"
                name="amountType"
                value={option.value}
                checked={formData.amountType === "preset" && formData.amount === option.value}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value, amountType: "preset" })}
                className="size-4"
              />
              <span className="text-sm text-white">{option.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="amountType"
              value="custom"
              checked={formData.amountType === "custom"}
              onChange={(e) => setFormData({ ...formData, amountType: "custom" })}
              className="size-4"
            />
            <span className="text-sm text-white">Custom Amount</span>
          </label>
        </div>

        {formData.amountType === "custom" && (
          <input
            type="number"
            placeholder="Enter custom amount"
            value={formData.amountType === "custom" ? formData.amount : ""}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            min="1"
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm mt-2"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Payment Method *</label>
        <div className="space-y-2">
          {[
            { value: "card", label: "💳 Credit/Debit Card", desc: "Pay with card via Stripe" },
            { value: "zelle", label: "📱 Zelle", desc: "Send donation via Zelle" },
            { value: "cash", label: "💵 Cash", desc: "Pay at the event" },
          ].map((option) => (
            <label key={option.value} className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment_method"
                value={option.value}
                checked={formData.payment_method === option.value}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="mt-1 size-4"
              />
              <div>
                <span className="text-sm font-medium text-white">{option.label}</span>
                <p className="text-xs text-white/60">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
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

      <div className="rounded-lg bg-white/5 border border-white/10 p-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-white">
            <span>Donation amount:</span>
            <span>${toDollars(amountCents)}</span>
          </div>
          {formData.payment_method === "card" && (
            <>
              <div className="flex justify-between text-sm text-white/70">
                <span>Processing fee:</span>
                <span>${toDollars(feeCents)}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-medium text-white">
                <span>You will be charged:</span>
                <span>${toDollars(chargedCents)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/70">
                <span>Organization receives:</span>
                <span>${toDollars(toOrganizationCents)}</span>
              </div>
            </>
          )}
          {(formData.payment_method === "cash" || formData.payment_method === "zelle") && (
            <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-medium text-white">
              <span>You will give:</span>
              <span>${toDollars(amountCents)}</span>
            </div>
          )}
        </div>
      </div>

      {formData.payment_method === "card" && (
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.covers_fee}
              onChange={(e) => setFormData({ ...formData, covers_fee: e.target.checked })}
              className="size-4 rounded"
            />
            <span className="text-sm text-white/80">
              {formData.covers_fee
                ? "I'm covering the processing fee so the organization gets my full donation"
                : "Deduct processing fee from my donation"}
            </span>
          </label>
        </div>
      )}

      <LiquidButton type="submit" disabled={loading} className="w-full text-white text-sm">
        {loading ? "Processing..." : formData.payment_method === "card" ? "Proceed to Checkout" : "Continue"}
      </LiquidButton>

      <p className="text-xs text-white/50 text-center">
        {formData.payment_method === "card" && "Secure payment processing via Stripe. All donations are tax-deductible."}
        {formData.payment_method === "zelle" && "All donations are tax-deductible."}
        {formData.payment_method === "cash" && "All donations are tax-deductible."}
      </p>
    </form>
  );
}
