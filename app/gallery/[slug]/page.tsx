import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { COMMUNITY_PHOTOS } from "@/lib/constants/community-photos";
import SiteHeader from "@/components/ui/site-header";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

interface PhotoPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PhotoPageProps): Promise<Metadata> {
  const photo = COMMUNITY_PHOTOS.find((p) => p.slug === params.slug);
  return {
    title: photo ? `Photo - ${COMMUNITY_PHOTOS.indexOf(photo) + 1}` : "Photo",
    description: photo?.alt || "Community photo",
  };
}

export async function generateStaticParams() {
  return COMMUNITY_PHOTOS.map((photo) => ({
    slug: photo.slug,
  }));
}

export default function PhotoPage({ params }: PhotoPageProps) {
  const photoIndex = COMMUNITY_PHOTOS.findIndex((p) => p.slug === params.slug);
  const photo = COMMUNITY_PHOTOS[photoIndex];

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

  const prevPhoto = photoIndex > 0 ? COMMUNITY_PHOTOS[photoIndex - 1] : null;
  const nextPhoto = photoIndex < COMMUNITY_PHOTOS.length - 1 ? COMMUNITY_PHOTOS[photoIndex + 1] : null;

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
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="mt-8">
            <p className="text-lg leading-relaxed text-white/80">{photo.alt}</p>
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
              {photoIndex + 1} of {COMMUNITY_PHOTOS.length}
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
