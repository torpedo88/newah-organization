"use client";

import Link from "next/link";
import { FOOD_OPTIONS } from "@/lib/constants/food";
import { FoodRegistration, DonationRegistration } from "@/lib/validation/registration";

interface SuccessScreenProps {
  type: "FOOD" | "DONATION";
  code: string;
  data: FoodRegistration | DonationRegistration;
}

export default function SuccessScreen({ type, code, data }: SuccessScreenProps) {
  const getFoodLabel = (id: string) => {
    return FOOD_OPTIONS.find((opt) => opt.id === id)?.label || id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF8] to-[#F5F5F3] dark:from-[#0F0F0D] dark:to-[#1A1A18] py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white dark:bg-[#1A1A18] rounded-lg shadow-sm border border-[#E8E8E5] dark:border-[#2A2A28] p-8 text-center">
          {type === "FOOD" ? (
            <>
              {/* Success Icon */}
              <div className="text-5xl mb-4">✓</div>
              <h1 className="text-3xl font-bold text-[#2D5016] dark:text-[#7FD876] mb-2">
                Registration successful
              </h1>
              <p className="text-lg text-[#8B8B85] dark:text-[#A0A09A] mb-8">
                Thank you for registering with Newah Organization.
              </p>

              {/* Registration Code */}
              <div className="bg-[#FAFAF8] dark:bg-[#0F0F0D] rounded-lg p-6 mb-8 border border-[#E8E8E5] dark:border-[#2A2A28]">
                <p className="text-sm text-[#8B8B85] dark:text-[#A0A09A] mb-2 lowercase">registration number</p>
                <p className="text-3xl font-bold text-[#1A1A18] dark:text-[#FAFAF8] font-mono">{code}</p>
              </div>

              {/* Registration Details */}
              <div className="space-y-4 text-left max-w-md mx-auto mb-8">
                <div className="flex justify-between py-2 border-b border-[#E8E8E5] dark:border-[#2A2A28]">
                  <span className="text-[#8B8B85] dark:text-[#A0A09A]">name</span>
                  <span className="font-medium text-[#1A1A18] dark:text-[#FAFAF8]">{data.fullName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E8E8E5] dark:border-[#2A2A28]">
                  <span className="text-[#8B8B85] dark:text-[#A0A09A]">registration</span>
                  <span className="font-medium text-[#1A1A18] dark:text-[#FAFAF8]">food</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#8B8B85] dark:text-[#A0A09A]">food selection</span>
                  <span className="font-medium text-[#1A1A18] dark:text-[#FAFAF8]">
                    {getFoodLabel((data as any).foodOption)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#8B8B85] dark:text-[#A0A09A] mb-8">
                confirmation has been sent to your email.
              </p>
            </>
          ) : (
            <>
              {/* Donation Success Icon */}
              <div className="text-5xl mb-4">❤️</div>
              <h1 className="text-3xl font-bold text-[#C41E3A] mb-2">
                Thank you
              </h1>
              <p className="text-lg text-[#8B8B85] dark:text-[#A0A09A] mb-8">
                Thank you for supporting Newah Organization.
              </p>

              {/* Registration Code */}
              <div className="bg-[#FAFAF8] dark:bg-[#0F0F0D] rounded-lg p-6 mb-8 border border-[#E8E8E5] dark:border-[#2A2A28]">
                <p className="text-sm text-[#8B8B85] dark:text-[#A0A09A] mb-2 lowercase">registration number</p>
                <p className="text-3xl font-bold text-[#1A1A18] dark:text-[#FAFAF8] font-mono">{code}</p>
              </div>

              {/* Donation Details */}
              <div className="space-y-4 text-left max-w-md mx-auto mb-8">
                <div className="flex justify-between py-2 border-b border-[#E8E8E5] dark:border-[#2A2A28]">
                  <span className="text-[#8B8B85] dark:text-[#A0A09A]">donation</span>
                  <span className="font-medium text-[#1A1A18] dark:text-[#FAFAF8]">
                    ${((data as any).donationAmount as number).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#8B8B85] dark:text-[#A0A09A]">payment status</span>
                  <span className="font-medium text-[#2D5016] dark:text-[#7FD876]">✓ paid</span>
                </div>
              </div>

              <p className="text-sm text-[#8B8B85] dark:text-[#A0A09A] mb-8">
                confirmation has been sent to your email.
              </p>
            </>
          )}

          {/* Done Button */}
          <Link
            href="/"
            className="inline-block bg-[#C41E3A] hover:bg-[#A01830] dark:hover:bg-[#D42940] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Done
          </Link>
        </div>
      </div>
    </div>
  );
}
