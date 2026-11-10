import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import SiteHeader from "@/components/ui/site-header";
import FestivalBackdrop from "@/components/ui/festival-backdrop";
import VolunteerForm from "./form";

export const metadata: Metadata = {
  title: "Volunteer - Newah Organization",
  description: "Join our team of volunteers and help preserve Newah culture",
};

const volunteerRoles = [
  {
    title: "Event Coordinator",
    description: "Help organize and run community events and celebrations",
    skills: "Organization, leadership, communication",
  },
  {
    title: "Language Tutor",
    description: "Teach Newah language to community members",
    skills: "Teaching, fluency in Newah",
  },
  {
    title: "Cultural Educator",
    description: "Share knowledge about traditions, crafts, and history",
    skills: "Knowledge of culture, public speaking",
  },
  {
    title: "Technology Support",
    description: "Help with website, social media, and tech infrastructure",
    skills: "Tech skills, social media",
  },
  {
    title: "Documentation",
    description: "Help document and archive cultural materials",
    skills: "Writing, photography, research",
  },
  {
    title: "Community Outreach",
    description: "Connect with community members and promote our mission",
    skills: "Communication, networking",
  },
];

export default function VolunteerPage() {
  return (
    <main>
      <SiteHeader />
      <div className="relative min-h-screen px-4 py-16">
        <FestivalBackdrop />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="mb-16 text-center">
            <div className="flex justify-center mb-4">
              <Heart className="size-12 text-lun" fill="currentColor" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Become a Volunteer</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Join our community of dedicated volunteers working to preserve and celebrate Newah culture in Northern California.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {volunteerRoles.map((role) => (
              <div
                key={role.title}
                className="rounded-2xl border-2 border-white/20 bg-white/[0.07] p-6 hover:border-lun/50 hover:bg-lun/5 transition-all"
              >
                <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                <p className="text-white/80 mb-4">{role.description}</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs uppercase tracking-wide text-white/50 mb-2">Required Skills</p>
                  <p className="text-sm text-white/70">{role.skills}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border-2 border-lun bg-lun/10 p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Why Volunteer With Us?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-lun text-white">
                    🎯
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Make Real Impact</h3>
                  <p className="text-white/80">
                    Directly contribute to the preservation of Newah culture for future generations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-lun text-white">
                    👥
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Join Community</h3>
                  <p className="text-white/80">
                    Connect with like-minded individuals passionate about Newah heritage.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-lun text-white">
                    🌱
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Learn & Grow</h3>
                  <p className="text-white/80">
                    Expand your knowledge and skills while serving the community.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-lun text-white">
                    🎓
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Flexible Schedule</h3>
                  <p className="text-white/80">
                    Choose how much time you can dedicate to volunteering.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Fill out the form below and we'll connect you with opportunities that match your interests and skills.
            </p>

            <VolunteerForm />

            <p className="text-white/60 mt-8">
              Questions? <Link href="/#contact" className="text-lun hover:text-lun-bright underline">Contact us</Link> directly
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
