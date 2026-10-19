import Image from "next/image";

/**
 * Backdrop for the Mha Puja pages: Nhu Daya Bhintuna, the Newah New Year.
 *
 * The Mha Puja pages used to borrow the Indra Jatra photograph, which put the
 * wrong festival behind the right one. This draws the evening itself instead:
 * the night sky the new year opens in, the warm light of the pala (oil lamps)
 * lit at every place in the mandala row, and the Mha Puja mandala.
 *
 * The mandala is the eight-petal diagram from Wikimedia Commons — clockwise
 * from the top: circle, virgin, conch, horn, yogurt, fruit, flower and lamp —
 * recoloured to gold line art on a transparent ground
 * (public/images/mhapuja-mandala.webp). It is marked public domain there
 * (ineligible for copyright), so unlike the Indra Jatra photograph it needs
 * no on-page credit; the source is still recorded in docs/PHOTO-CREDITS.md.
 *
 * It is decoration only: aria-hidden, no motion, and dim enough that the
 * glass cards over it keep their contrast.
 */
export default function NhuDayaBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-haku">
      {/* Night: deep at the edges, warmer toward the middle of the page. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#1d1014_0%,#0E0E11_55%,#08080A_100%)]" />

      {/* The mandala, large and faint, centred behind the hero. */}
      <div className="absolute left-1/2 top-[38vh] aspect-square w-[150vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 opacity-[0.22] sm:w-[95vw] sm:opacity-[0.16]">
        <Image
          src="/images/mhapuja-mandala.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 150vw, 1100px"
          className="object-contain"
        />
      </div>

      {/* Pala light: a gold glow at the heart of the mandala and a patasi
          red warmth beneath it, as a row of lamps throws on a floor. */}
      <div className="absolute inset-0 bg-[radial-gradient(40%_30%_at_50%_38%,rgba(227,196,99,0.16),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_35%_at_50%_100%,rgba(192,16,43,0.22),transparent_75%)]" />

      {/* Keep the top (header) and the foot (submit, footer) darkest. */}
      <div className="absolute inset-0 bg-gradient-to-b from-haku/70 via-transparent to-haku/80" />
    </div>
  );
}
