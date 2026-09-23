"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { MeshGradient } from "@paper-design/shaders-react";
import { ORG } from "@/lib/legal/org";
import { NEPAL_SAMBAT } from "@/lib/constants/event";

/**
 * Shader hero, from 21st.dev, rebuilt in the chapter's own colours.
 *
 * The original is a cyan-and-orange showcase with placeholder navigation and
 * "21st.dev is amazing" orbiting a pulsing border. What survives is the
 * technique: two layered mesh gradients, a glass-filtered badge, and text on
 * a circular path. Everything else is the organization's.
 *
 * The gradient runs on haku patasi: the black of the sari, its red border and
 * the gold edging. No cyan, no orange, and no gradient text — the palette is
 * four colours with meaning, not decoration.
 */

/** Black, deep red, red, gold — the sari, in the order its bands run. */
const HAKU_PATASI = ["#0E0E11", "#7E0A1C", "#C0102B", "#C9A227"];
const HAKU_PATASI_WIRE = ["#0E0E11", "#C9A227", "#C0102B", "#F3E8D8"];

export default function ShaderHero() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-haku">
      {/* Filters. The gooey and glass effects are kept; the original's
          cyan/white logo gradient and text glow are not — nothing here needs
          text rendered as a gradient. */}
      <svg className="absolute inset-0 h-0 w-0" aria-hidden>
        <defs>
          <filter id="haku-glass" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
          </filter>
        </defs>
      </svg>

      {/* Motion is the whole point of a shader, so when it is not wanted the
          shader does not run at all: a still gradient in the same colours
          carries the palette without a GPU loop or anything moving. */}
      {reduceMotion ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 20% 15%, #7E0A1C 0%, transparent 55%)," +
              "radial-gradient(90% 70% at 85% 80%, #C0102B 0%, transparent 60%)," +
              "radial-gradient(70% 60% at 60% 40%, rgba(201,162,39,0.35) 0%, transparent 70%)," +
              "#0E0E11",
          }}
        />
      ) : (
        <>
          {/* The pasted original passes `backgroundColor` and `wireframe`;
              neither exists in 0.0.81, whose params are colours, distortion,
              swirl and grain. The base colour comes from the container
              instead, and the second layer is a slower, grainier pass rather
              than a wireframe. */}
          <MeshGradient
            className="absolute inset-0 h-full w-full"
            colors={HAKU_PATASI}
            speed={0.22}
            distortion={0.85}
            swirl={0.6}
            grainOverlay={0.12}
          />
          <MeshGradient
            className="absolute inset-0 h-full w-full opacity-40"
            colors={HAKU_PATASI_WIRE}
            speed={0.12}
            distortion={0.45}
            swirl={0.9}
            grainMixer={0.4}
            grainOverlay={0.2}
          />
        </>
      )}

      {/* A floor under the text. The gradient is beautiful and moves, which is
          exactly what makes it unreliable to read against. */}
      <div className="absolute inset-0 bg-gradient-to-t from-haku via-haku/45 to-haku/70" />

      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-5 py-5 sm:px-8 bg-gradient-to-r from-haku to-haku/80 backdrop-blur-sm border-b-4 border-patasi">
        <Link href="/" className="flex items-center gap-3" aria-label={`${ORG.name} home`}>
          <Image
            src="/images/newah-full-logo-transparent.png"
            alt=""
            width={512}
            height={512}
            priority
            className="size-16 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] sm:size-20"
          />
          <span className="hidden text-lg font-semibold leading-tight text-lun sm:block">
            {ORG.shortName}
            <span className="block text-base font-normal text-lun/80">Northern California</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-base sm:gap-3">
          {[
            ["Our year", "#our-year"],
            ["This year", "#this-year"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="px-3 py-2 font-medium text-lun/80 transition-colors hover:bg-lun/20 hover:text-lun rounded-full"
            >
              {label}
            </a>
          ))}
        </nav>

        <Link
          href="/register/indrajatra"
          className="rounded-full bg-lun px-8 py-3 text-base font-semibold text-haku transition-colors hover:bg-lun/90"
        >
          Register
        </Link>
      </header>

      <main className="relative z-20 grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100dvh-56px)] items-center bg-white gap-8 lg:gap-12">
        <div className="flex flex-col justify-center px-8 sm:px-12 py-16 sm:py-20">
          <motion.div
            className="mb-6 inline-flex items-center gap-0 rounded-lg border border-white/20 bg-black/40 px-2.5 py-1 backdrop-blur-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <span className="text-[11px] font-medium tracking-wide text-white/90">
              नेपाल सम्बत् {NEPAL_SAMBAT.year} · Nepal Sambat {NEPAL_SAMBAT.year}
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-haku"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span className="block font-light text-haku/85">Our culture,</span>
            <span className="block">tradition &amp; heritage</span>
            <span className="block font-light italic text-patasi">our pride</span>
          </motion.h1>

          <motion.p
            className="mb-8 text-lg text-haku/75"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            The {ORG.chapter} of the {ORG.name} &mdash; keeping Newah language, festivals and craft alive on this side of the world.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            <Link
              href="/register/indrajatra"
              className="inline-flex items-center gap-2 rounded-lg bg-patasi px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-patasi/90"
            >
              Register for Indra Jatra
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#our-year"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-haku px-6 py-3 text-sm font-semibold text-haku transition-colors hover:bg-haku/5"
            >
              See our year
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hidden lg:flex lg:items-center lg:justify-center relative"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Image
            src="/images/home-hero-image.png"
            alt="Newah community"
            width={600}
            height={500}
            className="w-full h-auto rounded-lg object-cover shadow-lg"
            priority
          />
        </motion.div>
      </main>

      {/* The seal, with the era's founder orbiting it. Shankhadhar Sakhwa
          cleared the valley's debts in 879 AD and the calendar starts there —
          a detail that belongs to this community and no other. */}
      <div className="pointer-events-none absolute bottom-8 right-6 z-20 hidden size-28 items-center justify-center sm:flex">
        <Image
          src="/images/newah-logo.png"
          alt=""
          width={256}
          height={256}
          className="size-12 rounded-full object-contain opacity-90"
        />
        <motion.svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          aria-hidden
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <path id="seal-circle" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
          </defs>
          <text className="fill-lun/70 text-[8.5px] font-medium tracking-wide">
            <textPath href="#seal-circle" startOffset="0%">
              {NEPAL_SAMBAT.founded} &middot; {NEPAL_SAMBAT.founder} &middot;
            </textPath>
          </text>
        </motion.svg>
      </div>
    </div>
  );
}
