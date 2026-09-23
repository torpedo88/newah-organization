import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Heart } from "lucide-react";
import ShaderHero from "@/components/ui/shader-hero";
import { ORG } from "@/lib/legal/org";
import { EVENT, FESTIVALS } from "@/lib/constants/event";

export const metadata: Metadata = {
  title: `${ORG.name} — ${ORG.chapter}`,
  description:
    "The Northern California chapter of the Newah Organization of America: preserving " +
    "and continuing Newah culture, language, traditions and arts.",
};

export default function Home() {
  return (
    <main className="bg-haku">
      <ShaderHero />

      {/* Our Culture ------------------------------------------------- */}
      <section className="border-t border-white/10 bg-haku py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-patasi">Our Culture</div>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">A community, kept alive</h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-white/80">
            We are the {ORG.chapter} of the {ORG.name} — preserving, promoting, and continuing Newah culture, language, traditions and arts for the Northern California community.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: "Language", desc: "Nepal Bhasa with its own script, predating the nation" },
              { title: "Traditions", desc: "Festivals and celebrations that connect us" },
              { title: "Community", desc: "Unity across Northern California" },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-patasi/30 bg-patasi/10 p-6">
                <h3 className="font-bold text-patasi text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-white/75">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Calendar ----------------------------------------- */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-patasi">Our Year</div>
          <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">The festivals we celebrate</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FESTIVALS.map((f) => (
              <div key={f.name} className="group rounded-xl border-2 border-white/15 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 transition-all hover:border-patasi hover:bg-patasi/15">
                <h3 className="text-lg font-bold text-white">{f.name}</h3>
                <p className="mt-1 text-sm text-patasi font-semibold">{f.also}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-white/50">{f.when}</p>
                <p className="mt-4 text-sm leading-relaxed text-white/75">{f.what}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* This Year Event ------------------------------------------- */}
      <section className="border-t border-white/10 bg-gradient-to-b from-patasi/10 to-haku py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src="/images/home-hero-image.png"
                alt={EVENT.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-patasi">This Year</div>
              <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">{EVENT.name}</h2>
              <p className="mb-6 text-lg text-white/85">{EVENT.title}</p>
              <p className="mb-8 leading-relaxed text-white/75">{EVENT.promise}</p>
              <Link
                href="/register/indrajatra"
                className="inline-flex items-center gap-2 rounded-lg bg-patasi px-6 py-3 font-semibold text-white transition-all hover:bg-patasi/90"
              >
                Register for {EVENT.name}
                <ArrowRight className="size-4" />
              </Link>
              <p className="mt-3 text-sm text-white/60">Free to attend • Donations optional</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision ------------------------------------------ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-patasi">Our Purpose</div>
          <h2 className="mb-12 text-3xl font-bold text-white sm:text-4xl">Mission & Vision</h2>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-xl border border-patasi/30 bg-patasi/10 p-8">
              <h3 className="mb-4 text-xl font-bold text-patasi">Our Mission</h3>
              <p className="leading-relaxed text-white/80">
                To preserve, promote, and pass on the Newah language, culture, traditions, and heritage to current and future generations in Northern California.
              </p>
            </div>
            <div className="rounded-xl border border-patasi/30 bg-patasi/10 p-8">
              <h3 className="mb-4 text-xl font-bold text-patasi">Our Vision</h3>
              <p className="leading-relaxed text-white/80">
                To build a vibrant, united Newah community where our culture is celebrated, our identity is strong, and our traditions thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved ------------------------------------------------ */}
      <section className="border-t border-white/10 bg-gradient-to-b from-haku to-white/[0.02] py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-patasi">Ways to Connect</div>
          <h2 className="mb-12 text-3xl font-bold text-white sm:text-4xl">Get involved</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: "👥", title: "Membership", desc: "Join our community", href: "#" },
              { icon: "🤝", title: "Volunteer", desc: "Share your time & skills", href: "#" },
              { icon: Heart, title: "Donate", desc: "Support our mission", href: "/donate" },
            ].map((item, i) => (
              <Link
                key={i}
                href={typeof item.href === "string" ? item.href : "#"}
                className="group rounded-xl border border-white/15 bg-white/[0.04] p-6 transition-all hover:border-patasi hover:bg-patasi/15"
              >
                {typeof item.icon === "string" ? (
                  <div className="mb-3 text-3xl">{item.icon}</div>
                ) : (
                  <item.icon className="mb-3 size-6 text-patasi" />
                )}
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-white/70">{item.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-sm text-patasi font-semibold">
                  Learn more <ArrowRight className="size-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer ------------------------------------------------------ */}
      <footer className="border-t border-white/10 bg-haku py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-4">
            <div>
              <h3 className="font-bold text-white">Quick Links</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li><Link href="/register/indrajatra" className="hover:text-patasi">Register</Link></li>
                <li><Link href="/donate" className="hover:text-patasi">Donate</Link></li>
                <li><Link href="/" className="hover:text-patasi">Home</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li><Link href="/privacy" className="hover:text-patasi">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-patasi">Terms & Conditions</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white">Contact</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li><a href={`mailto:${ORG.contactEmail}`} className="hover:text-patasi">{ORG.contactEmail}</a></li>
                <li><a href={ORG.facebook} className="hover:text-patasi" target="_blank" rel="noreferrer">Facebook</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white">{ORG.shortName}</h3>
              <p className="mt-4 text-sm text-white/70">{ORG.chapter}</p>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/50">
            <p>&copy; {new Date().getFullYear()} {ORG.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
