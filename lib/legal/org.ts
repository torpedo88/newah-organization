/**
 * Organization facts used by the legal pages and the consent text.
 *
 * Everything the policies assert about the organization lives here, so a
 * correction is a one-line edit rather than a search through prose.
 *
 * VERIFIED — published by the organization itself:
 *   - name, chapter, contactEmail, phone, address, website, facebook
 *
 * `ein` originally came from a third-party IRS-derived record (CauseIQ). The
 * chapter's own site publishes the same number alongside an explicit
 * "501 C (3) Tax-Exempt, Non-Profit Charitable Organization (02-0630839)", and
 * the owner confirmed on 2026-09-25 that the site may state it. Note what that
 * is and is not: corroboration by the organization itself, not an independent
 * check against the IRS Exempt Organizations file. If the number is ever found
 * to be wrong, `showTaxDeductibility` is the single switch that takes every
 * such claim off the site.
 */
export const ORG = {
  name: "Newah Organization of America",
  shortName: "NOA",
  chapter: "Northern California Chapter",
  legalName: "Newah Organization of America, Inc.",

  /** The chapter's own address, as it publishes on its chapter site. */
  contactEmail: "newahnorcal@gmail.com",
  /** The address the chapter publishes for itself. Kept for reference. */
  legacyContactEmail: "newah2001@gmail.com",
  phone: "707-508-9814",
  /** The national organization's address, for reference. */
  nationalEmail: "info@newah.org",
  website: "https://www.newah.org",
  facebook: "https://www.facebook.com/newahnorcal",

  /** Where the chapter is based, as it states on its own Facebook page. */
  basedIn: "Santa Rosa, California",
  /** How the chapter styles its own short name there. */
  chapterShortName: "NOANC",

  /** UNCONFIRMED — see note above. */
  ein: "02-0630839",
  /**
   * The chapter's own address, as published on its chapter site. It replaces
   * the national organization's Germantown, Maryland address, which is a poor
   * thing for a Northern California chapter to list.
   *
   * It appears to be residential. No individual's name is attached to it here:
   * the chapter publishes the address, not a person at it.
   */
  mailingAddress: {
    street: "481 Palmilla Pl",
    city: "Santa Rosa",
    state: "CA",
    zip: "95407",
  },

  /**
   * Gates every tax-deductibility statement on the site. On since 2026-09-25,
   * on the owner's instruction and on the strength of the chapter publishing
   * its own 501(c)(3) status and EIN. Setting this back to false removes every
   * such claim in one edit.
   */
  showTaxDeductibility: true,
} as const;

/**
 * Bumped whenever the consent wording changes. Stored alongside each
 * registration so the organization can show exactly what a given person
 * agreed to, which is the part that matters if consent is ever disputed.
 */
// Bumped 2026-09-23: the checkbox now renders CONSENT_TEXT itself. Until then
// the stored sentence differed from the one displayed — it opened differently
// and carried a withdrawal clause the visitor never saw — so records written
// under the previous version attest to wording that was not on screen.
//
// Bumped 2026-09-25: CONSENT_TEXT interpolates ORG.contactEmail, and that
// address changed from newah2001@ to newahnorcal@. The withdrawal address is
// part of what a person agreed to, so the sentence is not the same sentence
// and must not be recorded under the old version. Records written before this
// point name the old address, which is what those people were shown.
export const CONSENT_VERSION = "2026-09-25.1";

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
