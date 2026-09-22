import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LockKeyhole, LogOut, TriangleAlert } from "lucide-react";
import {
  ADMIN_COOKIE,
  adminAuthConfigured,
  sessionTokenIsValid,
} from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import FestivalBackdrop from "@/components/ui/festival-backdrop";
import { EVENT } from "@/lib/constants/event";
import { toDollars } from "@/lib/payments/fees";
import { logIn, logOut } from "./actions";

export const metadata: Metadata = {
  title: "Admin - Newah Organization",
  robots: { index: false, follow: false },
};

type RegistrationRow = {
  id: string;
  registration_code: string;
  full_name: string;
  phone: string;
  email: string;
  number_of_guests: number | null;
  brought_food: boolean | null;
  food_description: string | null;
  donation_cents: number | null;
  charged_cents: number | null;
  payment_status: string | null;
  consent_given: boolean | null;
  consent_at: string | null;
  created_at: string;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <FestivalBackdrop />
      <div className="relative mx-auto w-full max-w-6xl">{children}</div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-8 backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]">
      {children}
    </div>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Shell>
      <Panel>
        <div className="mx-auto max-w-lg text-center text-white">
          <TriangleAlert className="mx-auto mb-4 size-10 text-lun" strokeWidth={1.5} aria-hidden />
          <h1 className="mb-2 text-2xl font-bold">{title}</h1>
          <p className="text-white/70">{children}</p>
        </div>
      </Panel>
    </Shell>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-white/10 px-1.5 py-0.5">{children}</code>;
}

export default async function AdminPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await props.searchParams;

  // Missing configuration must explain itself rather than 500 the route.
  if (!adminAuthConfigured()) {
    return (
      <Notice title="Admin is not configured">
        Set <Code>ADMIN_PASSWORD</Code> and <Code>SUPABASE_SERVICE_ROLE_KEY</Code> in the Vercel
        project, then redeploy. Until then this page cannot show registrations.
      </Notice>
    );
  }

  const jar = await cookies();
  if (!sessionTokenIsValid(jar.get(ADMIN_COOKIE)?.value)) {
    return (
      <Shell>
        <div className="mx-auto max-w-sm">
          <Panel>
            <div className="mb-6 text-center text-white">
              <LockKeyhole className="mx-auto mb-3 size-9 text-lun" strokeWidth={1.5} aria-hidden />
              <h1 className="text-2xl font-bold">Board access</h1>
              <p className="mt-1 text-sm text-white/70">
                This page lists registrants&rsquo; contact details.
              </p>
            </div>
            <form action={logIn} className="space-y-4">
              <label htmlFor="password" className="block text-sm font-semibold text-white">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-white placeholder-white/50 transition-all focus:border-patasi focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_rgba(192,16,43,0.35)] focus:outline-none"
              />
              {error && <p className="text-sm text-alert">That password was not correct.</p>}
              <LiquidButton type="submit" size="xl" className="w-full text-white">
                Sign in
              </LiquidButton>
            </form>
          </Panel>
        </div>
      </Shell>
    );
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return (
      <Notice title="Cannot read registrations">
        <Code>SUPABASE_SERVICE_ROLE_KEY</Code> is not set. The registrations table has no public
        read policy by design, so the board needs the service role to read it.
      </Notice>
    );
  }

  const { data, error: queryError } = await supabase
    .from("registrations")
    .select(
      "id, registration_code, full_name, phone, email, number_of_guests, brought_food, " +
        "food_description, donation_cents, charged_cents, payment_status, consent_given, " +
        "consent_at, created_at",
    )
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as RegistrationRow[];
  const donations = rows.filter((row) => (row.donation_cents ?? 0) > 0);
  const guests = rows.reduce((total, row) => total + (row.number_of_guests ?? 0), 0);
  const bringingFood = rows.filter((row) => row.brought_food === true).length;
  // Only Stripe-confirmed payments count toward what the fund actually receives.
  const paidCents = donations
    .filter((row) => row.payment_status === "paid")
    .reduce((total, row) => total + (row.donation_cents ?? 0), 0);
  const pendingCents = donations
    .filter((row) => row.payment_status === "pending")
    .reduce((total, row) => total + (row.donation_cents ?? 0), 0);

  const stats = [
    { label: "Registrations", value: String(rows.length) },
    { label: "Guests expected", value: String(guests) },
    { label: "Bringing food", value: String(bringingFood) },
    { label: `Confirmed for the fund`, value: `$${toDollars(paidCents)}` },
    { label: "Awaiting payment", value: `$${toDollars(pendingCents)}` },
  ];

  return (
    <Shell>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Registrations</h1>
          <p className="mt-1 text-sm text-white/60">
            {EVENT.title} &middot; {rows.length} {rows.length === 1 ? "entry" : "entries"}, newest
            first
          </p>
        </div>
        <form action={logOut}>
          <LiquidButton type="submit" size="default" className="text-white">
            <LogOut className="size-4" aria-hidden />
            Sign out
          </LiquidButton>
        </form>
      </div>

      {queryError ? (
        <Panel>
          <div className="text-center text-white">
            <TriangleAlert className="mx-auto mb-4 size-10 text-alert" strokeWidth={1.5} aria-hidden />
            <h2 className="mb-2 text-xl font-bold">Could not load registrations</h2>
            <p className="text-white/70">{queryError.message}</p>
          </div>
        </Panel>
      ) : (
        <>
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

          <Panel>
            {rows.length === 0 ? (
              <p className="py-10 text-center text-white/60">No registrations yet.</p>
            ) : (
              <div className="-mx-8 overflow-x-auto px-8">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/15 text-xs uppercase tracking-wide text-white/55">
                      <th className="py-3 pr-4 font-semibold">Code</th>
                      <th className="py-3 pr-4 font-semibold">Name</th>
                      <th className="py-3 pr-4 font-semibold">Contact</th>
                      <th className="py-3 pr-4 font-semibold">Guests</th>
                      <th className="py-3 pr-4 font-semibold">Food</th>
                      <th className="py-3 pr-4 font-semibold">Donation</th>
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
                        <td className="py-3 pr-4 text-white/70">{row.number_of_guests ?? 1}</td>
                        <td className="py-3 pr-4 text-white/70">
                          {row.brought_food ? row.food_description || "Yes" : "—"}
                        </td>
                        <td className="py-3 pr-4 text-white/70">
                          {(row.donation_cents ?? 0) > 0 ? (
                            <>
                              <span className="font-medium text-white">
                                ${toDollars(row.donation_cents ?? 0)}
                              </span>
                              <span
                                className={
                                  row.payment_status === "paid"
                                    ? "ml-2 text-[#4ADE80]"
                                    : row.payment_status === "failed"
                                      ? "ml-2 text-alert"
                                      : "ml-2 text-lun"
                                }
                              >
                                {row.payment_status}
                              </span>
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-3 pr-4 text-white/60">
                          {row.consent_given
                            ? row.consent_at
                              ? new Date(row.consent_at).toLocaleDateString()
                              : "yes"
                            : "—"}
                        </td>
                        <td className="py-3 text-white/55">
                          {new Date(row.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </>
      )}
    </Shell>
  );
}
