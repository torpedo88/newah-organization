"use client";

import Link from "next/link";
import { FOOD_OPTIONS } from "@/lib/constants/food";
import { FoodRegistration, DonationRegistration } from "@/lib/validation/registration";
import FestivalBackdrop, { FestivalPhotoCredit } from "@/components/ui/festival-backdrop";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { CircleCheckBig, HeartHandshake, BadgeCheck } from "lucide-react";

interface SuccessScreenProps {
  type: "FOOD" | "DONATION";
  code: string;
  data: FoodRegistration | DonationRegistration;
}

export default function SuccessScreen({ code, data }: SuccessScreenProps) {
  const getFoodLabel = (id: string) => {
    return FOOD_OPTIONS.find((opt) => opt.id === id)?.label || id;
  };

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <FestivalBackdrop />
      <div className="relative max-w-2xl mx-auto w-full">
        <div className="rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] p-8 text-center">
          {data.registrationType === "FOOD" ? (
            <>
              {/* Success Icon */}
              <CircleCheckBig className="mx-auto mb-4 size-14 text-lun" strokeWidth={1.5} aria-hidden />
              <h1 className="text-3xl font-bold text-white mb-2">
                Registration successful
              </h1>
              <p className="text-lg text-white/70 mb-8">
                Thank you for registering with Newah Organization.
              </p>

              {/* Registration Code */}
              <div className="bg-white/[0.06] rounded-lg p-6 mb-8 border border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/55 mb-2">registration number</p>
                <p className="text-3xl font-bold text-white font-mono">{code}</p>
              </div>

              {/* Registration Details */}
              <div className="space-y-4 text-left max-w-md mx-auto mb-8">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/55">name</span>
                  <span className="font-medium text-white">{data.fullName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/55">registration</span>
                  <span className="font-medium text-white">food</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/55">food selection</span>
                  <span className="font-medium text-white">
                    {getFoodLabel(data.foodOption)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-white/55">number of guests</span>
                  <span className="font-medium text-white">
                    {data.numberOfGuests}
                  </span>
                </div>
              </div>

              <p className="text-sm text-white/70 mb-8">
                confirmation has been sent to your email.
              </p>
            </>
          ) : (
            <>
              {/* Donation Success Icon */}
              <HeartHandshake className="mx-auto mb-4 size-14 text-lun" strokeWidth={1.5} aria-hidden />
              <h1 className="text-3xl font-bold text-white mb-2">
                Thank you
              </h1>
              <p className="text-lg text-white/70 mb-8">
                Thank you for supporting Newah Organization.
              </p>

              {/* Registration Code */}
              <div className="bg-white/[0.06] rounded-lg p-6 mb-8 border border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/55 mb-2">registration number</p>
                <p className="text-3xl font-bold text-white font-mono">{code}</p>
              </div>

              {/* Donation Details */}
              <div className="space-y-4 text-left max-w-md mx-auto mb-8">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/55">donation</span>
                  <span className="font-medium text-white">
                    ${data.donationAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-white/55">payment status</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#4ADE80]">
                    <BadgeCheck className="size-4" aria-hidden />
                    paid
                  </span>
                </div>
              </div>

              <p className="text-sm text-white/70 mb-8">
                confirmation has been sent to your email.
              </p>
            </>
          )}

          {/* Done Button */}
          <LiquidButton asChild size="xl" className="text-white">
            <Link href="/">Done</Link>
          </LiquidButton>
        </div>

        <FestivalPhotoCredit className="mt-8 text-center text-xs text-white/40" />
      </div>
    </div>
  );
}
