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
} as const;

/** Preset donation amounts: note denominations through to typical giving tiers. */
export const DONATION_PRESETS = [5, 10, 20, 50, 100, 250, 500] as const;

export const MIN_DONATION = 1;
export const MAX_DONATION = 10000;

/** Nobody under this age has any details collected by this site. */
export const ADULT_AGE = 18;

/** Guard against a single registration carrying an unreasonable party. */
export const MAX_ADULT_GUESTS = 20;
