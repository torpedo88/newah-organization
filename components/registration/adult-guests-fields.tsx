"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { ADULT_AGE, MAX_ADULT_GUESTS } from "@/lib/constants/event";
import { Registration } from "@/lib/validation/registration";
import { formatPhoneAsTyped } from "@/lib/validation/contact";

const fieldClass =
  "w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/15 text-white placeholder-white/50 focus:outline-none focus:border-patasi focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_rgba(192,16,43,0.35)] transition-all";

/**
 * Names and emails of the other attending adults, so their name tags can be
 * made ahead of the event.
 *
 * Adults only, stated plainly on the form. Collecting children's details would
 * pull a volunteer-run community site into COPPA and its equivalents for no
 * benefit — a name tag for a child can be written at the desk.
 */
export default function AdultGuestsFields({ form }: { form: UseFormReturn<Registration> }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "adultGuests" });
  const errors = form.formState.errors.adultGuests;

  return (
    <div className="space-y-4 border-t border-white/10 pt-6">
      <div>
        <h2 className="text-sm font-semibold text-white">Other adults attending</h2>
        <p className="mt-1 text-sm text-white/60">
          We make name tags in advance, so we need the name, email and phone number of
          every adult ({ADULT_AGE}+) coming with you.{" "}
          <span className="font-semibold text-white">
            Please do not enter details for anyone under {ADULT_AGE}
          </span>{" "}
          — we do not collect children&rsquo;s information, and they are welcome without it.
        </p>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Adult {index + 2}</p>
            <button
              type="button"
              onClick={() => remove(index)}
              className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white"
            >
              <X className="size-4" aria-hidden />
              Remove
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <input
                {...form.register(`adultGuests.${index}.name`)}
                placeholder="Full name"
                className={fieldClass}
              />
              {errors?.[index]?.name && (
                <p className="mt-1 text-sm text-alert">{errors[index]?.name?.message}</p>
              )}
            </div>
            <div>
              <input
                {...form.register(`adultGuests.${index}.email`)}
                type="email"
                placeholder="Email"
                className={fieldClass}
              />
              {errors?.[index]?.email && (
                <p className="mt-1 text-sm text-alert">{errors[index]?.email?.message}</p>
              )}
            </div>
            <div>
              <input
                  type="tel"
                  inputMode="tel"
                  placeholder="(555) 123-4567"
                  className={fieldClass}
                  {...form.register(`adultGuests.${index}.phone`)}
                  onChange={(event) => {
                    event.target.value = formatPhoneAsTyped(event.target.value);
                    form.register(`adultGuests.${index}.phone`).onChange(event);
                  }}
                />
              {errors?.[index]?.phone && (
                <p className="mt-1 text-sm text-alert">{errors[index]?.phone?.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {fields.length < MAX_ADULT_GUESTS && (
        <button
          type="button"
          onClick={() => append({ name: "", email: "", phone: "" })}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-patasi/60 hover:bg-patasi/10 hover:text-white"
        >
          <Plus className="size-4" aria-hidden />
          Add another adult
        </button>
      )}
    </div>
  );
}
