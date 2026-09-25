import type { Metadata } from "next";

// Validates required public config at app boot. Importing it here means a
// missing Supabase variable fails the build instead of surfacing later as a
// confusing runtime error on a page that queries data.
import "@/lib/env";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/site";
import { ORG } from "@/lib/legal/org";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = `${ORG.name} \u2014 ${ORG.chapter}`;

// The site's own description, not the event's. This is what a link to the root
// shows when it is shared, and the root is the organization — a share of
// noancc.org that reads "Register for Indra Jatra" describes one evening of a
// chapter that has been going for a quarter of a century. The registration
// page carries the event wording, and its own card.
const DESCRIPTION =
  `The ${ORG.chapter} of the ${ORG.name}: keeping Newah language, festivals ` +
  `and craft alive on this side of the world.`;

export const metadata: Metadata = {
  // Without this, the Open Graph image resolves relative and link previews
  // silently fall back to no image at all.
  metadataBase: new URL(siteUrl()),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    // Facebook expects a canonical URL on the card; without og:url the scraper
    // has nothing to attribute the preview to.
    url: siteUrl(),
    title: TITLE,
    description: DESCRIPTION,
    siteName: ORG.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          Noto Sans Newa, for text in the Newa script (Prachalit Nepal,
          Unicode U+11400-U+1147F). next/font/google does not carry this
          family, so it is loaded from the stylesheet directly.

          Ranjana is a different script and is NOT encoded in Unicode at all —
          the standard's own Blocks.txt has no entry for it — so Ranjana can
          only ever be artwork on this site, never text.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Newa&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-haku">
        {/*
          The haku patasi weave, under every page.

          The cloth the chapter's palette is taken from: a black ground, fine
          diagonal stripes, and columns of four-dot diamond clusters in red,
          cream and gold. Drawn as a tile rather than photographed, so it
          repeats to any size without going soft and carries no licence.

          Fixed rather than scrolled, so it reads as the cloth the page is
          printed on instead of a texture sliding past.

          At 9% the weave is meant to be seen rather than merely sensed, and
          the number has a ceiling behind it. The brightest thing in the tile
          is the cream motif, so the worst case anywhere on the site is the
          faintest text crossing one: white at 55% measures 5.8:1 there, and
          at 14% it was 5.3:1. Raise this and measure that text again.

          Measuring it turned up something the weave did not cause. The small
          metadata labels were white at 40%, which was 3.8:1 against plain
          haku — already under AA before any of this. They are 55% now.

          aria-hidden and behind everything: it says nothing a reader needs.
        */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 opacity-[0.09]"
          style={{
            backgroundImage: "url('/images/patasi-weave.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "132px 132px",
          }}
        />
        {children}
      </body>
    </html>
  );
}
