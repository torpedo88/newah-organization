import { PHOTO_CREDITS } from "@/lib/constants/photo-credits";
import { COMMUNITY_PHOTO_CREDITS } from "@/lib/constants/community-photos";

/**
 * Photograph attribution.
 *
 * Two different obligations, deliberately kept apart:
 *
 * The Creative Commons images require credit. That is a licence condition, not
 * a courtesy — remove it and the photographs are being used in breach of their
 * terms.
 *
 * The chapter's own photographs carry no such condition. Where one bears a
 * photographer's mark, they are thanked by name, because someone stood at the
 * chapter's festival and took it.
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
      {COMMUNITY_PHOTO_CREDITS.length > 0 && (
        <>
          {" "}
          Photographs of the chapter by {COMMUNITY_PHOTO_CREDITS.join(" and ")}.
        </>
      )}
    </p>
  );
}
