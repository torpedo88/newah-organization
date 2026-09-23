/**
 * Phone and email rules for the registration form.
 *
 * Two different jobs. Phone is about *accepting* what people actually type —
 * a donor who writes (415) 555-0123 should not be turned away for punctuation.
 * Email is the opposite: the address is the only way the organization can
 * reach someone afterwards, so a typo is worse than a rejection.
 */

/** Digits only, with the North American country code dropped if present. */
export function normalizePhone(input: string): string {
  const digits = (input ?? "").replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

/**
 * A plausible North American number.
 *
 * The NANP reserves a leading 0 or 1 in both the area code and the exchange,
 * so `0000000000` and `1234567890` are not merely unlikely, they cannot exist.
 * That rules out the placeholder digits people type to get past a form without
 * rejecting any real number.
 */
export function isValidPhone(input: string): boolean {
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(normalizePhone(input));
}

/** (415) 555-0123 — for display and for what gets stored. */
export function formatPhone(input: string): string {
  const d = normalizePhone(input);
  if (d.length !== 10) return input ?? "";
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function normalizeEmail(input: string): string {
  return (input ?? "").trim().toLowerCase();
}

/**
 * Stricter than the usual one-liner: requires a dotted domain with an
 * alphabetic TLD, and rejects the shapes that pass a naive regex but cannot
 * be delivered to — consecutive dots, a dot at either end of a label, spaces.
 */
const EMAIL_SHAPE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,63}$/;

/** Addresses that exist to be thrown away; useless for reaching a registrant. */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "yopmail.com",
  "tempmail.com", "temp-mail.org", "trashmail.com", "throwawaymail.com",
  "sharklasers.com", "getnada.com", "dispostable.com", "maildrop.cc",
  "fakeinbox.com", "mailnesia.com", "mintemail.com", "spamgourmet.com",
  "burnermail.io", "emailondeck.com", "moakt.com", "tempr.email",
]);

/** Domains that only ever appear in examples and tests. */
const NON_DELIVERABLE = new Set([
  "example.com", "example.org", "example.net", "test.com", "localhost",
  "invalid", "example.invalid", "test", "email.com",
]);

/**
 * Near-misses for the providers most registrants use. A rejection here is
 * recoverable in a second; a silent typo means the confirmation never arrives
 * and nobody finds out until the day of the event.
 */
const TYPOS: Record<string, string> = {
  "gmai.com": "gmail.com", "gmial.com": "gmail.com", "gmail.co": "gmail.com",
  "gmail.con": "gmail.com", "gmail.cm": "gmail.com", "gmaill.com": "gmail.com",
  "gnail.com": "gmail.com", "gamil.com": "gmail.com", "googlemail.con": "gmail.com",
  "yahoo.con": "yahoo.com", "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com", "outlook.con": "outlook.com", "iclod.com": "icloud.com",
  "icloud.con": "icloud.com", "comcast.net.com": "comcast.net",
};

export function emailDomain(email: string): string {
  return normalizeEmail(email).split("@")[1] ?? "";
}

/**
 * Returns a message explaining why this address will not do, or null if it is
 * acceptable. Syntax only — whether the domain can actually receive mail is
 * checked on the server, where DNS is available.
 */
export function emailProblem(input: string): string | null {
  const email = normalizeEmail(input);
  if (!email) return "Please enter your email";
  if (email.length > 254) return "That email address is too long";
  if (email.includes("..")) return "Please enter a valid email";
  if (!EMAIL_SHAPE.test(email)) return "Please enter a valid email";

  const domain = emailDomain(email);
  const suggestion = TYPOS[domain];
  if (suggestion) return `Did you mean @${suggestion}?`;
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return "Please use an email you actually check — we send your confirmation there";
  }
  if (NON_DELIVERABLE.has(domain)) return "Please enter a real email address";
  return null;
}

/**
 * Progressive formatting while someone types: 415 -> (415), 4155 -> (415) 5,
 * and so on. Anything beyond ten digits is dropped rather than accumulating
 * invisibly past the end of the field.
 */
export function formatPhoneAsTyped(input: string): string {
  const d = normalizePhone(input).slice(0, 10);
  if (d.length === 0) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
