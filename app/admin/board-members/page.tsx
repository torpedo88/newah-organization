import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Edit2, Trash2, Plus } from "lucide-react";
import {
  ADMIN_COOKIE,
  adminAuthConfigured,
  sessionTokenIsValid,
} from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import FestivalBackdrop from "@/components/ui/festival-backdrop";

export const metadata: Metadata = {
  title: "Board Members - Admin",
  robots: { index: false, follow: false },
};

type BoardMember = {
  id: number;
  name: string;
  position: string;
  email: string | null;
  phone: string | null;
  active: boolean;
  display_order: number;
  created_at: string;
};

export default async function BoardMembersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const isValid = token && sessionTokenIsValid(token);

  if (!adminAuthConfigured() || !isValid) {
    return (
      <div className="relative min-h-screen px-4 py-12">
        <FestivalBackdrop />
        <div className="relative mx-auto w-full max-w-6xl text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Unauthorized</h1>
          <Link href="/admin">
            <LiquidButton>Back</LiquidButton>
          </Link>
        </div>
      </div>
    );
  }

  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data: members } = await supabase
    .from("board_members")
    .select("*")
    .order("display_order", { ascending: true });

  const rows = (members ?? []) as unknown as BoardMember[];

  return (
    <div className="relative min-h-screen px-4 py-12">
      <FestivalBackdrop />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Board Members</h1>
            <p className="mt-3 text-sm text-white/60">Active: {rows.filter(m => m.active).length}</p>
          </div>
          <Link href="/admin/board-members/create">
            <LiquidButton>
              <Plus className="size-4" />
              Add Member
            </LiquidButton>
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-8 text-center">
            <p className="text-white/60">No board members</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.07]">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/15 text-xs uppercase tracking-wide text-white/55">
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Position</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Order</th>
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/10 last:border-0">
                    <td className="py-3 px-4 font-medium text-white">{row.name}</td>
                    <td className="py-3 px-4 text-white/70">{row.position}</td>
                    <td className="py-3 px-4 text-white/70 text-xs">{row.email || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex text-xs px-2 py-1 rounded-full ${
                        row.active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {row.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70">{row.display_order}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <Link href={`/admin/board-members/${row.id}/edit`}>
                        <button className="text-lun hover:text-lun-bright">
                          <Edit2 className="size-4" />
                        </button>
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          const admin = createAdminClient();
                          if (admin) {
                            await admin.from("board_members").delete().eq("id", row.id);
                          }
                        }}
                      >
                        <button type="submit" className="text-red-400 hover:text-red-300">
                          <Trash2 className="size-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
