/** The campaign this registration drive is running. */
export const EVENT = {
  /** The festival itself. */
  name: "Indra Jatra",
  /** The fundraising campaign attached to it. */
  title: "Jatra with a Cause",
  /** The fund proceeds go to, named in full deliberately. */
  fundName: "Prime Minister's Disaster Relief Fund",
  /**
   * The public promise.
   *
   * This deliberately does NOT say "100%". Event expenses come out first, and
   * a donor who declines to cover the card processing fee has it deducted from
   * their gift. Both make a 100% claim false. If the economics ever change,
   * change this line with them — it is a statement to donors about where their
   * money goes.
   */
  promise:
    "After covering the expenses of the event, all remaining proceeds are donated to the",

  /**
   * When and where.
   *
   * Left empty until the board supplies them. The landing page renders these
   * only when set, because a date invented to fill a layout is worse than a
   * page that does not yet state one — people plan around it.
   */
  date: "",
  venue: "",
  city: "",
} as const;

/**
 * The chapter's year, not one festival.
 *
 * Drawn from what NOA chapters publish as their annual programme. The
 * organization exists all year; Indra Jatra is the event it happens to be
 * raising money around right now, and a site that shows only that
 * misrepresents what the chapter is.
 */
export const FESTIVALS = [
  {
    name: "Yenya Punhi",
    also: "Indra Jatra",
    when: "Bhadra \u2014 late summer",
    what: "Kathmandu's own festival: the lingo raised, the chariots pulled, the city awake for days.",
  },
  {
    name: "Mha Puja",
    also: "worship of the self",
    when: "Kachhala \u2014 with Nepal Sambat",
    what: "The one night a year the family honours each of its own, mandala by mandala.",
  },
  {
    name: "Nepal Sambat",
    also: "the Newah new year",
    when: "Kachhala Thwa \u2014 autumn",
    what: "Our own era, counted from 880 CE and still counting \u2014 a calendar kept by a people, not a state.",
  },
  {
    name: "Yomari Punhi",
    also: "the harvest",
    when: "Thinla \u2014 winter full moon",
    what: "Steamed yomari shaped by hand, the first sweetness of the new rice.",
  },
  {
    name: "Buddha Jayanti",
    also: "Swanya Punhi",
    when: "Bachhala \u2014 spring",
    what: "Marked across the Valley's bahals and stupas, and by Newah communities wherever they live.",
  },
  {
    name: "World Newah Day",
    also: "Vishwa Newah Diwas",
    when: "Last Saturday of March",
    what: "One day the diaspora keeps together, wherever it has settled.",
  },
] as const;

/** Preset donation amounts: note denominations through to typical giving tiers. */
export const DONATION_PRESETS = [5, 10, 20, 50, 100, 250, 500] as const;

export const MIN_DONATION = 1;
export const MAX_DONATION = 10000;

/** Nobody under this age has any details collected by this site. */
export const ADULT_AGE = 18;

/** Guard against a single registration carrying an unreasonable party. */
export const MAX_ADULT_GUESTS = 20;
