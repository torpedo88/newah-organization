import CheckinForm from "@/components/checkin/checkin-form";
import NhuDayaBackdrop from "@/components/ui/nhu-daya-backdrop";
import Image from "next/image";

export const metadata = {
  title: "Mha Puja Check-In",
};

export default function CheckinPage() {
  return (
    <div className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <NhuDayaBackdrop />
      <div className="relative mx-auto max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/newah-full-logo-transparent.png"
              alt="Newah Organization of America"
              width={1024}
              height={1024}
              priority
              className="size-40 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
            />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-white">
            Mha Puja Check-In
          </h1>
          <p className="mt-2 text-base text-white/70">
            Welcome to Nhu Daya Bhintuna
          </p>
        </div>

        <CheckinForm />
      </div>
    </div>
  );
}
