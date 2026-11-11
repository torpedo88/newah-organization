import CheckinForm from "@/components/checkin/checkin-form";
import NhuDayaBackdrop from "@/components/ui/nhu-daya-backdrop";
import Image from "next/image";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, sessionTokenIsValid } from "@/lib/admin/session";
import { logIn } from "@/app/admin/actions";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export const metadata = {
  title: "Mha Puja Check-In",
  robots: { index: false },
};

export default async function CheckinPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; locked?: string }>;
}) {
  const { error, locked } = await searchParams;
  // Volunteers sign in here with the board password; the check-in action
  // re-checks the session, this only decides what to show.
  const signedIn = sessionTokenIsValid((await cookies()).get(ADMIN_COOKIE)?.value);

  return (
    <div className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <NhuDayaBackdrop />
      <div className="relative mx-auto max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/newah-full-logo-transparent.png"
              alt="Newah Organization of America"
              width={1024}
              height={1024}
              priority
              className="size-40 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
            />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-white">
            Mha Puja Check-In
          </h1>
          <p className="mt-2 text-base text-white/70">
            Welcome to Nhu Daya Bhintuna
          </p>
        </div>

        {signedIn ? (
          <CheckinForm />
        ) : (
          <form
            action={logIn}
            className="space-y-4 rounded-xl border border-white/15 bg-white/[0.06] p-6"
          >
            <input type="hidden" name="next" value="/checkin/mhapuja" />
            <label htmlFor="password" className="block text-sm font-semibold text-white">
              Volunteer password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-white placeholder-white/50 transition-all focus:border-patasi focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_rgba(192,16,43,0.35)] focus:outline-none"
            />
            {error && <p className="text-sm text-alert">That password was not correct.</p>}
            {locked && (
              <p className="text-sm text-alert">
                Too many attempts. Try again in {Math.ceil(Number(locked) / 60) || 1} minute
                {Math.ceil(Number(locked) / 60) === 1 ? "" : "s"}.
              </p>
            )}
            <LiquidButton type="submit" size="xl" className="w-full text-white">
              Sign in
            </LiquidButton>
          </form>
        )}
      </div>
    </div>
  );
}
