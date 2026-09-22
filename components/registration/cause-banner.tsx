import { EVENT } from "@/lib/constants/event";

/**
 * The campaign promise.
 *
 * Deliberately makes no claim about a proportion. Event expenses come out
 * first, and a donor who declines to cover the card processing fee has it
 * deducted from their gift, so any "100%" or "in full" wording here would be
 * false. See lib/payments/fees.ts.
 */
export default function CauseBanner() {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-patasi/60 bg-patasi/15 backdrop-blur-xl">
      <div className="bg-patasi px-4 py-2 text-center">
        <p className="text-sm font-bold tracking-wide text-white uppercase">{EVENT.title}</p>
      </div>
      <p className="px-5 py-4 text-center text-sm leading-relaxed text-white">
        <span className="font-bold">
          {EVENT.promise} {EVENT.fundName}.
        </span>
      </p>
    </div>
  );
}
