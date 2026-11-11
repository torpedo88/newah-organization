"use client";

import { formatDateTime } from "@/lib/constants/time";

type DoorRegistration = {
  id: number;
  registration_code: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  adult_count: number;
  child_count: number;
  payment_method: "cash" | "zelle";
  created_at: string;
  checked_in_at: string | null;
  adults_present: number | null;
  children_present: number | null;
};

export default function DoorRegistrationsTable({
  registrations,
}: {
  registrations: DoorRegistration[];
}) {
  return (
    <div className="space-y-4">
      <div className="-mx-8 overflow-x-auto px-8">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/15 text-xs uppercase tracking-wide text-white/55">
              <th className="py-3 pr-4 font-semibold">Code</th>
              <th className="py-3 pr-4 font-semibold">Name</th>
              <th className="py-3 pr-4 font-semibold">Contact</th>
              <th className="py-3 pr-4 font-semibold">Guests</th>
              <th className="py-3 pr-4 font-semibold">Payment</th>
              <th className="py-3 pr-4 font-semibold">Check-In</th>
              <th className="py-3 font-semibold">Registered</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((row) => (
              <tr key={row.id} className="border-b border-white/10 last:border-0">
                <td className="py-3 pr-4 font-mono text-white/70">{row.registration_code}</td>
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
                <td className="py-3 pr-4">
                  <span
                    className={
                      row.payment_method === "cash"
                        ? "rounded bg-blue-500/20 px-2 py-1 text-xs font-semibold text-blue-400"
                        : "rounded bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-400"
                    }
                  >
                    {row.payment_method === "cash" ? "💵 Cash" : "💳 Zelle"}
                  </span>
                </td>
                <td className="py-3 pr-4 text-white/70">
                  {row.checked_in_at ? (
                    <div>
                      <div className="text-green-400">✓ Checked in</div>
                      <div className="text-white/50 text-xs">
                        {row.adults_present ?? 0} adults, {row.children_present ?? 0} children
                      </div>
                    </div>
                  ) : (
                    <div className="text-yellow-500">Pending</div>
                  )}
                </td>
                <td className="py-3 text-white/55">{formatDateTime(row.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {registrations.length === 0 && (
        <p className="py-10 text-center text-white/60">No walk-in registrations found.</p>
      )}
    </div>
  );
}
