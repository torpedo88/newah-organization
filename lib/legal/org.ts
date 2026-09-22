/**
 * Organization facts used by the legal pages and the consent text.
 *
 * Everything the policies assert about the organization lives here, so a
 * correction is a one-line edit rather than a search through prose.
 *
 * VERIFIED — published by the organization itself:
 *   - name, chapter, contactEmail, website, facebook
 *
 * UNCONFIRMED — `ein` came from a third-party IRS-derived record (CauseIQ) and
 * has NOT been confirmed by the board. The mailing address is now the one the
 * organization publishes itself, but it is the Maryland address for the whole
 * organization rather than a Northern California one.
 * Claiming tax-deductibility under an EIN that turns out to be wrong is a real
 * liability, so `showTaxDeductibility` stays false until the board confirms.
 */
export const ORG = {
  name: "Newah Organization of America",
  shortName: "NOA",
  chapter: "Northern California Chapter",
  legalName: "Newah Organization of America, Inc.",

  /** The chapter address published on newah.org/noa-northern-california. */
  contactEmail: "newah2001@gmail.com",
  /** The national organization's address, for reference. */
  nationalEmail: "info@newah.org",
  website: "https://www.newah.org",
  facebook: "https://www.facebook.com/newahnorcal",

  /** UNCONFIRMED — see note above. */
  ein: "02-0630839",
  /**
   * Published by the organization on its own chapter page as the address for
   * mailing checks. The page lists it "C/O" a named board member; the person's
   * name is deliberately NOT reproduced here, because a privacy policy should
   * not publish an individual's name against a residential address.
   */
  mailingAddress: {
    street: "19043 Steeple Place",
    city: "Germantown",
    state: "MD",
    zip: "20874",
  },

  /**
   * Gates every tax-deductibility statement. Flip to true only once the board
   * confirms the EIN above and that donations through this site are receipted
   * under it.
   */
  showTaxDeductibility: false,
} as const;

/**
 * Bumped whenever the consent wording changes. Stored alongside each
 * registration so the organization can show exactly what a given person
 * agreed to, which is the part that matters if consent is ever disputed.
 */
export const CONSENT_VERSION = "2026-09-22.2";

export const POLICY_EFFECTIVE_DATE = "September 22, 2026";

/**
 * The exact sentence shown beside the checkbox, stored verbatim per
 * registration.
 *
 * Kept short at the board's request — the detail now lives behind the links
 * rather than in front of the checkbox. It still names the purpose of the
 * contact, because consent to be contacted has to say what it is consent to;
 * a bare "I agree to the terms" would not be a record of that.
 */
export const CONSENT_TEXT =
  "I confirm I have read the Terms and Conditions and the Privacy Policy, and I agree " +
  "that Newah Organization of America may contact me about the organization, its events " +
  "and its membership. I can withdraw this at any time by emailing " + ORG.contactEmail + ".";

export function formattedAddress(): string {
  const a = ORG.mailingAddress;
  return `${a.street}, ${a.city}, ${a.state} ${a.zip}`;
}
