"use client";

import Link from "next/link";
import { FOOD_OPTIONS } from "@/lib/constants/food";
import { FoodRegistration, DonationRegistration } from "@/lib/validation/registration";

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
    <div className="min-h-screen bg-white dark:bg-[#0A0E27] py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white dark:bg-[#161B35] rounded-xl shadow-sm border border-[#E5E5E7] dark:border-[#2A2E4E] p-8 text-center">
          {data.registrationType === "FOOD" ? (
            <>
              {/* Success Icon */}
              <div className="text-5xl mb-4">✓</div>
              <h1 className="text-3xl font-bold text-[#FF7A45] mb-2">
                Registration successful
              </h1>
              <p className="text-lg text-[#666666] dark:text-[#B0B0B0] mb-8">
                Thank you for registering with Newah Organization.
              </p>

              {/* Registration Code */}
              <div className="bg-[#F5F5F7] dark:bg-[#0A0E27] rounded-lg p-6 mb-8 border border-[#E5E5E7] dark:border-[#2A2E4E]">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#999999] dark:text-[#808090] mb-2">registration number</p>
                <p className="text-3xl font-bold text-[#0A0E27] dark:text-white font-mono">{code}</p>
              </div>

              {/* Registration Details */}
              <div className="space-y-4 text-left max-w-md mx-auto mb-8">
                <div className="flex justify-between py-2 border-b border-[#E5E5E7] dark:border-[#2A2E4E]">
                  <span className="text-[#999999] dark:text-[#808090]">name</span>
                  <span className="font-medium text-[#0A0E27] dark:text-white">{data.fullName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E5E5E7] dark:border-[#2A2E4E]">
                  <span className="text-[#999999] dark:text-[#808090]">registration</span>
                  <span className="font-medium text-[#0A0E27] dark:text-white">food</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E5E5E7] dark:border-[#2A2E4E]">
                  <span className="text-[#999999] dark:text-[#808090]">food selection</span>
                  <span className="font-medium text-[#0A0E27] dark:text-white">
                    {getFoodLabel(data.foodOption)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#999999] dark:text-[#808090]">number of guests</span>
                  <span className="font-medium text-[#0A0E27] dark:text-white">
                    {data.numberOfGuests}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#666666] dark:text-[#B0B0B0] mb-8">
                confirmation has been sent to your email.
              </p>
            </>
          ) : (
            <>
              {/* Donation Success Icon */}
              <div className="text-5xl mb-4">❤️</div>
              <h1 className="text-3xl font-bold text-[#FF7A45] mb-2">
                Thank you
              </h1>
              <p className="text-lg text-[#666666] dark:text-[#B0B0B0] mb-8">
                Thank you for supporting Newah Organization.
              </p>

              {/* Registration Code */}
              <div className="bg-[#F5F5F7] dark:bg-[#0A0E27] rounded-lg p-6 mb-8 border border-[#E5E5E7] dark:border-[#2A2E4E]">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#999999] dark:text-[#808090] mb-2">registration number</p>
                <p className="text-3xl font-bold text-[#0A0E27] dark:text-white font-mono">{code}</p>
              </div>

              {/* Donation Details */}
              <div className="space-y-4 text-left max-w-md mx-auto mb-8">
                <div className="flex justify-between py-2 border-b border-[#E5E5E7] dark:border-[#2A2E4E]">
                  <span className="text-[#999999] dark:text-[#808090]">donation</span>
                  <span className="font-medium text-[#0A0E27] dark:text-white">
                    ${data.donationAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#999999] dark:text-[#808090]">payment status</span>
                  <span className="font-medium text-[#2D9D1F] dark:text-[#30DB40]">✓ paid</span>
                </div>
              </div>

              <p className="text-sm text-[#666666] dark:text-[#B0B0B0] mb-8">
                confirmation has been sent to your email.
              </p>
            </>
          )}

          {/* Done Button */}
          <Link
            href="/"
            className="inline-block bg-[#FF7A45] hover:bg-[#FF6B35] dark:hover:bg-[#FF8555] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Done
          </Link>
        </div>
      </div>
    </div>
  );
}
