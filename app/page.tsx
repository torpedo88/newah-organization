import { Button } from "@/components/ui/button";

export default function Home() {
  return (
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
      <Button disabled>Events coming soon</Button>
    </main>
  );
}
