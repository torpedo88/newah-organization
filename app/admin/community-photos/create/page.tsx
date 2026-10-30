import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, sessionTokenIsValid } from "@/lib/admin/session";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import FestivalBackdrop from "@/components/ui/festival-backdrop";
import PhotoForm from "../photo-form";

export const metadata: Metadata = {
  title: "Create Photo - Admin",
  robots: { index: false, follow: false },
};

export default async function CreatePhotoPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const isValid = token && sessionTokenIsValid(token);

  if (!isValid) {
    return (
      <div className="relative min-h-screen px-4 py-12">
        <FestivalBackdrop />
        <div className="relative mx-auto w-full max-w-6xl text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Unauthorized</h1>
          <Link href="/admin">
            <LiquidButton>Back to Admin</LiquidButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-4 py-12">
      <FestivalBackdrop />
      <div className="relative mx-auto w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-8">Create Photo</h1>
        <PhotoForm />
        <div className="mt-6">
          <Link href="/admin/community-photos">
            <LiquidButton>Back to Photos</LiquidButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
