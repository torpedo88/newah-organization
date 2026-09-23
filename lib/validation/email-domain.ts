import "server-only";
import { resolveMx } from "node:dns/promises";
import { emailDomain } from "@/lib/validation/contact";

/**
 * Does this domain accept mail at all?
 *
 * Syntax cannot tell `gmail.com` from `gmial.co.uk`. A DNS lookup can: a
 * domain with no MX (and no A record to fall back to) will never deliver the
 * confirmation, and the registrant will not discover that until the day.
 *
 * Deliberately fails OPEN on anything that is not a definitive "no such
 * domain". A DNS timeout is a problem with our network, not with the
 * registrant's address, and refusing a registration over it would lose an
 * attendee to fix a typo that may not exist.
 */
export async function domainAcceptsMail(email: string, timeoutMs = 2500): Promise<boolean> {
  const domain = emailDomain(email);
  if (!domain) return false;

  const lookup = (async () => {
    try {
      const records = await resolveMx(domain);
      return records.length > 0;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      // NXDOMAIN is definitive: the domain does not exist.
      if (code === "ENOTFOUND" || code === "ENODATA") {
        // A domain with no MX may still take mail on its A record, which is
        // rare but legal, so check before rejecting.
        try {
          const { resolve4 } = await import("node:dns/promises");
          return (await resolve4(domain)).length > 0;
        } catch {
          return false;
        }
      }
      return true; // SERVFAIL, timeout, refused — not the registrant's fault
    }
  })();

  const timeout = new Promise<boolean>((resolve) => setTimeout(() => resolve(true), timeoutMs));
  return Promise.race([lookup, timeout]);
}
