import PatasiFrame from "@/components/ui/patasi-frame";
import { EVENT } from "@/lib/constants/event";

/**
 * The campaign promise.
 *
 * Deliberately makes no claim about a proportion. Event expenses come out
 * first, and a donor who declines to cover the card processing fee has it
 * deducted from their gift, so any "100%" or "in full" wording here would be
 * false. See lib/payments/fees.ts.
 *
 * Wears the same patasi frame as the form, so the two read as one object.
 */
export default function CauseBanner() {
  return (
    <PatasiFrame className="!mb-10">
      <div className="bg-haku/35 px-5 py-5 text-center backdrop-blur-[3px]">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-lun">
          {EVENT.title}
        </p>
        <p className="text-sm leading-relaxed font-semibold text-white">
          {EVENT.promise} {EVENT.fundName}.
        </p>
      </div>
    </PatasiFrame>
  );
}
