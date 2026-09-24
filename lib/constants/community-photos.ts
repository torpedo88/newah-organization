import type { MarqueeImage } from "@/components/ui/animated-marquee-hero";

/**
 * The chapter's own photographs.
 *
 * Everything else on this site is borrowed Creative Commons imagery of
 * Kathmandu. These are from the chapter's own Indra Jatra at Berkeley Marina
 * on 30 September 2023 — this community, in California. They belong to the
 * organization, so they carry no attribution requirement, which is why they
 * are not in PHOTO_CREDITS.
 *
 * The alt text describes what a reader who cannot see the photograph would
 * want: what is happening and where, not "image of festival".
 */
export const COMMUNITY_PHOTOS: MarqueeImage[] = [
  {
    src: "/images/community/indra-jatra-2023-kumari.jpg",
    alt: "A young girl dressed as the Kumari in red and gold, hands joined, at the chapter's Indra Jatra in Berkeley",
  },
  {
    src: "/images/community/indra-jatra-2023-lakhey.jpg",
    alt: "A Lakhey dancer in a red mask with white mane, dancing among the crowd at Berkeley Marina",
  },
  {
    src: "/images/community/ihi-ceremony.jpg",
    alt: "Hands in red and gold bangles tying the sacred thread during an Ihi ceremony",
  },
  {
    src: "/images/community/indra-jatra-2023-lakhey-crowd.jpg",
    alt: "The Lakhey dancing before families and children on the grass at Berkeley Marina",
  },
];
