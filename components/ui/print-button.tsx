"use client";

import { Printer } from "lucide-react";

/**
 * The print control, and the page's print rules.
 *
 * Both live here because the button is the only reason this page needs a
 * client component at all, and the @page rule belongs next to it rather than
 * in globals.css where it would apply to every page on the site.
 */
export default function PrintButton() {
  return (
    <>
      <style>{`
        @page { size: A4; margin: 0; }
        @media print {
          /* The sheet is the page. Everything the browser adds around it —
             the grey desk, this button — is screen furniture. */
          html, body { background: #fff; margin: 0; padding: 0; }
          .print-hide { display: none !important; }
        }
      `}</style>

      <div className="print-hide mx-auto mb-6 flex w-[210mm] max-w-full items-center justify-between gap-4 px-2">
        <p className="text-sm text-white/70">
          A4. Print at 100% with background graphics on, or the photograph and the dark ground
          will not come out.
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-lun px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-haku transition-colors hover:bg-lun-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lun"
        >
          <Printer className="size-4" aria-hidden />
          Print
        </button>
      </div>
    </>
  );
}
