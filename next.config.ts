import type { NextConfig } from "next";

const CANONICAL_HOST = "www.noancc.org";

/** Every hostname that should end up on the canonical one. */
const ALIAS_HOSTS = ["noancc.org", "newah-organization.vercel.app"];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // The printed QR code encodes /register. The registration page moved
        // under an event-specific path so future events can live alongside
        // this one, and this redirect is what keeps every printed code
        // working. The path will not be reused, so it is permanent.
        source: "/register",
        destination: "/register/indrajatra",
        permanent: true,
      },
      // One canonical host. Left alone, the same pages answer on three
      // hostnames, which splits search ranking and means a donor can start
      // checkout on one host and be returned by Stripe to another.
      //
      // newah-organization.vercel.app is included deliberately: it keeps
      // serving — a redirect is still a working URL — so the printed QR
      // continues to resolve, just with one extra hop.
      ...ALIAS_HOSTS.map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
