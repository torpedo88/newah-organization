import type { SupabaseClient } from "@supabase/supabase-js";
import { toDollars } from "@/lib/payments/fees";

type Totals = {
  // Attendance
  totalAdults: number;
  totalChildren: number;
  totalGuests: number;

  // Payment methods
  cardPaymentCents: number;
  zellePaymentCents: number;
  cashPaymentCents: number;
  totalPaymentsCents: number;

  // Registrations
  onlineCount: number;
  doorCount: number;
  totalCount: number;
};

async function fetchComprehensiveTotals(supabase: SupabaseClient): Promise<Totals> {
  // Fetch online registrations
  const { data: mhapujaData } = await supabase
    .from("mhapuja_registrations")
    .select("adult_count, child_count, charged_cents, payment_status");

  const onlineCount = mhapujaData?.length ?? 0;
  const onlineAdults = mhapujaData?.reduce((sum, r) => sum + (r.adult_count ?? 0), 0) ?? 0;
  const onlineChildren = mhapujaData?.reduce((sum, r) => sum + (r.child_count ?? 0), 0) ?? 0;

  // Card payments from online registrations (paid status)
  const cardPaymentCents = mhapujaData
    ?.filter((r) => r.payment_status === "paid")
    .reduce((sum, r) => sum + (r.charged_cents ?? 0), 0) ?? 0;

  // Fetch door registrations
  const { data: doorData } = await supabase
    .from("door_registrations")
    .select("adult_count, child_count, charged_cents, payment_method");

  const doorCount = doorData?.length ?? 0;
  const doorAdults = doorData?.reduce((sum, r) => sum + (r.adult_count ?? 0), 0) ?? 0;
  const doorChildren = doorData?.reduce((sum, r) => sum + (r.child_count ?? 0), 0) ?? 0;

  // Payment method totals from door registrations
  const zellePaymentCents = doorData
    ?.filter((r) => r.payment_method === "zelle")
    .reduce((sum, r) => sum + (r.charged_cents ?? 0), 0) ?? 0;

  const cashPaymentCents = doorData
    ?.filter((r) => r.payment_method === "cash")
    .reduce((sum, r) => sum + (r.charged_cents ?? 0), 0) ?? 0;

  const totalAdults = onlineAdults + doorAdults;
  const totalChildren = onlineChildren + doorChildren;
  const totalGuests = totalAdults + totalChildren;
  const totalCount = onlineCount + doorCount;
  const totalPaymentsCents = cardPaymentCents + zellePaymentCents + cashPaymentCents;

  return {
    totalAdults,
    totalChildren,
    totalGuests,
    cardPaymentCents,
    zellePaymentCents,
    cashPaymentCents,
    totalPaymentsCents,
    onlineCount,
    doorCount,
    totalCount,
  };
}

export default async function ComprehensiveTotals({
  supabase,
}: {
  supabase: SupabaseClient;
}) {
  const totals = await fetchComprehensiveTotals(supabase);

  return (
    <div className="mb-8 space-y-4">
      {/* Main Guests Box */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-semibold text-white">Total Attendance</h3>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="text-4xl font-bold text-white">{totals.totalAdults}</p>
            <p className="mt-2 text-sm text-white/60">Adults</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">{totals.totalChildren}</p>
            <p className="mt-2 text-sm text-white/60">Children</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">{totals.totalGuests}</p>
            <p className="mt-2 text-sm text-white/60">Total Guests</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">{totals.totalCount}</p>
            <p className="mt-2 text-sm text-white/60">Registrations</p>
          </div>
        </div>
        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="text-xs text-white/50">
            {totals.onlineCount} online • {totals.doorCount} walk-in
          </p>
        </div>
      </div>

      {/* Payments Box */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-semibold text-white">Payment Methods</h3>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="text-4xl font-bold text-blue-400">${toDollars(totals.cardPaymentCents)}</p>
            <p className="mt-2 text-sm text-white/60">Card 💳</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-400">${toDollars(totals.zellePaymentCents)}</p>
            <p className="mt-2 text-sm text-white/60">Zelle 📱</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-amber-400">${toDollars(totals.cashPaymentCents)}</p>
            <p className="mt-2 text-sm text-white/60">Cash 💵</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">${toDollars(totals.totalPaymentsCents)}</p>
            <p className="mt-2 text-sm text-white/60">Total Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
