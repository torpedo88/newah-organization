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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 text-center">
          {type === "FOOD" ? (
            <>
              {/* Success Icon */}
              <div className="text-6xl mb-4">✓</div>
              <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                Registration Successful!
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Thank you for registering with Newah Organization.
              </p>

              {/* Registration Code */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 mb-8">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Registration Number</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{code}</p>
              </div>

              {/* Registration Details */}
              <div className="space-y-4 text-left max-w-md mx-auto mb-8">
                <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Name:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{data.fullName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Registration:</span>
                  <span className="font-medium text-slate-900 dark:text-white">Food</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600 dark:text-slate-400">Food Selection:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {getFoodLabel((data as any).foodOption)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
                Confirmation has been sent to your email.
              </p>
            </>
          ) : (
            <>
              {/* Donation Success Icon */}
              <div className="text-6xl mb-4">❤️</div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Thank You!
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Thank you for supporting Newah Organization.
              </p>

              {/* Registration Code */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 mb-8">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Registration Number</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{code}</p>
              </div>

              {/* Donation Details */}
              <div className="space-y-4 text-left max-w-md mx-auto mb-8">
                <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Donation:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    ${((data as any).donationAmount as number).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600 dark:text-slate-400">Payment Status:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">✓ Paid</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
                Confirmation has been sent to your email.
              </p>
            </>
          )}

          {/* Done Button */}
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Done
          </Link>
        </div>
      </div>
    </div>
  );
}
