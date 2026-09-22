import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

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
            <Link href="/register">Register</Link>
          </Button>
          <Button disabled variant="secondary">
            Events coming soon
          </Button>
        </div>
      </main>

      <footer className="border-t px-6 py-6 text-center">
        <LiquidButton asChild size="sm">
          <Link href="/admin" aria-label="Board sign-in">
            <LockKeyhole className="size-4" aria-hidden />
            Board sign-in
          </Link>
        </LiquidButton>
      </footer>
    </>
  );
}
