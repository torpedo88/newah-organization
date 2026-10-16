import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { toDollars } from "@/lib/payments/fees";
import { formatDate, formatDateTime } from "@/lib/constants/time";

type MhaPujaRow = {
  id: number;
  registration_code: string;
  full_name: string;
  phone: string;
  email: string;
  adult_count: number;
  child_count: number;
  charged_cents: number;
  payment_status: string;
  stripe_session_id: string | null;
  consent_given: boolean;
  consent_at: string | null;
  created_at: string;
};

type TotalsRow = Pick<MhaPujaRow, "adult_count" | "child_count" | "charged_cents" | "payment_status">;

const PAGE_SIZE = 200;
/** PostgREST's default response cap; totals are read in pages of this size. */
const TOTALS_CHUNK = 1000;

/**
 * Every row's counts and amounts, read in pages.
 *
 * Totals have to cover the whole table, not the 200 rows on screen, and one
 * unpaged select silently stops at the API's response cap. Reading four
 * narrow columns in pages keeps the numbers right without a database function.
 */
async function readAllTotals(supabase: SupabaseClient) {
  const all: TotalsRow[] = [];
  for (let from = 0; ; from += TOTALS_CHUNK) {
    const { data, error } = await supabase
      .from("mhapuja_registrations")
      .select("adult_count, child_count, charged_cents, payment_status")
      .order("id")
      .range(from, from + TOTALS_CHUNK - 1);
    if (error) return { error: error.message };
    all.push(...((data ?? []) as TotalsRow[]));
    if (!data || data.length < TOTALS_CHUNK) break;
  }

  // Head counts only from paid rows: an unpaid registration holds no seat.
  const paid = all.filter((r) => r.payment_status === "paid");
  return {
    registrations: all.length,
    paidRegistrations: paid.length,
    adults: paid.reduce((n, r) => n + r.adult_count, 0),
    children: paid.reduce((n, r) => n + r.child_count, 0),
    paidCents: paid.reduce((n, r) => n + r.charged_cents, 0),
    pendingCents: all
      .filter((r) => r.payment_status === "pending")
      .reduce((n, r) => n + r.charged_cents, 0),
  };
}

function statusClass(status: string) {
  if (status === "paid") return "text-[#4ADE80]";
  if (status === "failed") return "text-alert";
  if (status === "refunded") return "text-white/50";
  return "text-lun";
}

/** The Mha Puja tab of /admin: ticket registrations, newest first. */
export default async function MhaPujaRegistrations({
  supabase,
  currentPage,
  panelClassName,
}: {
  supabase: SupabaseClient;
  currentPage: number;
  panelClassName: string;
}) {
  const pageOffset = (currentPage - 1) * PAGE_SIZE;

  const [{ data, error }, totals] = await Promise.all([
    supabase
      .from("mhapuja_registrations")
      .select(
        "id, registration_code, full_name, phone, email, adult_count, child_count, " +
          "charged_cents, payment_status, stripe_session_id, consent_given, consent_at, created_at",
      )
      .order("created_at", { ascending: false })
      .range(pageOffset, pageOffset + PAGE_SIZE - 1),
    readAllTotals(supabase),
  ]);

  if (error || "error" in totals) {
    const message = error?.message ?? ("error" in totals ? totals.error : "");
    return (
      <div className={panelClassName}>
        <div className="text-center text-white">
          <TriangleAlert className="mx-auto mb-4 size-10 text-alert" strokeWidth={1.5} aria-hidden />
          <h2 className="mb-2 text-xl font-bold">Could not load Mha Puja registrations</h2>
          <p className="text-white/70">{message}</p>
        </div>
      </div>
    );
  }

  const rows = (data ?? []) as unknown as MhaPujaRow[];
  const stats = [
    { label: "Registrations", value: String(totals.registrations) },
    { label: "Paid adults", value: String(totals.adults) },
    { label: "Paid children", value: String(totals.children) },
    { label: "Received", value: `$${toDollars(totals.paidCents)}` },
    { label: "Awaiting payment", value: `$${toDollars(totals.pendingCents)}` },
  ];

  return (
    <>
      <p className="mb-4 text-sm text-white/60">
        Mha Puja tickets &middot; {totals.registrations}{" "}
        {totals.registrations === 1 ? "entry" : "entries"} ({totals.paidRegistrations} paid), newest
        first. Seats count paid registrations only. &ldquo;Received&rdquo; is before Stripe&rsquo;s
        card fee.
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
        {rows.length === 0 ? (
          <p className="py-10 text-center text-white/60">No Mha Puja registrations yet.</p>
        ) : (
          <div className="-mx-8 overflow-x-auto px-8">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/15 text-xs uppercase tracking-wide text-white/55">
                  <th className="py-3 pr-4 font-semibold">Code</th>
                  <th className="py-3 pr-4 font-semibold">Name</th>
                  <th className="py-3 pr-4 font-semibold">Contact</th>
                  <th className="py-3 pr-4 font-semibold">Tickets</th>
                  <th className="py-3 pr-4 font-semibold">Payment</th>
                  <th className="py-3 pr-4 font-semibold">Consent</th>
                  <th className="py-3 font-semibold">Registered</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/10 last:border-0">
                    <td className="py-3 pr-4 font-mono text-white/90">{row.registration_code}</td>
                    <td className="py-3 pr-4 font-medium text-white">{row.full_name}</td>
                    <td className="py-3 pr-4 text-white/70">
                      <div>{row.email}</div>
                      <div className="text-white/50">{row.phone}</div>
                    </td>
                    <td className="py-3 pr-4 text-white/70">
                      {row.adult_count} adult{row.adult_count === 1 ? "" : "s"}
                      {row.child_count > 0 && (
                        <>
                          , {row.child_count} child{row.child_count === 1 ? "" : "ren"}
                        </>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-white/70">
                      <span className="font-medium text-white">${toDollars(row.charged_cents)}</span>
                      <span className={`ml-2 ${statusClass(row.payment_status)}`}>
                        {row.payment_status}
                      </span>
                      {/* Pending with no session: checkout never started, and
                          nothing will ever mark this row paid on its own. */}
                      {row.payment_status === "pending" && !row.stripe_session_id && (
                        <span className="ml-2 rounded bg-alert/20 px-1.5 py-0.5 text-xs font-semibold text-alert">
                          checkout never started &mdash; follow up
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-white/60">
                      {row.consent_given ? (row.consent_at ? formatDate(row.consent_at) : "yes") : "—"}
                    </td>
                    <td className="py-3 text-white/55">{formatDateTime(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totals.registrations > PAGE_SIZE && (
              <div className="mt-4 flex items-center justify-between text-sm text-white/70">
                <span>
                  Showing {pageOffset + 1}&ndash;{pageOffset + rows.length} of {totals.registrations}
                </span>
                <span className="flex gap-3">
                  {currentPage > 1 && (
                    <Link
                      href={`/admin?event=mhapuja&page=${currentPage - 1}`}
                      className="underline underline-offset-4 hover:text-white"
                    >
                      Previous
                    </Link>
                  )}
                  {pageOffset + rows.length < totals.registrations && (
                    <Link
                      href={`/admin?event=mhapuja&page=${currentPage + 1}`}
                      className="underline underline-offset-4 hover:text-white"
                    >
                      Next
                    </Link>
                  )}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
