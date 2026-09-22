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
  openGraph: {
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
