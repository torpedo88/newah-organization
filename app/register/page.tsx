import { Metadata } from "next";
import RegistrationForm from "@/components/registration/registration-form";

export const metadata: Metadata = {
  title: "Registration - Newah Organization",
  description:
    "Register with Newah Organization. Choose between food registration or make a donation.",
};

export default function RegisterPage() {
  return <RegistrationForm />;
}
