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
      <h2 className="text-sm font-semibold text-white">
        What is your Food?
      </h2>

      <div>
        <input
          type="text"
          {...form.register("foodOption", { shouldUnregister: true })}
          placeholder="e.g., Dal Bhat, Chicken Curry, Vegetarian Special"
          className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#FF7A45] focus:bg-[rgba(255,255,255,0.12)] focus:shadow-[0_0_0_4px_rgba(255,122,69,0.2)] transition-all"
        />
      </div>

      {foodError && (
        <p className="mt-1 text-sm text-[#FF3B30]">{foodError.message}</p>
      )}
    </div>
  );
}
