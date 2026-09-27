"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import AstaMangalWatermark from "@/components/ui/asta-mangal-watermark";

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
  tagline?: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaHref: string;
  secondaryText?: string;
  secondaryHref?: string;
  images: MarqueeImage[];
  /** The proof strip between the buttons and the photographs. */
  stats?: ReadonlyArray<{ value: string; label: string }>;
  /** The photograph behind the copy, anchored right. */
  backdrop?: { src: string; alt: string };
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
  stats,
  backdrop,
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
        "relative flex min-h-[100dvh] w-full flex-col overflow-hidden pt-28",
        className,
      )}
    >
      {/* The photograph, anchored right, with the copy reading over the dark
          side of it — the share card's composition, which is where this came
          from.

          The eight signs step aside when there is a photograph: two things
          competing for the space behind the same words is one too many. */}
      {backdrop ? (
        <>
          {/* A panel on the right, not the whole frame. Full-bleed made the
              mask enormous and painted over the haku patasi weave, which is the
              cloth the whole site is printed on and should not disappear
              behind one photograph.

              The file is cropped to the mask, its mane and the costume, and
              nothing else. The full photograph put bystanders in the hero,
              including a child, and a face at hero scale is a different thing
              from a face in a passing band of festival pictures — nobody at a
              public festival expects to become the front page.

              A portrait crop in a tall panel also behaves: the source is
              narrower than the panel, so cover trims the top and bottom and
              leaves the mask whole. Cropping wide and then covering a narrow
              panel magnifies twice, which is how an earlier attempt ended up
              with half a mask filling the screen. */}
          <div
            aria-hidden
            className="photo-bleed pointer-events-none absolute inset-y-0 right-0 w-[72%] rotate-[3deg] sm:right-[1%] sm:w-[48%]"
          >
            <Image
              src={backdrop.src}
              alt=""
              fill
              priority
              sizes="(max-width: 640px) 62vw, 44vw"
              /* cover, and the tilt is on the panel rather than on this.
                 contain leaves the photograph a rectangle inside the panel,
                 and rotating that rectangle put its own straight edges outside
                 the faded area — which is where the visible borders came from.
                 Filling the panel means the only edges are the panel's, and
                 those are masked; rotating the panel turns the mask with it. */
              className="object-cover object-center saturate-[0.92]"
            />
          </div>
          {/* Steeper on a phone, where the copy runs the full width and needs
              the whole frame behind it darkened rather than just the left. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(14,14,17,0.90)_0%,rgba(14,14,17,0.82)_58%,rgba(14,14,17,0.64)_100%)] sm:bg-[linear-gradient(100deg,rgba(14,14,17,0.97)_34%,rgba(14,14,17,0.80)_56%,rgba(14,14,17,0.42)_78%,rgba(14,14,17,0.22)_100%)]"
          />
        </>
      ) : (
        <>
          <AstaMangalWatermark />
          {/* A little depth under the headline, in the sari's red. Flat black
              behind a black-and-red palette reads as an unstyled page. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,rgba(126,10,28,0.55)_0%,transparent_60%)]"
          />
        </>
      )}

      {/* The photograph is decoration; its subject is described in the band
          below, where the same picture appears with its alt text. */}
      <span className="sr-only">{backdrop?.alt}</span>

      {/* Not the centred page container. Centring a fixed column left ~490px
          of nothing down the left of a 2000px screen while the header's own
          logo sat hard against the edge, so the hero read as indented. The
          copy lines up with the header instead, and max-w-2xl on the
          paragraph keeps the measure readable however wide the screen is. */}
      <div className="relative z-10 flex w-full flex-1 flex-col justify-center px-5 py-10 sm:px-8 lg:px-12">
        {/* Optional. It is off on the landing page: the header sets the
            organization's name in full a few pixels above, and a pill
            repeating it word for word is the same sentence twice. */}
        {tagline && (
          <motion.p
            initial="hidden"
            animate="show"
            variants={FADE_IN}
            className="mb-6 inline-block max-w-[92vw] text-balance rounded-full border border-lun/40 bg-lun/10 px-5 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-lun backdrop-blur-sm sm:text-xs"
          >
            {tagline}
          </motion.p>
        )}

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-[16ch] text-balance text-[2.6rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl"
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
          className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-white/75 sm:text-xl"
        >
          {description}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          transition={{ delay: 0.6 }}
          className="mt-9 flex flex-wrap items-center gap-4"
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

        {/* The proof strip.
            Between the buttons and the photographs there was nothing, on a
            hero tall enough that the gap read as unfinished rather than
            spacious. A community landing earns attention with evidence it is
            real, so the gap carries four facts — every one of them already
            true elsewhere in this codebase, none of them invented to fill a
            layout.

            Tabular figures: the numbers sit in a row, and proportional digits
            would leave them visibly unaligned. */}
        {stats && stats.length > 0 && (
          <motion.dl
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { delayChildren: 0.75, staggerChildren: 0.06 } } }}
            /* Two up on a phone, one row above it. Wrapping a flex row put
               each fact on its own line at 390px, which made the strip taller
               than the headline and pushed the photographs off the screen. */
            className="mt-11 grid grid-cols-2 gap-x-6 gap-y-6 sm:mt-12 sm:flex sm:flex-wrap sm:items-start sm:gap-x-12"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={FADE_IN} className="sm:min-w-[7rem]">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-bold tabular-nums text-2xl text-lun sm:text-3xl">
                    {stat.value}
                  </span>
                  <span
                    aria-hidden
                    className="mt-1.5 block text-[0.6875rem] font-medium uppercase leading-snug tracking-[0.16em] text-white/55"
                  >
                    {stat.label}
                  </span>
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        )}
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
