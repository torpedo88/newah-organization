import type { MarqueeImage } from "@/components/ui/animated-marquee-hero";

/**
 * The chapter's own photographs.
 *
 * Everything else on this site is borrowed Creative Commons imagery of
 * Kathmandu. These are the chapter itself: its Indra Jatra at Berkeley Marina
 * in 2023, its banner and its drums at the Nepal Day Parade in San Francisco,
 * and its members on Market Street in haku patasi.
 *
 * They are not in PHOTO_CREDITS, which exists for Creative Commons images
 * whose licences make attribution a condition of use. Several of these carry a
 * photographer's watermark instead, recorded in `credit` below: that is a
 * person to thank and to have asked, not a licence term. The watermarks are
 * left in the frame rather than cropped out.
 *
 * The alt text says what is happening and where, because that is what someone
 * who cannot see the photograph would want — not "image of festival".
 */
export type CommunityPhoto = MarqueeImage & {
  /** Photographer, where the photograph carries their mark. */
  credit?: string;
};

export const COMMUNITY_PHOTOS: CommunityPhoto[] = [
  {
    src: "/images/community/indra-jatra-2023-kumari.jpg",
    alt: "A young girl dressed as the Kumari in red and gold, hands joined, at the chapter's Indra Jatra in Berkeley",
  },
  {
    src: "/images/community/nepal-day-parade-banner.jpg",
    alt: "Members holding the Newah Organization of America Northern California Chapter banner at the Nepal Day Parade in San Francisco, a Lakhey dancing behind them",
    credit: "Bharat Adhikari Photography",
  },
  {
    src: "/images/community/indra-jatra-2023-lakhey.jpg",
    alt: "A Lakhey dancer in a red mask with white mane, dancing among the crowd at Berkeley Marina",
  },
  {
    src: "/images/community/dhime-drummers-sf.jpg",
    alt: "Dhime drummers with the chapter's own drums, standing with the Kumari at San Francisco Civic Center",
    credit: "Bharat Adhikari Photography",
  },
  {
    src: "/images/community/ihi-ceremony.jpg",
    alt: "Hands in red and gold bangles tying the sacred thread during an Ihi ceremony",
  },
  {
    src: "/images/community/haku-patasi-market-street.jpg",
    alt: "Five members in haku patasi, the black and red Newar sari, on Market Street in San Francisco",
  },
  {
    src: "/images/community/indra-jatra-2023-lakhey-crowd.jpg",
    alt: "The Lakhey dancing before families and children on the grass at Berkeley Marina",
  },
  {
    src: "/images/community/nepal-day-parade-group.jpg",
    alt: "The chapter gathered in front of San Francisco City Hall at the Nepal Day Parade, with Nepali and American flags and two Lakhey",
    credit: "Bharat Adhikari Photography",
  },
];

/** The photographers to thank, once each, in the order they first appear. */
export const COMMUNITY_PHOTO_CREDITS = [
  ...new Set(COMMUNITY_PHOTOS.map((p) => p.credit).filter(Boolean)),
] as string[];
