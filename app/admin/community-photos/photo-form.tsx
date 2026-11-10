"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPhoto, updatePhoto } from "./actions";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

type Photo = {
  id: number;
  slug: string;
  image_url: string;
  alt_text: string;
  credit: string | null;
  display_order: number;
  published: boolean;
};

export default function PhotoForm({ photo }: { photo?: Photo }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slug: photo?.slug || "",
    image_url: photo?.image_url || "",
    alt_text: photo?.alt_text || "",
    credit: photo?.credit || "",
    display_order: photo?.display_order || 0,
    published: photo?.published ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = photo
      ? await updatePhoto(photo.id, formData)
      : await createPhoto(formData);

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/community-photos");
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
          Slug *
        </label>
        <input
          type="text"
          required
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="photo-slug"
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Image URL *
        </label>
        <input
          type="url"
          required
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://..."
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
        {formData.image_url && (
          <img
            src={formData.image_url}
            alt="Preview"
            className="mt-2 h-32 w-32 rounded-lg object-cover"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Alt Text *
        </label>
        <textarea
          required
          value={formData.alt_text}
          onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
          rows={3}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Photographer Credit
        </label>
        <input
          type="text"
          value={formData.credit}
          onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
          placeholder="Photographer name"
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Display Order
        </label>
        <input
          type="number"
          value={formData.display_order}
          onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium text-white">Published</span>
        </label>
      </div>

      <div className="flex gap-4">
        <LiquidButton type="submit" disabled={loading} className="text-white">
          {loading ? "Saving..." : photo ? "Update Photo" : "Create Photo"}
        </LiquidButton>
      </div>
    </form>
  );
}
