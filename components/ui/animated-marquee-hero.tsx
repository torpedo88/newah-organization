"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

/**
 * Marquee hero, from 21st.dev, rebuilt for this chapter.
 *
 * The original is a white-background stock-video advertisement: `bg-background`,
 * `text-muted-foreground`, a red-500 button and sixteen CDN placeholder images.
 * What survives is the idea — a still headline over a slow band of
 * photographs. Everything else is the organization's.
 *
 * Four things were changed, and each would be a defect if it were not:
 *
 * 1. The shadcn colour tokens are wrong here. `--background` is white in this
 *    project; only `.dark` makes it dark, and the page does not set that class.
 *    Rendering the original would have produced a white hero on a black site.
 *    The haku patasi palette is used directly instead.
 * 2. `framer-motion` is not installed. It is the same library under its old
 *    name — the import is `motion/react`.
 * 3. `repeat: Infinity` with no escape ignores `prefers-reduced-motion`. The
 *    band holds still when motion is not wanted; the photographs are the
 *    content, so they stay either way.
 * 4. The call to action was a `<button>` that did nothing. Registration is the
 *    point of this page, so it is a link.
 *
 * The photographs are the chapter's own, from Indra Jatra 2023 at Berkeley
 * Marina. That matters more than the animation: it is this community, in
 * California, rather than borrowed pictures of Kathmandu.
 */

export type MarqueeImage = {
  src: string;
  alt: string;
};

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaHref: string;
  secondaryText?: string;
  secondaryHref?: string;
  images: MarqueeImage[];
  className?: string;
}

const FADE_IN = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export function AnimatedMarqueeHero({
  tagline,
  title,
  description,
  ctaText,
  ctaHref,
  secondaryText,
  secondaryHref,
  images,
  className,
}: AnimatedMarqueeHeroProps) {
  const reduceMotion = usePrefersReducedMotion();

  // A seamless marquee needs two identical halves and a translation of exactly
  // one of them, so the jump back to the start lands on the same picture.
  //
  // The original pasted sixteen URLs and animated -100% to 0%, which only
  // looks continuous because sixteen images are far wider than a screen. With
  // four photographs that leaves the band empty for most of the loop, so each
  // half repeats the set until it is wider than any viewport, and the travel
  // is -50% — one half — rather than -100%.
  const half = [...images, ...images];
  const marqueeImages = [...half, ...half];

  return (
    <section
      className={cn(
        // The copy and the band are two rows of a column, not text centred in
        // the viewport with a band laid over it. The original does the latter,
        // which puts the photographs across the paragraph and the buttons on
        // any short window; padding the text off an absolute band then pushes
        // it up under the fixed header instead. As rows, neither can happen.
        "relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-haku pt-28 text-center",
        className,
      )}
    >
      {/* A little depth under the headline, in the sari's red. Flat black
          behind a black-and-red palette reads as an unstyled page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,rgba(126,10,28,0.55)_0%,transparent_60%)]"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          className="mb-6 inline-block max-w-[92vw] text-balance rounded-full border border-lun/40 bg-lun/10 px-5 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-lun backdrop-blur-sm sm:text-xs"
        >
          {tagline}
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="text-balance text-[2.6rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl"
        >
          {typeof title === "string"
            ? title.split(" ").map((word, i) => (
                <motion.span key={i} variants={FADE_IN} className="inline-block">
                  {word}&nbsp;
                </motion.span>
              ))
            : title}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          transition={{ delay: 0.5 }}
          className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl"
        >
          {description}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-patasi px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-patasi-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lun sm:text-sm"
          >
            {ctaText}
            <ArrowRight className="size-4" aria-hidden />
          </Link>

          {secondaryText && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lun sm:text-sm"
            >
              {secondaryText}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </motion.div>
      </div>

      <div className="pointer-events-none relative h-60 w-full shrink-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)] md:h-80">
        <motion.div
          className="flex h-full items-end gap-4 pb-6"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 45, repeat: Infinity }}
        >
          {marqueeImages.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className="relative aspect-[3/4] h-44 flex-shrink-0 overflow-hidden rounded-2xl md:h-60"
              style={{ rotate: `${index % 2 === 0 ? -2 : 5}deg` }}
            >
              <Image
                src={image.src}
                /* The band is decorative repetition of the same set; naming
                   each photograph twice would have a screen reader read the
                   chapter's festival out twice over. The first copy carries
                   the description, the second is hidden. */
                alt={index < images.length ? image.alt : ""}
                fill
                sizes="(max-width: 768px) 132px, 180px"
                /* The band is above the fold, so Next reports the first
                   photograph as the largest contentful paint. Only that one is
                   given priority — preloading all sixteen tiles would trade
                   the warning for a slower page. */
                priority={index === 0}
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default AnimatedMarqueeHero;
