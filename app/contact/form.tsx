"use client";

import { useState } from "react";
import { submitContactForm } from "./actions";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await submitContactForm(formData);

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setLoading(false);
      setTimeout(() => setSuccess(false), 5000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
          <p className="text-green-400 text-sm">Message sent successfully! We'll get back to you soon.</p>
        </div>
      )}

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
        <label className="block text-sm font-medium text-white mb-1">Subject *</label>
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Message *</label>
        <textarea
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none text-sm"
        />
      </div>

      <LiquidButton type="submit" disabled={loading} className="w-full text-white text-sm">
        {loading ? "Sending..." : "Send Message"}
      </LiquidButton>
    </form>
  );
}
