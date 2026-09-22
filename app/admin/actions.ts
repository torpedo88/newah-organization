"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  issueSessionToken,
  passwordMatches,
} from "@/lib/admin/session";

export async function logIn(formData: FormData): Promise<void> {
  const submitted = formData.get("password");
  if (typeof submitted !== "string" || !passwordMatches(submitted)) {
    redirect("/admin?error=1");
  }

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
