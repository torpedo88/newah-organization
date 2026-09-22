import type { MetadataRoute } from "next";

/**
 * Block search engines until launch — but let link-preview crawlers through.
 *
 * The blanket `Disallow: /` also stopped Facebook, Messenger, LinkedIn and X
 * from generating a preview card, because those crawlers honour robots.txt.
 * Sharing the registration link privately is exactly what the organization
 * needs to do before launch, so the bots that build share cards are named and
 * allowed while `*` stays disallowed.
 *
 * Phase 5 (Launch) removes the disallow entirely, together with the custom
 * domain and the SEO work.
 */
const PREVIEW_CRAWLERS = [
  "facebookexternalhit", // Facebook and Messenger
  "facebookcatalog",
  "Facebot",
  "Twitterbot",
  "LinkedInBot",
  "Slackbot-LinkExpanding",
  "Slackbot",
  "WhatsApp",
  "Discordbot",
  "TelegramBot",
  "SkypeUriPreview",
  "Applebot", // iMessage rich links
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", disallow: "/" },
      ...PREVIEW_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
  };
}
