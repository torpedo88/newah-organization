import { Metadata } from "next";
import { EVENT } from "@/lib/constants/event";
import RegistrationForm from "@/components/registration/registration-form";

export const metadata: Metadata = {
  title: `${EVENT.name} Registration - Newah Organization`,
  description: `Register for ${EVENT.name} with the Newah Organization of America, Northern California Chapter.`,
};

export default function RegisterPage() {
  return <RegistrationForm />;
}
