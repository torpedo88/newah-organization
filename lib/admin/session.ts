import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Shared-password session for the board's admin view.
 *
 * One password, held in ADMIN_PASSWORD, guards a page that lists registrant
 * names, phone numbers and email addresses. The cookie carries an expiry and
 * an HMAC of it keyed by the password itself, so a signed cookie cannot be
 * forged without the password and changing the password invalidates every
 * session that was issued under the old one.
 *
 * Everything reads the environment lazily. A missing ADMIN_PASSWORD must show
 * the board an explanation, never take the route down at import time.
 */

export const ADMIN_COOKIE = "noa_admin_session";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

function adminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  return value && value.trim() !== "" ? value : null;
}

export function adminAuthConfigured(): boolean {
  return adminPassword() !== null;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("hex");
}

function equals(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/**
 * Compared as fixed-length digests rather than raw strings, so the comparison
 * cannot leak the password's length or its matching prefix through timing.
 */
export function passwordMatches(submitted: string): boolean {
  const expected = adminPassword();
  if (!expected) return false;
  const digest = (value: string) =>
    createHmac("sha256", "noa-admin-password-compare").update(value).digest("hex");
  return equals(digest(submitted), digest(expected));
}

export function issueSessionToken(): string {
  const key = adminPassword();
  if (!key) throw new Error("ADMIN_PASSWORD is not set");
  const payload = `${Date.now() + ADMIN_SESSION_SECONDS * 1000}.${randomBytes(8).toString("hex")}`;
  return `${payload}.${sign(payload, key)}`;
}

export function sessionTokenIsValid(token: string | undefined): boolean {
  const key = adminPassword();
  if (!key || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expiry, nonce, mac] = parts;
  if (!equals(mac, sign(`${expiry}.${nonce}`, key))) return false;
  const expiresAt = Number(expiry);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}
