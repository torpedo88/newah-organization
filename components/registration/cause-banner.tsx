import { EVENT } from "@/lib/constants/event";

/**
 * The campaign promise.
 *
 * "100% of donations" is only true because the donor covers the card
 * processing fee on top of their gift. If that ever changes, this wording has
 * to change with it — see lib/payments/fees.ts.
 */
export default function CauseBanner() {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-patasi/60 bg-patasi/15 backdrop-blur-xl">
      <div className="bg-patasi px-4 py-2 text-center">
        <p className="text-sm font-bold tracking-wide text-white uppercase">{EVENT.title}</p>
      </div>
      <p className="px-5 py-4 text-center text-sm leading-relaxed text-white">
        <span className="font-bold">{EVENT.promise} {EVENT.fundName}.</span>{" "}
        Every dollar you give is passed on in full.
      </p>
    </div>
  );
}
