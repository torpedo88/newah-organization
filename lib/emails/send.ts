import "server-only";

/**
 * Transactional email through Cloudflare Email Service.
 *
 * Replaces Resend, for one reason that had nothing to do with Resend: the
 * organization now owns noancc.org on Cloudflare DNS, and enabling Email
 * Sending wrote its own SPF, DKIM and DMARC records into the zone. The blocker
 * was never the provider, it was not having a verified domain to send from.
 *
 * Deliberately the REST API rather than a Workers binding — the site runs on
 * Vercel, and Cloudflare's own documentation says the REST path needs no
 * Worker: "Use it from any backend, serverless function, or CI/CD pipeline."
 */
const ACCOUNT_ID = "36376e7b8ba766f4dd087083d659b755";
const ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/email/sending/send`;

/** The From address. Must be on a domain onboarded for Email Sending. */
export function senderAddress(): string {
  return process.env.EMAIL_FROM || "Newah Organization <noreply@noancc.org>";
}

export function emailConfigured(): boolean {
  return Boolean(process.env.CLOUDFLARE_API_TOKEN);
}

export type SendResult = { sent: boolean; reason?: string };

/**
 * Returns whether the message actually went out.
 *
 * The caller puts this on the confirmation screen, so it must never report
 * success it cannot stand behind — a registrant told "check your email" who
 * receives nothing has been given a worse experience than one told plainly
 * that we could not send it.
 */
export async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendResult> {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) {
    console.error("CLOUDFLARE_API_TOKEN is not set; confirmation email not sent");
    return { sent: false, reason: "not configured" };
  }
  if (!args.to) return { sent: false, reason: "no recipient" };

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: args.to,
        from: senderAddress(),
        subject: args.subject,
        html: args.html,
        // Always both: some clients show only plain text, and a missing text
        // part costs deliverability with spam filters.
        text: args.text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      // The token is in the request, never the response, so this is safe to log.
      console.error(`Cloudflare rejected the email (HTTP ${response.status}):`, body.slice(0, 300));
      return { sent: false, reason: `http ${response.status}` };
    }
    return { sent: true };
  } catch (error) {
    console.error("Email send error:", (error as Error).message);
    return { sent: false, reason: "request failed" };
  }
}
