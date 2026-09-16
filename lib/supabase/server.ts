import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

/**
 * Supabase client for Server Components, Route Handlers, and Server Actions.
 *
 * Created per request so cookie state is never shared across requests. Still
 * uses the anon key, so Row Level Security applies here too.
 *
 * The `server-only` import above makes a client component importing this file
 * fail at build time rather than shipping server code to the browser.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot set cookies. Safe to ignore when a
            // middleware or Route Handler is responsible for refreshing the
            // session; it would be a real bug only if nothing else does.
          }
        },
      },
    },
  );
}
