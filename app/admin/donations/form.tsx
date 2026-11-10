"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDonation, updateDonation } from "./actions";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

type Donation = {
  id: number;
  donor_name: string;
  donor_email: string;
  donor_phone: string | null;
  amount: number;
  donation_type: string;
  purpose: string | null;
  payment_status: string;
  anonymous: boolean;
};

export default function DonationForm({ donation }: { donation?: Donation }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    donor_name: donation?.donor_name || "",
    donor_email: donation?.donor_email || "",
    donor_phone: donation?.donor_phone || "",
    amount: donation?.amount || "",
    donation_type: donation?.donation_type || "general",
    purpose: donation?.purpose || "",
    payment_status: donation?.payment_status || "completed",
    anonymous: donation?.anonymous ?? false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = {
      ...formData,
      amount: parseFloat(formData.amount as any),
    };

    const result = donation
      ? await updateDonation(donation.id, data)
      : await createDonation(data);

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/donations");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!formData.anonymous && (
        <>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Donor Name *</label>
            <input
              type="text"
              required
              value={formData.donor_name}
              onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
              className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Email *</label>
            <input
              type="email"
              required
              value={formData.donor_email}
              onChange={(e) => setFormData({ ...formData, donor_email: e.target.value })}
              className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Phone</label>
            <input
              type="tel"
              value={formData.donor_phone}
              onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })}
              className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-white mb-2">Amount *</label>
        <input
          type="number"
          step="0.01"
          required
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Type</label>
        <select
          value={formData.donation_type}
          onChange={(e) => setFormData({ ...formData, donation_type: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-white/40 focus:outline-none"
        >
          <option value="general">General</option>
          <option value="scholarship">Scholarship</option>
          <option value="event">Event</option>
          <option value="project">Project</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Purpose</label>
        <textarea
          value={formData.purpose}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          rows={3}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Payment Status</label>
        <select
          value={formData.payment_status}
          onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-white/40 focus:outline-none"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.anonymous}
            onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium text-white">Anonymous</span>
        </label>
      </div>

      <div className="flex gap-4">
        <LiquidButton type="submit" disabled={loading} className="text-white">
          {loading ? "Saving..." : donation ? "Update" : "Create"}
        </LiquidButton>
      </div>
    </form>
  );
}
