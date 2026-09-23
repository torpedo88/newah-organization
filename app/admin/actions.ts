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

export async function logIn(formData: FormData): Promise<void> {
  const ip = await clientIp();

  // Checked before the password is compared, so a locked-out caller learns
  // nothing about whether their guess was right.
  const throttle = await checkThrottle(ip);
  if (!throttle.allowed) {
    redirect(`/admin?locked=${throttle.retryAfterSeconds}`);
  }

  const submitted = formData.get("password");
  if (typeof submitted !== "string" || !passwordMatches(submitted)) {
    await recordFailure(ip);
    redirect("/admin?error=1");
  }

  await clearFailures(ip);

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, issueSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  redirect("/admin");
}

export async function logOut(): Promise<void> {
  const jar = await cookies();
  jar.delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin");
}
