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
      <h2 className="text-base font-semibold text-[#1A1A18] dark:text-[#FAFAF8]">
        choose your food *
      </h2>

      <div className="space-y-3">
        {FOOD_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedFood === option.id
                ? "border-[#C41E3A] bg-[#FEF5F5] dark:bg-[#2A1A1A]"
                : "border-[#E8E8E5] dark:border-[#2A2A28] bg-white dark:bg-[#0F0F0D] hover:border-[#C41E3A]"
            }`}
          >
            <input
              type="radio"
              value={option.id}
              {...form.register("foodOption", { shouldUnregister: true })}
              className="w-4 h-4 text-[#C41E3A] dark:text-[#C41E3A] cursor-pointer"
            />
            <span className="ml-3 text-[#1A1A18] dark:text-[#FAFAF8] font-medium">{option.label}</span>
          </label>
        ))}
      </div>

      {foodError && (
        <p className="text-sm text-[#C41E3A]">{foodError.message}</p>
      )}
    </div>
  );
}
