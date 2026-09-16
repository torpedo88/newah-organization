import type { MetadataRoute } from "next";

/**
 * Block all crawlers until launch.
 *
 * Production Vercel deployments are publicly crawlable, and an unfinished page
 * indexed under this organization's name is slow to undo. Phase 5 (Launch)
 * removes this deliberately, together with the custom domain and SEO work.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
