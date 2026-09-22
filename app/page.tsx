import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { ORG } from "@/lib/legal/org";
import { EVENT } from "@/lib/constants/event";

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Newah Organization of America
          <span className="block text-xl font-normal text-muted-foreground sm:text-2xl">
            Northern California Chapter
          </span>
        </h1>
        <p className="max-w-prose text-muted-foreground">
          A home for our community&apos;s events, news, and membership. This site is
          being built — check back soon.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/register">Register for {EVENT.name}</Link>
          </Button>
          <Button disabled variant="secondary">
            Events coming soon
          </Button>
        </div>
      </main>

      <footer className="border-t px-6 py-6">
        <nav className="mb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <Link href="/privacy" className="underline-offset-4 hover:underline hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="underline-offset-4 hover:underline hover:text-foreground">
            Terms and Conditions
          </Link>
          <a
            href={`mailto:${ORG.contactEmail}`}
            className="underline-offset-4 hover:underline hover:text-foreground"
          >
            {ORG.contactEmail}
          </a>
        </nav>
        <div className="text-center">
          <LiquidButton asChild size="sm">
            <Link href="/admin" aria-label="Board sign-in">
              <LockKeyhole className="size-4" aria-hidden />
              Board sign-in
            </Link>
          </LiquidButton>
        </div>
      </footer>
    </>
  );
}
