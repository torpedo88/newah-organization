import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // The printed QR code encodes /register. The registration page has
        // moved under an event-specific path so later events can live
        // alongside it, and this redirect is what keeps every printed code
        // working — permanent, because that path will not be reused.
        source: "/register",
        destination: "/register/indrajatra",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
