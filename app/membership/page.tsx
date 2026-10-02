import type { Metadata } from "next";
import SiteHeader from "@/components/ui/site-header";
import FestivalBackdrop from "@/components/ui/festival-backdrop";
import MembershipForm from "./form";

export const metadata: Metadata = {
  title: "Membership - Newah Organization",
  description: "Join the Newah Organization and support cultural preservation",
};

const membershipTypes = [
  {
    name: "Regular",
    price: "$50",
    description: "Annual membership for individuals",
    benefits: [
      "Event access",
      "Newsletter",
      "Community updates",
      "Member directory",
    ],
  },
  {
    name: "Family",
    price: "$75",
    description: "Annual membership for families",
    benefits: [
      "Up to 4 family members",
      "All events",
      "Newsletter",
      "Community updates",
      "Family directory",
    ],
    highlighted: true,
  },
  {
    name: "Lifetime",
    price: "$500",
    description: "Lifetime membership",
    benefits: [
      "Lifetime access",
      "All events",
      "Newsletter",
      "VIP recognition",
      "Lifetime directory",
    ],
  },
];

export default function MembershipPage() {
  return (
    <main>
      <SiteHeader />
      <div className="relative min-h-screen px-4 py-16">
        <FestivalBackdrop />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Join Our Community</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Support the preservation and continuation of Newah culture, language, traditions and arts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {membershipTypes.map((type) => (
              <div
                key={type.name}
                className={`rounded-3xl p-8 transition-all ${
                  type.highlighted
                    ? "border-2 border-lun bg-lun/10 scale-105"
                    : "border-2 border-white/20 bg-white/[0.07]"
                }`}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{type.name}</h3>
                <p className="text-4xl font-bold text-lun mb-2">{type.price}</p>
                <p className="text-sm text-white/70 mb-6">{type.description}</p>

                <ul className="space-y-3 mb-8">
                  {type.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-white/80">
                      <span className="text-lun mt-1">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <button className="w-full">
                  <div className="text-white/50 text-sm">Sign up to join</div>
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border-2 border-white/20 bg-white/[0.07] p-8 md:p-12">
            <h2 className="text-2xl font-bold text-white mb-6">Why Join?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-lun mb-3">Support Culture</h3>
                <p className="text-white/80">
                  Your membership directly supports the preservation of Newah language, festivals, and traditions in Northern California.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-lun mb-3">Community</h3>
                <p className="text-white/80">
                  Connect with other members of the Newah diaspora and celebrate our shared heritage together.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-lun mb-3">Events</h3>
                <p className="text-white/80">
                  Access to exclusive events including Indra Jatra celebrations, festivals, workshops, and cultural programs.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-lun mb-3">Impact</h3>
                <p className="text-white/80">
                  Be part of a movement that keeps our culture alive for future generations.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-3xl border-2 border-white/20 bg-white/[0.07] p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Ready to Join?</h2>
            <p className="text-white/80 text-center mb-8 max-w-2xl mx-auto">
              Fill out the form below and join our community of dedicated members.
            </p>
            <MembershipForm />
          </div>
        </div>
      </div>
    </main>
  );
}
