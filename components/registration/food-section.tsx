"use client";

import { UseFormReturn } from "react-hook-form";
import { FOOD_OPTIONS } from "@/lib/constants/food";
import { Registration } from "@/lib/validation/registration";

interface FoodSectionProps {
  form: UseFormReturn<Registration>;
}

export default function FoodSection({ form }: FoodSectionProps) {
  const selectedFood = form.watch("foodOption");
  const foodError = (form.formState.errors as any).foodOption;

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-[#666666] dark:text-[#B0B0B0]">
        Choose Your Food *
      </h2>

      <div className="space-y-3">
        {FOOD_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
              selectedFood === option.id
                ? "border-[#9D4EDD] bg-[#F5EFFF] dark:bg-[#2A1E4E]"
                : "border-[#E5E5E7] dark:border-[#2A2E4E] bg-white dark:bg-[#161B35] hover:border-[#9D4EDD]"
            }`}
          >
            <input
              type="radio"
              value={option.id}
              {...form.register("foodOption", { shouldUnregister: true })}
              className="w-4 h-4 text-[#9D4EDD] dark:text-[#9D4EDD] cursor-pointer"
            />
            <span className="ml-3 text-[#0A0E27] dark:text-white font-medium">{option.label}</span>
          </label>
        ))}
      </div>

      {foodError && (
        <p className="text-sm text-[#FF3B30] dark:text-[#FF453A]">{foodError.message}</p>
      )}
    </div>
  );
}
