"use client";

import { useState, useTransition } from "react";
import { checkInWholeParty } from "@/lib/actions/checkin";
import { toDollars } from "@/lib/payments/fees";

/**
 * "Check in" for one row of the admin registrations table. Paid rows check in
 * the whole party; unpaid rows record the registered amount as cash first,
 * after a confirm, since that marks money as received.
 */
export default function CheckinRowButton({
  code,
  paid,
  cents,
}: {
  code: string;
  paid: boolean;
  cents: number;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const label = paid ? "Check in" : `Took $${toDollars(cents)} cash · check in`;

  const onClick = () => {
    if (!paid && !window.confirm(`Record $${toDollars(cents)} cash for ${code} and check them in?`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await checkInWholeParty(code, !paid);
      if (!result.success) setError(result.error ?? "Check-in failed");
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
          paid ? "bg-[#4ADE80] text-haku hover:bg-[#4ADE80]/90" : "bg-lun text-haku hover:bg-lun/90"
        }`}
      >
        {pending ? "Checking in…" : label}
      </button>
      {error && <p className="mt-1 max-w-48 text-xs text-alert">{error}</p>}
    </div>
  );
}
