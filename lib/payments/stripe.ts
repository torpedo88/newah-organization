import "server-only";
import Stripe from "stripe";

/**
 * Stripe client, built lazily.
 *
 * Constructing it at module scope with a missing key is the failure that took
 * registration down once already (see the old Resend client). A missing key here
 * must only mean "donations are unavailable", never "the site is down".
 */
let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key);
  return client;
}

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Every signing secret this deployment will accept.
 *
 * Stripe issues a separate secret per endpoint, and during a domain move two
 * endpoints point at the same deployment — one on the old host, one on the
 * new. With a single secret, events from one of them fail signature
 * verification, which is precisely the gap a second endpoint was meant to
 * avoid: a live donation succeeds at Stripe and is never recorded.
 *
 * STRIPE_WEBHOOK_SECRET therefore accepts a comma-separated list. Once the old
 * endpoint is retired the list goes back to one value.
 */
export function webhookSecrets(): string[] {
  return (process.env.STRIPE_WEBHOOK_SECRET || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export { siteUrl } from "@/lib/site";
