"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
    <div className="relative min-h-[100dvh] overflow-hidden bg-white">
      {/* Clean professional background - no shader animation */}

      <header className="relative z-20 flex items-center justify-between gap-4 bg-blue-900 px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label={`${ORG.name} home`}>
          <Image
            src="/images/newah-full-logo-transparent.png"
            alt=""
            width={512}
            height={512}
            priority
            className="size-11 object-contain sm:size-12"
          />
          <span className="hidden text-sm font-semibold leading-tight text-white sm:block">
            {ORG.shortName}
            <span className="block text-xs font-normal text-amber-400">Northern California</span>
          </span>
        </Link>

        {/* Hidden below sm: three links wrapping to two lines each is worse
            than no links, and every section is a scroll away regardless. */}
        <nav className="hidden items-center gap-1 text-xs sm:flex sm:gap-2">
          {[
            ["Our year", "#our-year"],
            ["This year", "#this-year"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-3 py-2 font-medium text-white/75 transition-colors hover:bg-blue-800 hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>

        <Link
          href="/register/indrajatra"
          className="rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
        >
          Register
        </Link>
      </header>

      <main className="relative z-20 min-h-[calc(100dvh-88px)] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Text content left */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h1 className="mb-6 text-balance text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
                <span className="block">Our culture,</span>
                <span className="block text-red-600">tradition &amp; heritage</span>
                <span className="block font-light text-gray-700">our pride</span>
              </h1>

              <p className="mb-8 max-w-xl text-pretty text-lg leading-relaxed text-gray-700">
                The {ORG.chapter} of the {ORG.name} &mdash; keeping Newah language, festivals and
                craft alive on this side of the world.
              </p>

              <motion.div
                className="flex flex-wrap items-center gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link
                  href="/register/indrajatra"
                  className="rounded-lg bg-red-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Register for Indra Jatra
                </Link>
                <a
                  href="#our-year"
                  className="rounded-lg border-2 border-gray-400 px-8 py-3 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-600 hover:bg-gray-50"
                >
                  Explore Events
                </a>
              </motion.div>
            </motion.div>

            {/* Image right */}
            <motion.div
              className="hidden lg:flex lg:items-center lg:justify-center"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Image
                src="/images/home-hero-image.png"
                alt="Temples and landmarks"
                width={600}
                height={500}
                className="h-auto w-full rounded-2xl object-cover shadow-lg"
                priority
              />
            </motion.div>
          </div>
        </div>
      </main>

    </div>
  );
}
