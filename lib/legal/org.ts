/**
 * Organization facts used by the legal pages and the consent text.
 *
 * Everything the policies assert about the organization lives here, so a
 * correction is a one-line edit rather than a search through prose.
 *
 * VERIFIED — published by the organization itself:
 *   - name, chapter, contactEmail, website, facebook
 *
 * UNCONFIRMED — sourced from a third-party IRS-derived record (CauseIQ) and
 * NOT yet confirmed by the board. `ein` and `mailingAddress` belong to the
 * national organization registered in Maryland; whether the Northern
 * California chapter operates under that same entity has not been verified.
 * Claiming tax-deductibility under an EIN that turns out to be wrong is a real
 * liability, so `showTaxDeductibility` stays false until the board confirms.
 */
export const ORG = {
  name: "Newah Organization of America",
  shortName: "NOA",
  chapter: "Northern California Chapter",
  legalName: "Newah Organization of America, Inc.",

  contactEmail: "info@newah.org",
  website: "https://www.newah.org",
  facebook: "https://www.facebook.com/newahnorcal",

  /** UNCONFIRMED — see note above. */
  ein: "02-0630839",
  /** UNCONFIRMED — national organization's registered address. */
  mailingAddress: {
    street: "19020 Steeple Pl",
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
export const CONSENT_VERSION = "2026-09-22.1";

export const POLICY_EFFECTIVE_DATE = "September 22, 2026";

/** The exact sentence shown beside the checkbox. Stored verbatim per registration. */
export const CONSENT_TEXT =
  "I agree to the Terms and Conditions and the Privacy Policy, and I consent to " +
  "Newah Organization of America using the information I provide to contact me about " +
  "requests for support, membership drives, upcoming and future events, and other " +
  "communications from the organization. I understand I can withdraw this consent at " +
  "any time by emailing " + ORG.contactEmail + ".";

export function formattedAddress(): string {
  const a = ORG.mailingAddress;
  return `${a.street}, ${a.city}, ${a.state} ${a.zip}`;
}
