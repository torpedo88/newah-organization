import type { SupabaseClient } from "@supabase/supabase-js";

type Totals = {
  onlineRegistrations: number;
  onlineAdults: number;
  onlineChildren: number;
  doorRegistrations: number;
  doorAdults: number;
  doorChildren: number;
};

async function fetchTotals(supabase: SupabaseClient): Promise<Totals> {
  // Online registrations that hold seats: paid only (card or cash at the door).
  // Pending and failed checkouts are not attendees.
  const { data: mhapujaData } = await supabase
    .from("mhapuja_registrations")
    .select("adult_count, child_count")
    .eq("payment_status", "paid");

  const onlineRegistrations = mhapujaData?.length ?? 0;
  const onlineAdults = mhapujaData?.reduce((sum, r) => sum + (r.adult_count ?? 0), 0) ?? 0;
  const onlineChildren = mhapujaData?.reduce((sum, r) => sum + (r.child_count ?? 0), 0) ?? 0;

  // Fetch door registrations
  const { data: doorData } = await supabase
    .from("door_registrations")
    .select("adult_count, child_count");

  const doorRegistrations = doorData?.length ?? 0;
  const doorAdults = doorData?.reduce((sum, r) => sum + (r.adult_count ?? 0), 0) ?? 0;
  const doorChildren = doorData?.reduce((sum, r) => sum + (r.child_count ?? 0), 0) ?? 0;

  return {
    onlineRegistrations,
    onlineAdults,
    onlineChildren,
    doorRegistrations,
    doorAdults,
    doorChildren,
  };
}

export default async function RegistrationTotals({
  supabase,
}: {
  supabase: SupabaseClient;
}) {
  const totals = await fetchTotals(supabase);

  const totalRegistrations = totals.onlineRegistrations + totals.doorRegistrations;
  const totalAdults = totals.onlineAdults + totals.doorAdults;
  const totalChildren = totals.onlineChildren + totals.doorChildren;

  const stats = [
    {
      label: "Total Registrations",
      value: String(totalRegistrations),
      subtext: `${totals.onlineRegistrations} paid online, ${totals.doorRegistrations} walk-in`,
    },
    {
      label: "Total Adults",
      value: String(totalAdults),
      subtext: `${totals.onlineAdults} online, ${totals.doorAdults} walk-in`,
    },
    {
      label: "Total Children",
      value: String(totalChildren),
      subtext: `${totals.onlineChildren} online, ${totals.doorChildren} walk-in`,
    },
    {
      label: "Total Guests",
      value: String(totalAdults + totalChildren),
      subtext: `All attendees combined`,
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
        >
          <p className="text-3xl font-bold text-white">{stat.value}</p>
          <p className="text-sm font-semibold text-white/80">{stat.label}</p>
          <p className="text-xs text-white/50">{stat.subtext}</p>
        </div>
      ))}
    </div>
  );
}
