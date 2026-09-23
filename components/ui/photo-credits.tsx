import { PHOTO_CREDITS } from "@/lib/constants/photo-credits";

/**
 * Photograph attribution.
 *
 * Every image on this site is Creative Commons licensed and requires credit.
 * This is a licence condition, not a courtesy — remove it and the photographs
 * are being used in breach of their terms.
 */
export default function PhotoCredits({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-white/35 ${className}`}>
      Photographs{" "}
      {PHOTO_CREDITS.map((c, i) => (
        <span key={c.file}>
          {i > 0 && "; "}
          <a
            href={c.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-white/60"
          >
            {c.photographer}
          </a>{" "}
          <a
            href={c.licenceUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-white/60"
          >
            {c.licence}
          </a>
        </span>
      ))}
      , via Wikimedia Commons.
    </p>
  );
}
