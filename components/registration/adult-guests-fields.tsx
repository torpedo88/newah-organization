"use client";

import { useEffect } from "react";
import { useFieldArray, useWatch, UseFormReturn } from "react-hook-form";
import { ADULT_AGE, MAX_ADULT_GUESTS } from "@/lib/constants/event";
import { Registration } from "@/lib/validation/registration";
import { formatPhoneAsTyped } from "@/lib/validation/contact";

const fieldClass =
  "w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/15 text-white placeholder-white/50 focus:outline-none focus:border-patasi focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_rgba(192,16,43,0.35)] transition-all";

/**
 * Other attending adults, asked for by count first.
 *
 * The previous version offered an "add another" button and open-ended rows,
 * which made the count and the names two separate things a registrant could
 * leave disagreeing — and left it unclear whether the rows were optional. Now
 * the party size is chosen first and exactly that many complete sets of fields
 * appear, all required. The count is never stored: it is derived from the
 * names, so the two cannot drift apart.
 *
 * Adults only, stated plainly. Collecting children's details would pull a
 * volunteer-run community site into COPPA and its equivalents for no benefit —
 * a name tag for a child can be written at the desk.
 */
export default function AdultGuestsFields({ form }: { form: UseFormReturn<Registration> }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "adultGuests" });
  const errors = form.formState.errors.adultGuests;

  const additional = useWatch({ control: form.control, name: "additionalAdults" });
  const wanted = typeof additional === "number" ? additional : 0;

  // Keep the number of field sets equal to the number chosen. Adding and
  // removing here rather than re-creating the array preserves what has already
  // been typed into the rows that survive.
  useEffect(() => {
    if (fields.length < wanted) {
      for (let i = fields.length; i < wanted; i += 1) {
        append({ name: "", email: "", phone: "" }, { shouldFocus: false });
      }
    } else if (fields.length > wanted) {
      for (let i = fields.length - 1; i >= wanted; i -= 1) remove(i);
    }
  }, [wanted, fields.length, append, remove]);

  const options = Array.from({ length: MAX_ADULT_GUESTS + 1 }, (_, i) => i);

  return (
    <div className="space-y-4 border-t border-white/10 pt-6">
      <div>
        <h2 className="text-sm font-semibold text-white">Other adults attending</h2>
        <p className="mt-1 text-sm text-white/60">
          We make name tags in advance, so we need the name, email and phone number of every
          adult ({ADULT_AGE}+) coming with you. Please do not enter details for anyone under{" "}
          {ADULT_AGE}.
        </p>
      </div>

      <div>
        <label htmlFor="additionalAdults" className="mb-2 block text-sm font-semibold text-white">
          How many other adults are coming with you?
        </label>
        <select
          id="additionalAdults"
          className={`${fieldClass} appearance-none`}
          value={typeof additional === "number" ? String(additional) : ""}
          onChange={(event) => {
            const raw = event.target.value;
            form.setValue(
              "additionalAdults",
              raw === "" ? undefined : Number.parseInt(raw, 10),
              { shouldDirty: true },
            );
          }}
        >
          <option value="" className="bg-haku">
            Please choose
          </option>
          {options.map((n) => (
            <option key={n} value={n} className="bg-haku">
              {n === 0 ? "Just me" : n === 1 ? "1 other adult" : `${n} other adults`}
            </option>
          ))}
        </select>
        {form.formState.errors.additionalAdults && (
          <p className="mt-1 text-sm text-alert">
            {form.formState.errors.additionalAdults.message}
          </p>
        )}
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2 rounded-2xl border border-white/12 bg-white/[0.04] p-4">
          <p className="text-sm font-semibold text-white">Adult {index + 2}</p>
          <div>
            <input
              {...form.register(`adultGuests.${index}.name`)}
              placeholder="Full name"
              autoComplete="off"
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
              inputMode="email"
              placeholder="Email"
              autoComplete="off"
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
              autoComplete="off"
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
      ))}
    </div>
  );
}
