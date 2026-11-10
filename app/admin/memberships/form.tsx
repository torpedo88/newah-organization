"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMembership, updateMembership } from "./actions";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

type Membership = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  membership_type: string;
  membership_status: string;
  annual_fee: number | null;
  paid: boolean;
};

export default function MembershipForm({ membership }: { membership?: Membership }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: membership?.name || "",
    email: membership?.email || "",
    phone: membership?.phone || "",
    membership_type: membership?.membership_type || "regular",
    membership_status: membership?.membership_status || "active",
    annual_fee: membership?.annual_fee || "",
    paid: membership?.paid ?? false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = {
      ...formData,
      annual_fee: formData.annual_fee ? parseFloat(formData.annual_fee as any) : undefined,
    };

    const result = membership
      ? await updateMembership(membership.id, data)
      : await createMembership(data);

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/memberships");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white mb-2">Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Email *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Type *</label>
        <select
          value={formData.membership_type}
          onChange={(e) => setFormData({ ...formData, membership_type: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-white/40 focus:outline-none"
        >
          <option value="regular">Regular</option>
          <option value="family">Family</option>
          <option value="lifetime">Lifetime</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Status *</label>
        <select
          value={formData.membership_status}
          onChange={(e) => setFormData({ ...formData, membership_status: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-white/40 focus:outline-none"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Annual Fee</label>
        <input
          type="number"
          step="0.01"
          value={formData.annual_fee}
          onChange={(e) => setFormData({ ...formData, annual_fee: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.paid}
            onChange={(e) => setFormData({ ...formData, paid: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium text-white">Paid</span>
        </label>
      </div>

      <div className="flex gap-4">
        <LiquidButton type="submit" disabled={loading} className="text-white">
          {loading ? "Saving..." : membership ? "Update" : "Create"}
        </LiquidButton>
      </div>
    </form>
  );
}
