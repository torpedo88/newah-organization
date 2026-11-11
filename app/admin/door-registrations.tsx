import { TriangleAlert } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { formatDateTime } from "@/lib/constants/time";
import DoorRegistrationsTable from "@/components/admin/door-registrations-table";
import { applySearch, hasSearch } from "@/lib/admin/search";
import { toDollars } from "@/lib/payments/fees";

type DoorRegistration = {
  id: number;
  registration_code: string;
  full_name: string;
  phone: string;
  email: string;
  adult_count: number;
  child_count: number;
  payment_method: "cash" | "zelle";
  charged_cents: number;
  created_at: string;
  checked_in_at: string | null;
  adults_present: number | null;
  children_present: number | null;
};

async function fetchDoorRegistrations(supabase: SupabaseClient, query?: string) {
  const { data, error } = await applySearch(supabase.from("door_registrations").select("*"), query).order(
    "created_at",
    { ascending: false },
  );

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data: data as DoorRegistration[] };
}

export default async function DoorRegistrations({
  supabase,
  panelClassName,
  query,
}: {
  supabase: SupabaseClient;
  panelClassName: string;
  query?: string;
}) {
  const { data: registrations, error } = await fetchDoorRegistrations(supabase, query);

  if (error || !registrations) {
    return (
      <div className={panelClassName}>
        <div className="text-center text-white">
          <TriangleAlert className="mx-auto mb-4 size-10 text-alert" strokeWidth={1.5} aria-hidden />
          <h2 className="mb-2 text-xl font-bold">Could not load door registrations</h2>
          <p className="text-white/70">{error}</p>
        </div>
      </div>
    );
  }

  const byMethod = (m: string) => registrations.filter((r) => r.payment_method === m);
  const stats = [
    {
      label: "Total Walk-Ins",
      value: String(registrations.length),
    },
    {
      label: `Cash (${byMethod("cash").length})`,
      value: `$${toDollars(byMethod("cash").reduce((n, r) => n + r.charged_cents, 0))}`,
    },
    {
      label: `Zelle (${byMethod("zelle").length})`,
      value: `$${toDollars(byMethod("zelle").reduce((n, r) => n + r.charged_cents, 0))}`,
    },
    {
      label: "Walk-in total",
      value: `$${toDollars(registrations.reduce((n, r) => n + r.charged_cents, 0))}`,
    },
    {
      label: "Checked In",
      value: String(registrations.filter((r) => r.checked_in_at).length),
    },
  ];

  return (
    <>
      <p className="mb-4 text-sm text-white/60">
        Walk-in door registrations &middot; {registrations.length} registered
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
          >
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-white/60">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className={panelClassName}>
        {registrations.length === 0 ? (
          <p className="py-10 text-center text-white/60">{hasSearch(query) ? "No walk-ins match the search." : "No door registrations yet."}</p>
        ) : (
          <DoorRegistrationsTable registrations={registrations} />
        )}
      </div>
    </>
  );
}
