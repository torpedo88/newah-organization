import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  adminAuthConfigured,
  sessionTokenIsValid,
} from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { FOOD_OPTIONS } from "@/lib/constants/food";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import FestivalBackdrop from "@/components/ui/festival-backdrop";
import { logIn, logOut } from "./actions";
import { LockKeyhole, LogOut, TriangleAlert, Users, UtensilsCrossed, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin - Newah Organization",
  robots: { index: false, follow: false },
};

type RegistrationRow = {
  id: string;
  registration_code: string;
  registration_type: string;
  full_name: string;
  phone: string;
  email: string;
  number_of_guests: number | null;
  food_option: string | null;
  donation_amount: number | null;
  created_at: string;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <FestivalBackdrop />
      <div className="relative mx-auto w-full max-w-5xl">{children}</div>
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

function foodLabel(id: string | null) {
  if (!id) return "—";
  return FOOD_OPTIONS.find((option) => option.id === id)?.label ?? id;
}

export default async function AdminPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await props.searchParams;

  // A missing password must explain itself rather than 500 the route.
  if (!adminAuthConfigured()) {
    return (
      <Shell>
        <Panel>
          <div className="mx-auto max-w-lg text-center text-white">
            <TriangleAlert className="mx-auto mb-4 size-10 text-[#FF9A6A]" strokeWidth={1.5} aria-hidden />
            <h1 className="mb-2 text-2xl font-bold">Admin is not configured</h1>
            <p className="text-white/70">
              Set <code className="rounded bg-white/10 px-1.5 py-0.5">ADMIN_PASSWORD</code> and{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> in
              the Vercel project, then redeploy. Until then this page cannot show registrations.
            </p>
          </div>
        </Panel>
      </Shell>
    );
  }

  const jar = await cookies();
  const signedIn = sessionTokenIsValid(jar.get(ADMIN_COOKIE)?.value);

  if (!signedIn) {
    return (
      <Shell>
        <div className="mx-auto max-w-sm">
          <Panel>
            <div className="mb-6 text-center text-white">
              <LockKeyhole className="mx-auto mb-3 size-9 text-[#FF9A6A]" strokeWidth={1.5} aria-hidden />
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
                className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-white placeholder-white/50 transition-all focus:border-[#FF7A45] focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_rgba(255,122,69,0.2)] focus:outline-none"
              />
              {error && (
                <p className="text-sm text-[#FF3B30]">That password was not correct.</p>
              )}
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
      <Shell>
        <Panel>
          <div className="mx-auto max-w-lg text-center text-white">
            <TriangleAlert className="mx-auto mb-4 size-10 text-[#FF9A6A]" strokeWidth={1.5} aria-hidden />
            <h1 className="mb-2 text-2xl font-bold">Cannot read registrations</h1>
            <p className="text-white/70">
              <code className="rounded bg-white/10 px-1.5 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> is
              not set. The registrations table has no public read policy by design, so the board
              needs the service role to read it.
            </p>
          </div>
        </Panel>
      </Shell>
    );
  }

  const { data, error: queryError } = await supabase
    .from("registrations")
    .select(
      "id, registration_code, registration_type, full_name, phone, email, number_of_guests, food_option, donation_amount, created_at",
    )
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as RegistrationRow[];
  const food = rows.filter((row) => row.registration_type === "food");
  const donations = rows.filter((row) => row.registration_type === "donation");
  const guests = food.reduce((total, row) => total + (row.number_of_guests ?? 0), 0);
  const raised = donations.reduce((total, row) => total + (row.donation_amount ?? 0), 0);

  return (
    <Shell>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Registrations</h1>
          <p className="mt-1 text-sm text-white/60">
            {rows.length} {rows.length === 1 ? "entry" : "entries"}, newest first
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
            <TriangleAlert className="mx-auto mb-4 size-10 text-[#FF3B30]" strokeWidth={1.5} aria-hidden />
            <h2 className="mb-2 text-xl font-bold">Could not load registrations</h2>
            <p className="text-white/70">{queryError.message}</p>
          </div>
        </Panel>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: UtensilsCrossed, label: "Food registrations", value: String(food.length) },
              { icon: Users, label: "Guests expected", value: String(guests) },
              {
                icon: HeartHandshake,
                label: "Donations",
                value: `${donations.length} · $${raised.toFixed(2)}`,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
              >
                <stat.icon className="mb-3 size-6 text-[#FF9A6A]" strokeWidth={1.5} aria-hidden />
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
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/15 text-xs uppercase tracking-wide text-white/55">
                      <th className="py-3 pr-4 font-semibold">Code</th>
                      <th className="py-3 pr-4 font-semibold">Name</th>
                      <th className="py-3 pr-4 font-semibold">Contact</th>
                      <th className="py-3 pr-4 font-semibold">Type</th>
                      <th className="py-3 pr-4 font-semibold">Details</th>
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
                        <td className="py-3 pr-4 text-white/70 capitalize">{row.registration_type}</td>
                        <td className="py-3 pr-4 text-white/70">
                          {row.registration_type === "food"
                            ? `${foodLabel(row.food_option)} · ${row.number_of_guests ?? 1} guest(s)`
                            : `$${(row.donation_amount ?? 0).toFixed(2)}`}
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
