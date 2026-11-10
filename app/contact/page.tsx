import type { Metadata } from "next";
import SiteHeader from "@/components/ui/site-header";
import FestivalBackdrop from "@/components/ui/festival-backdrop";
import ContactForm from "./form";

export const metadata: Metadata = {
  title: "Contact Us - Newah Organization",
  description: "Get in touch with the Newah Organization",
};

export default function ContactPage() {
  return (
    <main>
      <SiteHeader />
      <div className="relative min-h-screen px-4 py-16">
        <FestivalBackdrop />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Have questions or want to get involved? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Get In Touch</h2>
              <ContactForm />
            </div>

            <div className="space-y-8">
              <div className="rounded-2xl border-2 border-white/20 bg-white/[0.07] p-6">
                <h3 className="text-lg font-semibold text-lun mb-3">Email</h3>
                <a href="mailto:contact@example.com" className="text-white hover:text-lun transition">
                  contact@example.com
                </a>
              </div>

              <div className="rounded-2xl border-2 border-white/20 bg-white/[0.07] p-6">
                <h3 className="text-lg font-semibold text-lun mb-3">Phone</h3>
                <a href="tel:+15551234567" className="text-white hover:text-lun transition">
                  (555) 123-4567
                </a>
              </div>

              <div className="rounded-2xl border-2 border-white/20 bg-white/[0.07] p-6">
                <h3 className="text-lg font-semibold text-lun mb-3">Location</h3>
                <p className="text-white">
                  Northern California<br />
                  USA
                </p>
              </div>

              <div className="rounded-2xl border-2 border-white/20 bg-white/[0.07] p-6">
                <h3 className="text-lg font-semibold text-lun mb-3">Social</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-white hover:text-lun transition">
                    Facebook
                  </a>
                  <a href="#" className="block text-white hover:text-lun transition">
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
