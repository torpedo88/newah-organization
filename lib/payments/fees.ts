/**
 * Card processing fee maths.
 *
 * The banner promises the fund receives 100% of a donation. That only holds if
 * the donor is charged the gift PLUS enough to absorb the processor's cut, and
 * the cut is taken from the TOTAL charge, not from the gift. So the total has
 * to be grossed up rather than having the fee simply added:
 *
 *   total * (1 - rate) - fixed = donation
 *   total = (donation + fixed) / (1 - rate)
 *
 * Adding 2.9% of the donation instead would leave the fund a few cents short
 * on every gift, and the banner would be quietly wrong.
 */
export const STRIPE_PERCENT = 0.029;
export const STRIPE_FIXED_CENTS = 30;

/** Rounds up: a part-cent short would break the promise. */
export function grossUpCents(donationCents: number): number {
  if (donationCents <= 0) return 0;
  return Math.ceil((donationCents + STRIPE_FIXED_CENTS) / (1 - STRIPE_PERCENT));
}

export function processingFeeCents(donationCents: number): number {
  return grossUpCents(donationCents) - donationCents;
}

/** What the processor actually keeps from a given total. */
export function processorCutCents(totalCents: number): number {
  return Math.round(totalCents * STRIPE_PERCENT) + STRIPE_FIXED_CENTS;
}

export function toDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * What the organization actually receives from a donation, given whether the
 * donor chose to cover the card processing fee.
 *
 * Covered:     donor is charged the grossed-up total, the org receives the
 *              whole donation.
 * Not covered: donor is charged exactly what they chose, and the processor's
 *              cut comes out of it, so the org receives less.
 */
export function settlement(donationCents: number, donorCoversFee: boolean) {
  if (donationCents <= 0) {
    return { chargedCents: 0, toOrganizationCents: 0, feeCents: 0 };
  }
  if (donorCoversFee) {
    const chargedCents = grossUpCents(donationCents);
    return {
      chargedCents,
      toOrganizationCents: donationCents,
      feeCents: chargedCents - donationCents,
    };
  }
  const feeCents = processorCutCents(donationCents);
  return {
    chargedCents: donationCents,
    toOrganizationCents: donationCents - feeCents,
    feeCents,
  };
}
