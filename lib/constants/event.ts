/** The campaign this registration drive is running. */
export const EVENT = {
  /** Banner headline. */
  title: "Jatra with a Cause",
  /** The fund every dollar of donation goes to, named in full deliberately. */
  fundName: "Prime Minister's Disaster Relief Fund",
  /**
   * The promise on the banner. It is only true because the donor covers the
   * card processing fee on top of their gift — see lib/payments/fees.ts. If the
   * fee model ever changes so that fees come out of the donation, THIS LINE
   * MUST CHANGE TOO, because it would then be false.
   */
  promise: "100% of donations go to the",
} as const;

/**
 * Preset donation amounts: common note denominations through to typical
 * giving tiers, plus a free-text amount.
 */
export const DONATION_PRESETS = [5, 10, 20, 50, 100, 250, 500] as const;

export const MIN_DONATION = 1;
export const MAX_DONATION = 10000;
