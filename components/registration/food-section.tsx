"use client";

import { UseFormReturn } from "react-hook-form";
import { FOOD_OPTIONS } from "@/lib/constants/food";
import { Registration, FoodRegistration } from "@/lib/validation/registration";

interface FoodSectionProps {
  form: UseFormReturn<Registration>;
}

export default function FoodSection({ form }: FoodSectionProps) {
  const selectedFood = form.watch("foodOption");
  const foodError = (form.formState.errors as any).foodOption;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Choose Your Food *</h2>

      <div className="space-y-3">
        {FOOD_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedFood === option.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500"
            }`}
          >
            <input
              type="radio"
              value={option.id}
              {...form.register("foodOption", { shouldUnregister: true })}
              className="w-4 h-4 text-blue-600 dark:text-blue-400 cursor-pointer"
            />
            <span className="ml-3 text-slate-900 dark:text-white font-medium">{option.label}</span>
          </label>
        ))}
      </div>

      {foodError && (
        <p className="text-sm text-red-600 dark:text-red-400">{foodError.message}</p>
      )}
    </div>
  );
}
