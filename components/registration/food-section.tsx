"use client";

import { UseFormReturn } from "react-hook-form";
import { Registration } from "@/lib/validation/registration";

interface FoodSectionProps {
  form: UseFormReturn<Registration>;
}

export default function FoodSection({ form }: FoodSectionProps) {
  const foodError = (form.formState.errors as any).foodOption;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-[#0A0E27] dark:text-white">
        What is your Food?
      </h2>

      <div>
        <input
          type="text"
          {...form.register("foodOption", { shouldUnregister: true })}
          placeholder="e.g., Dal Bhat, Chicken Curry, Vegetarian Special"
          className="w-full px-4 py-3 rounded-lg bg-[#E8F0F7] dark:bg-[#1a2a3a] border border-[#E8F0F7] dark:border-[#2a3a4a] text-[#0A0E27] dark:text-white placeholder-[#7a8a9a] dark:placeholder-[#8a9aaa] focus:outline-none focus:border-[#FF7A45] transition-colors"
        />
      </div>

      {foodError && (
        <p className="text-sm text-[#FF3B30] dark:text-[#FF453A]">{foodError.message}</p>
      )}
    </div>
  );
}
