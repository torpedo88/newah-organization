"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "./actions";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

type Event = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  event_date: string;
  location: string | null;
  capacity: number | null;
  image_url: string | null;
};

export default function EventForm({ event }: { event?: Event }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: event?.title || "",
    slug: event?.slug || "",
    description: event?.description || "",
    event_date: event?.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : "",
    location: event?.location || "",
    capacity: event?.capacity || "",
    image_url: event?.image_url || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : 0,
    };

    const result = event
      ? await updateEvent(event.id, data)
      : await createEvent(data);

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/events");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Slug *
        </label>
        <input
          type="text"
          required
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="url-friendly-slug"
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Date & Time *
        </label>
        <input
          type="datetime-local"
          required
          value={formData.event_date}
          onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Capacity
        </label>
        <input
          type="number"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Image URL
        </label>
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div className="flex gap-4">
        <LiquidButton type="submit" disabled={loading} className="text-white">
          {loading ? "Saving..." : event ? "Update Event" : "Create Event"}
        </LiquidButton>
      </div>
    </form>
  );
}
