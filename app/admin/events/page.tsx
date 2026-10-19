import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Plus, Edit, Eye, EyeOff, Users } from "lucide-react";
import {
  ADMIN_COOKIE,
  sessionTokenIsValid,
} from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import AdminBackdrop from "@/components/ui/admin-backdrop";
import { formatDate } from "@/lib/constants/time";
import { togglePublish } from "./actions";
import DeleteEventButton from "./delete-event-button";
import { hasRegistrations } from "@/lib/admin/event-registrations";

export const metadata: Metadata = {
  title: "Manage Events - Admin",
  robots: { index: false, follow: false },
};

type Event = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  capacity: number | null;
  published: boolean;
  created_at: string;
};

export default async function AdminEventsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const isValid = token && sessionTokenIsValid(token);

  if (!isValid) {
    return (
      <div className="relative min-h-screen px-4 py-12">
        <AdminBackdrop />
        <div className="relative mx-auto w-full max-w-6xl text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Unauthorized</h1>
          <p className="text-white/70 mb-8">Please log in from the admin panel.</p>
          <Link href="/admin">
            <LiquidButton>Back to Admin</LiquidButton>
          </Link>
        </div>
      </div>
    );
  }

  const admin = createAdminClient();
  if (!admin) {
    return (
      <div className="relative min-h-screen px-4 py-12">
        <AdminBackdrop />
        <div className="relative mx-auto w-full max-w-6xl text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Cannot read events</h1>
          <p className="text-white/70 mb-8">
            SUPABASE_SERVICE_ROLE_KEY is not set, so the events table cannot be reached.
          </p>
          <Link href="/admin">
            <LiquidButton>Back to Admin</LiquidButton>
          </Link>
        </div>
      </div>
    );
  }

  const { data: events, error } = await admin
    .from("events")
    .select("*")
    .order("event_date", { ascending: false, nullsFirst: false });

  return (
    <div className="relative min-h-screen px-4 py-12">
      <AdminBackdrop />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Events Management</h1>
            <Link href="/admin/events/create">
              <LiquidButton className="flex items-center gap-2">
                <Plus className="size-4" />
                New Event
              </LiquidButton>
            </Link>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
              <p className="text-red-400">Error loading events: {error.message}</p>
            </div>
          ) : !events || events.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-white/70">No events yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 font-semibold text-white">Title</th>
                    <th className="px-4 py-3 font-semibold text-white">Date</th>
                    <th className="px-4 py-3 font-semibold text-white">Location</th>
                    <th className="px-4 py-3 font-semibold text-white">Capacity</th>
                    <th className="px-4 py-3 font-semibold text-white">Status</th>
                    <th className="px-4 py-3 font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event: Event) => (
                    <tr key={event.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3 text-white">{event.title}</td>
                      <td className="px-4 py-3 text-white/70">{formatDate(event.event_date)}</td>
                      <td className="px-4 py-3 text-white/70">{event.location || "—"}</td>
                      <td className="px-4 py-3 text-white/70">{event.capacity || "—"}</td>
                      <td className="px-4 py-3">
                        <form
                          action={async () => {
                            "use server";
                            await togglePublish(event.id);
                          }}
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors"
                            title={event.published ? "Unpublish" : "Publish"}
                          >
                            {event.published ? (
                              <>
                                <Eye className="size-3" />
                                <span className="text-green-400">Published</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="size-3" />
                                <span className="text-white/50">Draft</span>
                              </>
                            )}
                          </button>
                        </form>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {hasRegistrations(event.slug) ? (
                            <Link
                              href={`/admin?event=${event.slug}`}
                              className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-lun hover:bg-lun/10 transition-colors"
                            >
                              <Users className="size-3" />
                              Registrations
                            </Link>
                          ) : (
                            <span
                              className="px-2 py-1 text-xs text-white/40"
                              title="No registration form is built for this event yet"
                            >
                              No registration form
                            </span>
                          )}
                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-400 hover:bg-blue-400/10 transition-colors"
                          >
                            <Edit className="size-3" />
                            Edit
                          </Link>
                          {!hasRegistrations(event.slug) && <DeleteEventButton id={event.id} />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link href="/admin">
            <LiquidButton className="text-white">Back to Admin</LiquidButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
