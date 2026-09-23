"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Scroll-expanding media hero, from 21st.dev.
 *
 * Adapted in three ways that matter, all of them about not trapping people:
 *
 * 1. `prefers-reduced-motion` short-circuits the whole effect. The original
 *    hijacks the wheel and animates regardless; for anyone who has asked their
 *    system for less motion, this renders expanded and static instead.
 * 2. The scroll lock releases itself. The original calls `window.scrollTo(0,0)`
 *    on every scroll event until expansion completes, which strands anyone
 *    whose input it does not understand — a keyboard, a screen reader, a
 *    trackpad it reads badly. A keyboard event or five seconds releases it.
 * 3. Colours and copy come from props and project tokens rather than the
 *    hard-coded `text-blue-200` of the original.
 */
interface ScrollExpandMediaProps {
  mediaSrc: string;
  bgImageSrc: string;
  title?: string;
  subtitle?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

export default function ScrollExpandMedia({
  mediaSrc,
  bgImageSrc,
  title,
  subtitle,
  scrollToExpand,
  children,
}: ScrollExpandMediaProps) {
  const reduceMotion = useReducedMotion();

  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartY = useRef(0);
  const released = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    // A safety valve. If the effect has not completed within five seconds the
    // visitor is probably using an input this does not read, and holding the
    // page hostage to an animation is worse than skipping it.
    const timer = window.setTimeout(() => {
      released.current = true;
      setProgress(1);
      setExpanded(true);
    }, 5000);

    const advance = (delta: number) => {
      const next = Math.min(Math.max(progress + delta, 0), 1);
      setProgress(next);
      if (next >= 1) setExpanded(true);
    };

    const onWheel = (e: WheelEvent) => {
      if (released.current) return;
      if (expanded && e.deltaY < 0 && window.scrollY <= 5) {
        setExpanded(false);
        return;
      }
      if (!expanded) {
        e.preventDefault();
        advance(e.deltaY * 0.0009);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (released.current || !touchStartY.current) return;
      const delta = touchStartY.current - e.touches[0].clientY;
      if (expanded && delta < -20 && window.scrollY <= 5) {
        setExpanded(false);
        return;
      }
      if (!expanded) {
        e.preventDefault();
        advance(delta * (delta < 0 ? 0.008 : 0.005));
        touchStartY.current = e.touches[0].clientY;
      }
    };

    // Any keyboard interaction releases the lock immediately: a keyboard user
    // cannot drive a wheel-delta animation, and must not be held by one.
    const onKeyDown = () => {
      if (released.current) return;
      released.current = true;
      setProgress(1);
      setExpanded(true);
    };

    const onScroll = () => {
      if (!expanded && !released.current) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", () => (touchStartY.current = 0));
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [progress, expanded, reduceMotion]);

  // Derived, not stored. Writing these into state from an effect triggers a
  // cascading render and can fall out of step with the preference itself;
  // reduced motion simply means "render the finished state".
  const shownProgress = reduceMotion ? 1 : progress;
  const shownExpanded = reduceMotion || expanded;

  const mediaWidth = 300 + shownProgress * (isMobile ? 650 : 1250);
  const mediaHeight = 400 + shownProgress * (isMobile ? 200 : 400);
  const textShift = shownProgress * (isMobile ? 30 : 45);

  const words = title ? title.trim().split(" ") : [];
  const firstWord = words[0] ?? "";
  const restOfTitle = words.slice(1).join(" ");

  return (
    <div className="overflow-x-hidden">
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
        <div className="relative flex min-h-[100dvh] w-full flex-col items-center">
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 - shownProgress * 0.75 }}
            transition={{ duration: 0.15 }}
          >
            <Image
              src={bgImageSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Two layers, not one. A flat wash alone leaves a bright sky
                washing out cream text; the gradient puts the darkest part
                where the title actually sits. */}
            <div className="absolute inset-0 bg-haku/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-haku/80 via-haku/45 to-haku/85" />
          </motion.div>

          <div className="container relative z-10 mx-auto flex flex-col items-center justify-start">
            <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center">
              <div
                className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  boxShadow: "0 24px 70px -20px rgba(0,0,0,0.85)",
                }}
              >
                <Image
                  src={mediaSrc}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 95vw, 1250px"
                  className="object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-haku"
                  initial={{ opacity: 0.55 }}
                  animate={{ opacity: 0.55 - shownProgress * 0.25 }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              <div className="relative z-10 flex w-full flex-col items-center gap-2 px-4 text-center">
                <h1 className="text-4xl font-bold text-kwa drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)] md:text-5xl lg:text-6xl">
                  <span
                    className="block"
                    style={{ transform: `translateX(-${textShift}vw)` }}
                  >
                    {firstWord}
                  </span>
                  <span
                    className="block"
                    style={{ transform: `translateX(${textShift}vw)` }}
                  >
                    {restOfTitle}
                  </span>
                </h1>
                {subtitle && (
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-lun drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                    {subtitle}
                  </p>
                )}
                {scrollToExpand && shownProgress < 1 && (
                  <p className="mt-6 text-sm text-kwa/70">{scrollToExpand}</p>
                )}
              </div>
            </div>

            <motion.div
              className="flex w-full flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: shownExpanded ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              // Hidden from assistive tech only while genuinely invisible.
              aria-hidden={!shownExpanded}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
