"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  issueSessionToken,
  passwordMatches,
} from "@/lib/admin/session";
import { checkThrottle, clearFailures, recordFailure } from "@/lib/admin/throttle";

/** The caller's address, as Vercel reports it. */
async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return (forwarded?.split(",")[0].trim() || h.get("x-real-ip") || "unknown").slice(0, 100);
}

/** Pages a sign-in may return to. A fixed list, so the form can't redirect elsewhere. */
const RETURN_PATHS = ["/admin", "/checkin/mhapuja"] as const;

function returnPath(formData: FormData): (typeof RETURN_PATHS)[number] {
  const next = formData.get("next");
  return RETURN_PATHS.find((p) => p === next) ?? "/admin";
}

export async function logIn(formData: FormData): Promise<void> {
  const ip = await clientIp();
  const back = returnPath(formData);

  // Checked before the password is compared, so a locked-out caller learns
  // nothing about whether their guess was right.
  const throttle = await checkThrottle(ip);
  if (!throttle.allowed) {
    redirect(`${back}?locked=${throttle.retryAfterSeconds}`);
  }

  const submitted = formData.get("password");
  if (typeof submitted !== "string" || !passwordMatches(submitted)) {
    await recordFailure(ip);
    redirect(`${back}?error=1`);
  }

  await clearFailures(ip);

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, issueSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    // Site-wide: check-in at /checkin/mhapuja uses the same session.
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  redirect(back);
}

export async function logOut(): Promise<void> {
  const jar = await cookies();
  jar.delete({ name: ADMIN_COOKIE, path: "/" });
  // Sessions issued before the cookie moved to "/" live under /admin.
  jar.delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin");
}
