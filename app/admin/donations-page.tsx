import { TriangleAlert } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { toDollars } from "@/lib/payments/fees";
import { formatDateTime } from "@/lib/constants/time";
import DonationsTable from "@/components/admin/donations-table";

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

async function fetchDonations(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data: data as Donation[] };
}

export default async function DonationsPage({
  panelClassName,
}: {
  panelClassName: string;
}) {
  const supabase = require("@/lib/supabase/admin").createAdminClient();

  if (!supabase) {
    return (
      <div className={panelClassName}>
        <div className="text-center text-white">
          <TriangleAlert className="mx-auto mb-4 size-10 text-alert" strokeWidth={1.5} aria-hidden />
          <h2 className="mb-2 text-xl font-bold">Cannot load donations</h2>
          <p className="text-white/70">Service role key not configured</p>
        </div>
      </div>
    );
  }

  const { data: donations, error } = await fetchDonations(supabase);

  if (error || !donations) {
    return (
      <div className={panelClassName}>
        <div className="text-center text-white">
          <TriangleAlert className="mx-auto mb-4 size-10 text-alert" strokeWidth={1.5} aria-hidden />
          <h2 className="mb-2 text-xl font-bold">Could not load donations</h2>
          <p className="text-white/70">{error}</p>
        </div>
      </div>
    );
  }

  const pending = donations.filter((d) => d.status === "pending");
  const approved = donations.filter((d) => d.status === "approved");
  const rejected = donations.filter((d) => d.status === "rejected");

  const totalCents = approved.reduce((sum, d) => sum + d.amount_cents, 0);

  const stats = [
    { label: "Pending", value: String(pending.length), color: "text-yellow-400" },
    { label: "Approved", value: String(approved.length), color: "text-green-400" },
    { label: "Total Approved", value: `$${toDollars(totalCents)}`, color: "text-white" },
  ];

  return (
    <>
      <p className="mb-6 text-sm text-white/60">
        Manage donations from cash and Zelle payments. Card donations are auto-approved.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-white/60">{stat.label}</p>
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-white">Pending Approvals</h3>
          <div className={panelClassName}>
            <DonationsTable donations={pending} canApprove />
          </div>
        </div>
      )}

      {approved.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-white">Approved</h3>
          <div className={panelClassName}>
            <DonationsTable donations={approved} />
          </div>
        </div>
      )}

      {rejected.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Rejected</h3>
          <div className={panelClassName}>
            <DonationsTable donations={rejected} />
          </div>
        </div>
      )}

      {donations.length === 0 && (
        <div className={panelClassName}>
          <p className="py-10 text-center text-white/60">No donations yet.</p>
        </div>
      )}
    </>
  );
}
