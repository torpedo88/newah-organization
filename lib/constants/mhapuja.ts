/**
 * Mha Puja — the one event the Newah year turns on.
 *
 * Mha Puja is the fourth day of Swanti, celebrated on Kachhala Thwa — the day
 * Nepal Sambat rolls over. "Mha" is the body; the puja is worship of one's
 * own self. The family sits before mandalas drawn in rice flour, vermilion
 * and mustard oil; a sukunda lamp is lit; sagan is served, long life is
 * wished, and the new year begins. See lib/constants/event.ts for the
 * Nepal Sambat rollover date already pinned by this chapter.
 *
 * Everything stated here as fact comes from how NOA chapters programme their
 * year and from the Nepal Sambat historical record. Nothing about this
 * chapter's own evening — venue, exact start time, final menu — is asserted
 * until the board supplies it; a date invented to fill a layout is worse than
 * a layout that admits the field is blank.
 */

/**
 * The address printed on paper, and the one a QR code would encode.
 *
 * Mirrors PRINTED_REGISTRATION_URL in event.ts: a printed code cannot be
 * reissued, so this URL has to resolve forever once anything is printed with
 * it on. It is deliberately a constant rather than siteUrl() so a preview
 * build or a localhost render cannot print an address that does not match
 * the QR beside it.
 */
export const MHAPUJA_PRINTED_REGISTRATION_URL = "www.noancc.org/register/mhapuja";

/**
 * What the chapter is putting on.
 *
 * Date, venue and schedule carried from the chapter's 2025 flyer with the
 * year rolled to 2026 at the owner's instruction (2026-10-15). Mha Puja is a
 * lunar festival whose actual date drifts year to year, so Oct 22 2026 may
 * need adjusting against this year's panchang before anything is printed —
 * the astronomical Nepal Sambat 1147 rollover is 10 November 2026 (see
 * event.ts). This field prints wherever the public page shows "when", so a
 * date that is wrong on the paper is wrong on the site too.
 *
 * The event's Nepal Bhasa title is "Nhu Daya Bhintuna" ("Happy New
 * Year" in Nepal Bhasa) — kept beside the English name so the authenticity of the
 * language this is for does not get lost on the landing page.
 */
export const MHAPUJA_EVENT = {
  name: "Mha Puja",
  nepalBhasaTitle: "Nhu Daya Bhintuna",
  tagline: "Worship of the self. The night the Newah year begins.",
  nepalSambatYear: 1147,
  date: "Wednesday, October 22, 2026",
  schedule: "Bhintuna 3:00 PM · Mha Puja 5:00 PM onwards",
  venue: "Nepali Community Center",
  city: "369 Chesley Ave, Richmond, CA 94801",
} as const;

/** Printed beside the price so attendees know what they are paying for. */
export const MHAPUJA_FEE_INCLUDES = "includes Mha Puja and dinner";

/**
 * Chapter contacts for day-of questions. Taken from the 2025 flyer at the
 * owner's instruction; confirm these two people are still coordinating this
 * year's event before printing or publishing anything that quotes them.
 */
export const MHAPUJA_CONTACTS = [
  { name: "Madan Maharjan", phone: "707-360-7347" },
  { name: "Rajendra Shrestha", phone: "707-703-2535" },
] as const;

/**
 * The story told on the public page.
 *
 * Short sections rather than long prose, because a visitor skims first and
 * reads second. Nothing claimed here goes beyond what the Newah community
 * states about its own tradition.
 */
export const MHAPUJA_STORY = [
  {
    heading: "What Mha Puja is",
    body:
      "Mha Puja is the worship of the self — the body as the vessel of the year to come. " +
      "Each person in the house sits before their own mandala, drawn in rice flour, vermilion " +
      "and mustard oil, with a lotus at its centre. The sukunda is lit, blessings are given " +
      "by elders, and sagan is served: egg, fish, meat, lentil cake, and rice wine, together.",
  },
  {
    heading: "When it falls",
    body:
      "Kachhala Thwa — the fourth day of Swanti, the Newah week of lights. It is also the " +
      "day Nepal Sambat rolls over. The era was founded in 879 AD by Shankhadhar Sakhwa, " +
      "who cleared the debts of everyone in the Kathmandu Valley. The Newah community still " +
      "counts by it. Nepal Sambat 1147 begins on 10 November 2026.",
  },
  {
    heading: "Why we hold it here",
    body:
      "A chapter two oceans from the Valley keeps the night as the Valley does: by sitting " +
      "down together. Children learn what a mandala is because they watch one being drawn; " +
      "elders are honoured because the room is arranged around them; a diaspora stops being " +
      "a scatter for one evening and is a community in a room.",
  },
] as const;

/**
 * Ticket prices.
 *
 * Two tiers only, kept simple. "Adult" means ten and over; "child" means
 * under ten. The split is the chapter's call, written here in cents so there
 * are no fractional dollars anywhere in the code path. These are the LIST
 * prices; what a given registration actually paid is recorded on the row at
 * the time it was created, so a future price change does not retroactively
 * rewrite anyone's receipt.
 */
export const MHAPUJA_ADULT_PRICE_CENTS = 4000;
export const MHAPUJA_CHILD_PRICE_CENTS = 1500;

/** The age cut-off, named so the form and the receipt can both read it. */
export const MHAPUJA_CHILD_AGE_CEILING = 10;

/** Guard against a single registration carrying an unreasonable party. */
export const MHAPUJA_MAX_PER_TIER = 20;
