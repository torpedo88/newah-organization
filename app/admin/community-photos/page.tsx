import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { TriangleAlert, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import {
  ADMIN_COOKIE,
  adminAuthConfigured,
  sessionTokenIsValid,
} from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import FestivalBackdrop from "@/components/ui/festival-backdrop";

export const metadata: Metadata = {
  title: "Community Photos - Admin",
  robots: { index: false, follow: false },
};

type PhotoRow = {
  id: number;
  slug: string;
  image_url: string;
  alt_text: string;
  credit: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
};

export default async function CommunityPhotosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const isValid = token && sessionTokenIsValid(token);

  if (!adminAuthConfigured()) {
    return (
      <div className="relative min-h-screen px-4 py-12">
        <FestivalBackdrop />
        <div className="relative mx-auto w-full max-w-6xl text-center">
          <TriangleAlert className="mx-auto mb-4 size-10 text-lun" strokeWidth={1.5} aria-hidden />
          <h1 className="mb-2 text-2xl font-bold text-white">Admin is not configured</h1>
          <p className="text-white/70">Set required environment variables</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="relative min-h-screen px-4 py-12">
        <FestivalBackdrop />
        <div className="relative mx-auto w-full max-w-6xl text-center">
          <h1 className="mb-2 text-2xl font-bold text-white">Unauthorized</h1>
          <Link href="/admin">
            <LiquidButton>Back to Admin</LiquidButton>
          </Link>
        </div>
      </div>
    );
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return (
      <div className="relative min-h-screen px-4 py-12">
        <FestivalBackdrop />
        <div className="relative mx-auto w-full max-w-6xl text-center">
          <h1 className="mb-2 text-2xl font-bold text-white">Cannot connect to database</h1>
          <p className="text-white/70">Service role key not configured</p>
        </div>
      </div>
    );
  }

  const { data: photos, error } = await supabase
    .from("community_photos")
    .select("*")
    .order("display_order", { ascending: true });

  const rows = (photos ?? []) as unknown as PhotoRow[];

  return (
    <div className="relative min-h-screen px-4 py-12">
      <FestivalBackdrop />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Community Photos</h1>
            <p className="mt-3 text-sm text-white/60 flex gap-6">
              <Link href="/admin" className="underline underline-offset-2 hover:text-white">
                Registrations
              </Link>
              <Link href="/admin/events" className="underline underline-offset-2 hover:text-white">
                Events
              </Link>
              <span className="text-white/90">Photos ({rows.length})</span>
            </p>
          </div>
          <Link href="/admin/community-photos/create">
            <LiquidButton>Add Photo</LiquidButton>
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-4">
            <p className="text-red-400">{error.message}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-8 text-center">
            <p className="text-white/60">No photos yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.07]">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/15 text-xs uppercase tracking-wide text-white/55">
                  <th className="py-3 px-4 font-semibold">Slug</th>
                  <th className="py-3 px-4 font-semibold">Image</th>
                  <th className="py-3 px-4 font-semibold">Alt Text</th>
                  <th className="py-3 px-4 font-semibold">Credit</th>
                  <th className="py-3 px-4 font-semibold">Order</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/10 last:border-0">
                    <td className="py-3 px-4 font-mono text-white/90">{row.slug}</td>
                    <td className="py-3 px-4">
                      <img
                        src={row.image_url}
                        alt={row.alt_text}
                        className="h-12 w-12 rounded object-cover"
                      />
                    </td>
                    <td className="py-3 px-4 text-white/70 text-xs max-w-xs truncate">{row.alt_text}</td>
                    <td className="py-3 px-4 text-white/70 text-xs">{row.credit || "—"}</td>
                    <td className="py-3 px-4 text-white/70">{row.display_order}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        row.published
                          ? "bg-green-500/20 text-green-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {row.published ? (
                          <>
                            <Eye className="size-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="size-3" />
                            Draft
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <Link href={`/admin/community-photos/${row.id}/edit`}>
                        <button className="text-lun hover:text-lun-bright">
                          <Edit2 className="size-4" />
                        </button>
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          const admin = createAdminClient();
                          if (admin) {
                            await admin.from("community_photos").delete().eq("id", row.id);
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
