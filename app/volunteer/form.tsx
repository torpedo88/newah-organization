"use client";

import { useState } from "react";
import { submitVolunteerSignup } from "./actions";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { ArrowRight } from "lucide-react";

export default function VolunteerForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    volunteer_type: "",
    skills: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await submitVolunteerSignup({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      volunteer_type: formData.volunteer_type,
      skills: formData.skills,
    });

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        volunteer_type: "",
        skills: "",
      });
      setLoading(false);
      setTimeout(() => setSuccess(false), 5000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto rounded-3xl border-2 border-white/20 bg-white/[0.07] p-8 space-y-4">
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
          <p className="text-green-400 text-sm">Thank you for your interest! We'll review your application and get back to you soon.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Interest Area *</label>
        <select
          required
          value={formData.volunteer_type}
          onChange={(e) => setFormData({ ...formData, volunteer_type: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-white/40 focus:outline-none text-sm"
        >
          <option value="">Select an area of interest</option>
          <option value="events">Event Coordination</option>
          <option value="language">Language Teaching</option>
          <option value="culture">Cultural Education</option>
          <option value="technology">Technology Support</option>
          <option value="documentation">Documentation</option>
          <option value="outreach">Community Outreach</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Tell us about yourself</label>
        <textarea
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="Share your skills, experience, and why you want to volunteer..."
          rows={4}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
        />
      </div>

      <button type="submit">
        <LiquidButton disabled={loading} className="w-full text-white">
          {loading ? "Submitting..." : "Submit Application"}
          <ArrowRight className="size-4" />
        </LiquidButton>
      </button>
    </form>
  );
}
