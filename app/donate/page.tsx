import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/ui/site-header";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import FestivalBackdrop from "@/components/ui/festival-backdrop";

export const metadata: Metadata = {
  title: "Donate - Newah Organization",
  description: "Support the Newah Organization's mission to preserve culture",
};

const donationPurposes = [
  {
    title: "General Fund",
    description: "Support our overall mission and operations",
    icon: "🎯",
  },
  {
    title: "Scholarship Fund",
    description: "Help students learn Newah language and culture",
    icon: "📚",
  },
  {
    title: "Event Support",
    description: "Sponsor our annual festivals and celebrations",
    icon: "🎉",
  },
  {
    title: "Cultural Projects",
    description: "Fund documentation and preservation projects",
    icon: "🏛️",
  },
];

export default function DonatePage() {
  return (
    <main>
      <SiteHeader />
      <div className="relative min-h-screen px-4 py-16">
        <FestivalBackdrop />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Make a Donation</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Your contribution directly supports the preservation and celebration of Newah culture in Northern California.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="rounded-3xl border-2 border-white/20 bg-white/[0.07] p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Donation Options</h2>

              <div className="space-y-4 mb-8">
                <label className="flex items-center gap-4 p-4 rounded-lg border-2 border-white/20 cursor-pointer hover:bg-white/5 transition">
                  <input type="radio" name="amount" value="25" defaultChecked className="size-5" />
                  <div>
                    <p className="font-semibold text-white">$25</p>
                    <p className="text-sm text-white/60">Student/Limited Income</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-4 rounded-lg border-2 border-white/20 cursor-pointer hover:bg-white/5 transition">
                  <input type="radio" name="amount" value="50" className="size-5" />
                  <div>
                    <p className="font-semibold text-white">$50</p>
                    <p className="text-sm text-white/60">Standard Donation</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-4 rounded-lg border-2 border-white/20 cursor-pointer hover:bg-white/5 transition">
                  <input type="radio" name="amount" value="100" className="size-5" />
                  <div>
                    <p className="font-semibold text-white">$100</p>
                    <p className="text-sm text-white/60">Generous Donation</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-4 rounded-lg border-2 border-white/20 cursor-pointer hover:bg-white/5 transition">
                  <input type="radio" name="amount" value="custom" className="size-5" />
                  <div>
                    <p className="font-semibold text-white">Custom Amount</p>
                    <p className="text-sm text-white/60">Choose your own amount</p>
                  </div>
                </label>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">Purpose (Optional)</label>
                <select className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-white/40 focus:outline-none">
                  <option value="">General Fund</option>
                  <option value="scholarship">Scholarship Fund</option>
                  <option value="event">Event Support</option>
                  <option value="project">Cultural Projects</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="size-4 rounded" />
                  <span className="text-sm text-white/80">Make this donation anonymous</span>
                </label>
              </div>

              <LiquidButton className="w-full text-white mb-4">
                Proceed to Checkout
              </LiquidButton>

              <p className="text-xs text-white/50 text-center">
                Secure payment processing via Stripe. All donations are tax-deductible.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Where Your Donation Goes</h3>
                <div className="space-y-4">
                  {donationPurposes.map((purpose) => (
                    <div key={purpose.title} className="rounded-lg border border-white/20 bg-white/[0.05] p-4">
                      <div className="flex gap-4">
                        <span className="text-2xl">{purpose.icon}</span>
                        <div>
                          <h4 className="font-semibold text-white">{purpose.title}</h4>
                          <p className="text-sm text-white/70 mt-1">{purpose.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-lun/40 bg-lun/10 p-6">
                <h4 className="font-semibold text-white mb-2">💡 Tax Benefits</h4>
                <p className="text-sm text-white/80">
                  The Newah Organization of America is a 501(c)(3) non-profit. Your donation is tax-deductible.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-white/20">
            <p className="text-white/60">
              Have questions about donating? <Link href="/#contact" className="text-lun hover:text-lun-bright underline">Contact us</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
