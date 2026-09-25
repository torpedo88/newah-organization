import type { Metadata } from "next";

// Validates required public config at app boot. Importing it here means a
// missing Supabase variable fails the build instead of surfacing later as a
// confusing runtime error on a page that queries data.
import "@/lib/env";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/site";
import { ORG } from "@/lib/legal/org";
import { EVENT } from "@/lib/constants/event";
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
const DESCRIPTION =
  `Register for ${EVENT.name} with the ${ORG.chapter} of the ${ORG.name}. ` +
  `${EVENT.promise} ${EVENT.fundName}.`;

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
      <body className="flex min-h-full flex-col bg-haku">
        {/*
          The haku patasi weave, under every page.

          The cloth the chapter's palette is taken from: a black ground, fine
          diagonal stripes, and columns of four-dot diamond clusters in red,
          cream and gold. Drawn as a tile rather than photographed, so it
          repeats to any size without going soft and carries no licence.

          Fixed rather than scrolled, so it reads as the cloth the page is
          printed on instead of a texture sliding past. At 5% it is felt more
          than seen — enough to stop the black being flat, not enough to
          compete with anything on top of it.

          aria-hidden and behind everything: it says nothing a reader needs.
        */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage: "url('/images/patasi-weave.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "120px 120px",
          }}
        />
        {children}
      </body>
    </html>
  );
}
