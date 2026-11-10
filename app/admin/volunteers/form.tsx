"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVolunteer, updateVolunteer } from "./actions";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

type Volunteer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  volunteer_type: string;
  availability: string | null;
  skills: string | null;
  interest_area: string | null;
  status: string;
  hours_logged: number;
  notes: string | null;
};

export default function VolunteerForm({ volunteer }: { volunteer?: Volunteer }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: volunteer?.name || "",
    email: volunteer?.email || "",
    phone: volunteer?.phone || "",
    volunteer_type: volunteer?.volunteer_type || "events",
    availability: volunteer?.availability || "",
    skills: volunteer?.skills || "",
    interest_area: volunteer?.interest_area || "",
    status: volunteer?.status || "active",
    hours_logged: volunteer?.hours_logged || 0,
    notes: volunteer?.notes || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = volunteer
      ? await updateVolunteer(volunteer.id, formData)
      : await createVolunteer(formData);

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/volunteers");
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
        <label className="block text-sm font-medium text-white mb-2">Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Email *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Volunteer Type *</label>
        <select
          required
          value={formData.volunteer_type}
          onChange={(e) => setFormData({ ...formData, volunteer_type: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-white/40 focus:outline-none"
        >
          <option value="events">Event Coordinator</option>
          <option value="language">Language Tutor</option>
          <option value="culture">Cultural Educator</option>
          <option value="technology">Technology Support</option>
          <option value="documentation">Documentation</option>
          <option value="outreach">Community Outreach</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Interest Area</label>
        <input
          type="text"
          value={formData.interest_area}
          onChange={(e) => setFormData({ ...formData, interest_area: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Availability</label>
        <textarea
          value={formData.availability}
          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          rows={2}
          placeholder="Weekends, evenings, etc."
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Skills</label>
        <textarea
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          rows={2}
          placeholder="List relevant skills"
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Hours Logged</label>
        <input
          type="number"
          step="0.5"
          value={formData.hours_logged}
          onChange={(e) => setFormData({ ...formData, hours_logged: parseFloat(e.target.value) })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-white/40 focus:outline-none"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div className="flex gap-4">
        <LiquidButton type="submit" disabled={loading} className="text-white">
          {loading ? "Saving..." : volunteer ? "Update" : "Create"}
        </LiquidButton>
      </div>
    </form>
  );
}
