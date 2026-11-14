import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LogOut, TriangleAlert } from "lucide-react";
import {
  ADMIN_COOKIE,
  adminAuthConfigured,
  sessionTokenIsValid,
} from "@/lib/admin/session";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import AdminBackdrop from "@/components/ui/admin-backdrop";
import { logOut } from "../actions";
import DonationsPage from "../donations-page";
import SidebarNav from "@/components/admin/sidebar-nav";

export const metadata: Metadata = {
  title: "Donations - Admin - Newah Organization",
  robots: { index: false, follow: false },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <SidebarNav />
      <div className="relative ml-64 px-4 py-12 sm:px-6 lg:px-8">
        <AdminBackdrop />
        <div className="relative mx-auto w-full max-w-6xl">{children}</div>
      </div>
    </div>
  );
}

const PANEL_CLASS =
  "rounded-3xl border border-white/10 bg-white/[0.07] p-8 backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]";

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Shell>
      <div className="mx-auto max-w-lg text-center text-white">
        <TriangleAlert className="mx-auto mb-4 size-10 text-lun" strokeWidth={1.5} aria-hidden />
        <h1 className="mb-2 text-2xl font-bold">{title}</h1>
        <p className="text-white/70">{children}</p>
      </div>
    </Shell>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-white/10 px-1.5 py-0.5">{children}</code>;
}

export default async function DonationsAdminPage() {
  if (!adminAuthConfigured()) {
    return (
      <Notice title="Admin is not configured">
        Set <Code>ADMIN_PASSWORD</Code> and <Code>SUPABASE_SERVICE_ROLE_KEY</Code> in the Vercel
        project, then redeploy. Until then this page cannot show donations.
      </Notice>
    );
  }

  const jar = await cookies();
  if (!sessionTokenIsValid(jar.get(ADMIN_COOKIE)?.value)) {
    return (
      <Shell>
        <div className="mx-auto max-w-sm">
          <div className={PANEL_CLASS}>
            <div className="mb-6 text-center text-white">
              <h1 className="text-2xl font-bold">Access Required</h1>
              <p className="mt-1 text-sm text-white/70">Please sign in to access donations.</p>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Donations</h1>
          <p className="mt-3 text-sm text-white/60">
            Manage cash and Zelle donations pending approval
          </p>
        </div>
        <form action={logOut}>
          <LiquidButton type="submit" size="default" className="text-white">
            <LogOut className="size-4" aria-hidden />
            Sign out
          </LiquidButton>
        </form>
      </div>

      <DonationsPage panelClassName={PANEL_CLASS} />
    </Shell>
  );
}
