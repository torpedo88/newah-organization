import Image from "next/image";
import { ASTA_MANGAL_MARKS } from "@/lib/constants/motifs";

/**
 * The eight auspicious signs, watermarked across the hero.
 *
 * Laid out as a band rather than a grid: the signs are traditionally set in a
 * row across a lintel or a doorway, not stacked in a block.
 *
 * Three things worth knowing about this file.
 *
 * The drawings are not mine. Seven are Christopher J. Fynn's and Nick
 * Terazzi's, under CC BY-SA, and the endless knot is Iketsi's, public domain.
 * CC BY-SA asks for credit and it is given in the footer with everything else.
 * It also asks that adaptations be shared alike, which is why the files are
 * served exactly as downloaded — the gold and the fade are CSS on top, not
 * edits to the artwork.
 *
 * They are decoration here and carry no meaning a reader needs, so the whole
 * band is aria-hidden and every alt is empty. The signs are named properly,
 * with what each one carries, in the Asta Mangal section further down.
 *
 * `sepia saturate hue-rotate` rather than a gold fill: an <img> cannot be
 * recoloured by currentColor, and inlining eight SVGs at 70 KB each into the
 * server-rendered page would cost more than the watermark is worth.
 */
export default function AstaMangalWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[18%] z-0 flex select-none items-center justify-center gap-[6vw] px-4 opacity-[0.06] sm:top-[22%] sm:gap-[5vw]"
      style={{
        // Fades the row out at both ends so it reads as a watermark rather
        // than a strip of clip art that stops.
        maskImage: "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
      }}
    >
      {ASTA_MANGAL_MARKS.map((mark) => (
        <Image
          key={mark.slug}
          src={`/images/asta-mangal/${mark.slug}.svg`}
          alt=""
          width={120}
          height={120}
          className="h-[9vw] max-h-24 w-auto shrink-0 [filter:sepia(1)_saturate(2.2)_hue-rotate(5deg)_brightness(1.5)]"
        />
      ))}
    </div>
  );
}
