import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { COMMUNITY_PHOTOS } from "@/lib/constants/community-photos";
import SiteHeader from "@/components/ui/site-header";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { createClient } from "@/lib/supabase/server";

type Photo = { slug: string; image_url: string; alt_text: string; credit: string | null };

interface PhotoPageProps {
  params: Promise<{ slug: string }>;
}

/** Published photos in display order, or null when the table can't be read. */
async function loadPhotos(): Promise<Photo[] | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("community_photos")
      .select("slug, image_url, alt_text, credit")
      .eq("published", true)
      .order("display_order", { ascending: true });
    return error ? null : ((data ?? []) as Photo[]);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PhotoPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data: photo } = await supabase
      .from("community_photos")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    return {
      title: photo ? "Photo" : "Photo",
      description: photo?.alt_text || "Community photo",
    };
  } catch {
    return {
      title: "Photo",
      description: "Community photo",
    };
  }
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data: photos } = await supabase
      .from("community_photos")
      .select("slug")
      .eq("published", true);

    return (photos || []).map((photo: { slug: string }) => ({
      slug: photo.slug,
    }));
  } catch {
    return COMMUNITY_PHOTOS.map((photo) => ({
      slug: photo.slug,
    }));
  }
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { slug } = await params;
  const photos = await loadPhotos();

  if (!photos) {
    return (
      <main>
        <SiteHeader />
        <div className="relative min-h-screen px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <Link href="/">
              <LiquidButton>
                <ArrowLeft className="size-4" />
                Back to homepage
              </LiquidButton>
            </Link>
            <h1 className="mt-8 text-2xl font-bold text-white">Could not load photo</h1>
          </div>
        </div>
      </main>
    );
  }

  const photoIndex = photos.findIndex((p) => p.slug === slug);
  const photo = photos[photoIndex];

  if (!photo) {
    return (
      <main>
        <SiteHeader />
        <div className="relative min-h-screen px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <Link href="/">
              <LiquidButton>
                <ArrowLeft className="size-4" />
                Back to homepage
              </LiquidButton>
            </Link>
            <h1 className="mt-8 text-2xl font-bold text-white">Photo not found</h1>
          </div>
        </div>
      </main>
    );
  }

  const prevPhoto = photoIndex > 0 ? photos[photoIndex - 1] : null;
  const nextPhoto = photoIndex < photos.length - 1 ? photos[photoIndex + 1] : null;

  return (
    <main>
      <SiteHeader />
      <div className="relative min-h-screen px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <Link href="/">
            <LiquidButton>
              <ArrowLeft className="size-4" />
              Back to homepage
            </LiquidButton>
          </Link>

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/15">
            <div className="relative aspect-[3/4] sm:aspect-[4/3] md:aspect-video">
              <Image
                src={photo.image_url}
                alt={photo.alt_text}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="mt-8">
            <p className="text-lg leading-relaxed text-white/80">{photo.alt_text}</p>
            {photo.credit && (
              <p className="mt-4 text-sm text-white/60">Photo credit: {photo.credit}</p>
            )}
          </div>

          <div className="mt-12 flex items-center justify-between gap-4 border-t border-white/10 pt-8">
            {prevPhoto ? (
              <Link href={`/gallery/${prevPhoto.slug}`}>
                <LiquidButton>
                  <ArrowLeft className="size-4" />
                  Previous
                </LiquidButton>
              </Link>
            ) : (
              <div />
            )}

            <p className="text-sm text-white/60">
              {photoIndex + 1} of {photos.length}
            </p>

            {nextPhoto ? (
              <Link href={`/gallery/${nextPhoto.slug}`}>
                <LiquidButton>
                  Next
                  <ArrowLeft className="size-4 rotate-180" />
                </LiquidButton>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
