"use client";

import { useState } from "react";
import { toDollars } from "@/lib/payments/fees";
import { formatDateTime } from "@/lib/constants/time";

type Donation = {
  id: number;
  donor_name: string;
  donor_email: string;
  donor_phone: string | null;
  amount_cents: number;
  payment_method: "card" | "cash" | "zelle";
  donation_type: string;
  anonymous: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function DonationsTable({
  donations,
  canApprove = false,
}: {
  donations: Donation[];
  canApprove?: boolean;
}) {
  const [updating, setUpdating] = useState<number | null>(null);

  async function approveDonation(id: number) {
    setUpdating(id);
    try {
      const response = await fetch(`/api/donations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } finally {
      setUpdating(null);
    }
  }

  async function rejectDonation(id: number) {
    setUpdating(id);
    try {
      const response = await fetch(`/api/donations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } finally {
      setUpdating(null);
    }
  }

  if (donations.length === 0) {
    return <p className="py-10 text-center text-white/60">No donations.</p>;
  }

  return (
    <div className="-mx-8 overflow-x-auto px-8">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/15 text-xs uppercase tracking-wide text-white/55">
            <th className="py-3 pr-4 font-semibold">Name</th>
            <th className="py-3 pr-4 font-semibold">Email</th>
            <th className="py-3 pr-4 font-semibold">Amount</th>
            <th className="py-3 pr-4 font-semibold">Method</th>
            <th className="py-3 pr-4 font-semibold">Type</th>
            <th className="py-3 pr-4 font-semibold">Date</th>
            {canApprove && <th className="py-3 font-semibold">Action</th>}
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id} className="border-b border-white/10 last:border-0">
              <td className="py-3 pr-4 font-medium text-white">
                {donation.anonymous ? "Anonymous" : donation.donor_name}
              </td>
              <td className="py-3 pr-4 text-white/70">{donation.donor_email}</td>
              <td className="py-3 pr-4 font-semibold text-white">
                ${toDollars(donation.amount_cents)}
              </td>
              <td className="py-3 pr-4 text-white/70">
                {donation.payment_method === "card" && "💳 Card"}
                {donation.payment_method === "cash" && "💵 Cash"}
                {donation.payment_method === "zelle" && "📱 Zelle"}
              </td>
              <td className="py-3 pr-4 text-white/70 capitalize">{donation.donation_type}</td>
              <td className="py-3 pr-4 text-white/55 text-xs">
                {formatDateTime(donation.created_at)}
              </td>
              {canApprove && (
                <td className="py-3 space-x-2 flex">
                  <button
                    onClick={() => approveDonation(donation.id)}
                    disabled={updating === donation.id}
                    className="rounded px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectDonation(donation.id)}
                    disabled={updating === donation.id}
                    className="rounded px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
