import Image from "next/image";

/**
 * Full-bleed Indra Jatra photograph behind the registration flow.
 *
 * Photo: "Start of Indra Jatra" by Wikimedman, CC BY-SA 4.0, via Wikimedia
 * Commons. The licence requires the credit rendered by <FestivalPhotoCredit />,
 * so the two are kept in this file together.
 *
 * The form sits on glass, so the image is scrimmed hard: the photograph is
 * atmosphere, not something anyone needs to read. Three layers do that work —
 * a flat wash for a contrast floor, a vertical gradient that keeps
 * the top and bottom edges darkest where the heading and the submit button
 * sit, and a crop that follows the chariot on narrow screens, and a warm radial that picks up the torchlight so the card does not
 * read as a grey box dropped on a photo.
 */
export default function FestivalBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-haku">
      <Image
        src="/images/indra-jatra-durbar-square.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-105 object-cover object-[47%_30%] brightness-[0.92] sm:object-[72%_45%]"
      />
      <div className="absolute inset-0 bg-haku/52" />
      <div className="absolute inset-0 bg-gradient-to-b from-haku/88 via-haku/34 to-haku/94" />
      <div className="absolute inset-0 bg-[radial-gradient(65%_45%_at_50%_35%,rgba(192,16,43,0.20),transparent_70%)]" />
    </div>
  );
}

/**
 * Attribution for the backdrop. CC BY-SA requires title, author and licence to
 * be shown wherever the work is used, so every page using the backdrop renders
 * this too.
 */
export function FestivalPhotoCredit({ className }: { className?: string }) {
  return (
    <p className={className}>
      Photo{" "}
      <a
        href="https://commons.wikimedia.org/wiki/File:Start_of_Indra_Jatra.jpg"
        className="underline underline-offset-2 hover:text-white/80"
        target="_blank"
        rel="noreferrer"
      >
        &ldquo;Start of Indra Jatra&rdquo;
      </a>{" "}
      by Wikimedman,{" "}
      <a
        href="https://creativecommons.org/licenses/by-sa/4.0"
        className="underline underline-offset-2 hover:text-white/80"
        target="_blank"
        rel="noreferrer"
      >
        CC BY-SA 4.0
      </a>
      , via Wikimedia Commons.
    </p>
  );
}
