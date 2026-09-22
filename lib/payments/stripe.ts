import "server-only";
import Stripe from "stripe";

/**
 * Stripe client, built lazily.
 *
 * Constructing it at module scope with a missing key is the failure that took
 * registration down once already (see the Resend client). A missing key here
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

export function webhookSecret(): string | null {
  return process.env.STRIPE_WEBHOOK_SECRET || null;
}

export { siteUrl } from "@/lib/site";
