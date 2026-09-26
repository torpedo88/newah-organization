import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import PrintButton from "@/components/ui/print-button";
import { ORG } from "@/lib/legal/org";
import { EVENT, PRINTED_REGISTRATION_URL } from "@/lib/constants/event";

export const metadata: Metadata = {
  title: `${EVENT.name} poster — ${ORG.chapter}`,
  description: `A printable A4 poster for ${EVENT.name}, with the registration QR code.`,
  // A utility page for the board, not something a search engine should index
  // and offer to the public in place of the real registration page.
  robots: { index: false, follow: false },
};

/**
 * The printable poster.
 *
 * A4 at 210x297mm, laid out in millimetres rather than pixels so what prints
 * is what was designed. The screen view shows the same sheet on a grey desk
 * with a print button; @media print drops everything but the sheet.
 *
 * The QR is docs/qr-register-print.png, the one already in the repository:
 * version 5 at error-correction level H, which survives a crease or a coffee
 * ring. It encodes https://www.noancc.org/register/indrajatra and that URL has
 * to keep resolving forever, because a printed code cannot be reissued. See
 * docs/PRINTED-QR.md before touching it.
 *
 * print-color-adjust is set because browsers drop background images and dark
 * fills when printing by default — without it this sheet prints as black text
 * on white paper with a hole where the photograph was.
 */
export default function PosterPage() {
  const hasWhen = EVENT.date !== "";
  const hasWhere = EVENT.venue !== "" || EVENT.city !== "";
  // Not siteUrl(): see PRINTED_REGISTRATION_URL. The address on the sheet has
  // to be the address the QR encodes, whatever host rendered the page.
  const registerUrl = PRINTED_REGISTRATION_URL;

  return (
    <main className="min-h-screen bg-neutral-800 py-8 print:bg-white print:py-0">
      <PrintButton />

      <div
        className="mx-auto flex flex-col overflow-hidden bg-haku text-white shadow-2xl print:shadow-none"
        style={{
          width: "210mm",
          height: "297mm",
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
        }}
      >
        {/* The patasi rule, as on the share card. */}
        <div className="h-[6mm] shrink-0 bg-patasi" />

        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* The photograph, bleeding off the right as it does on the site. */}
          <div className="photo-bleed pointer-events-none absolute inset-y-0 right-0 w-[58%] rotate-[3deg]">
            <Image
              src="/images/hero-lakhey-mask.jpg"
              alt=""
              fill
              priority
              sizes="130mm"
              className="object-cover object-center saturate-[0.92]"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg,#0E0E11 32%,rgba(14,14,17,0.95) 52%," +
                "rgba(14,14,17,0.60) 76%,rgba(14,14,17,0.30) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage: "url('/images/patasi-weave.svg')",
              backgroundRepeat: "repeat",
              backgroundSize: "26mm 26mm",
            }}
          />

          <div className="relative z-10 flex flex-1 flex-col px-[16mm] pb-[10mm] pt-[12mm]">
            <div className="flex items-center gap-[6mm]">
              <Image
                src="/images/newah-full-logo-transparent.png"
                alt=""
                width={512}
                height={512}
                className="h-[26mm] w-[26mm] shrink-0 object-contain"
              />
              <div>
                <p className="text-[3.6mm] font-bold uppercase leading-tight tracking-[0.14em] text-lun">
                  {ORG.name}
                </p>
                <p className="text-[3mm] font-medium uppercase tracking-[0.18em] text-lun/75">
                  {ORG.chapter}
                </p>
              </div>
            </div>

            <p className="mt-[14mm] text-[4mm] font-semibold uppercase tracking-[0.22em] text-lun-bright">
              You are invited
            </p>
            <h1 className="mt-[3mm] max-w-[105mm] text-[16mm] font-bold leading-[1.02] tracking-[-0.02em]">
              {EVENT.name}
            </h1>
            <p className="mt-[2mm] max-w-[105mm] text-[7mm] font-light italic leading-tight text-lun">
              {EVENT.title}
            </p>

            <div className="mt-[8mm] max-w-[98mm] space-y-[3mm] text-[3.8mm] leading-relaxed text-white/85">
              {hasWhen || hasWhere ? (
                <div className="space-y-[2mm]">
                  {hasWhen && (
                    <p className="flex items-center gap-[3mm] font-semibold">
                      <CalendarDays className="size-[5mm] shrink-0 text-lun" aria-hidden />
                      {EVENT.date}
                    </p>
                  )}
                  {hasWhere && (
                    <p className="flex items-center gap-[3mm] font-semibold">
                      <MapPin className="size-[5mm] shrink-0 text-lun" aria-hidden />
                      {[EVENT.venue, EVENT.city].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              ) : (
                <p className="inline-flex items-center gap-[3mm] rounded-full border border-lun/50 px-[5mm] py-[2mm] text-[3.4mm] font-semibold uppercase tracking-[0.12em] text-lun">
                  <CalendarDays className="size-[4.5mm] shrink-0" aria-hidden />
                  Date and venue to be announced
                </p>
              )}

              <p className="text-pretty">
                {EVENT.promise} <strong className="font-semibold">{EVENT.fundName}</strong>.
              </p>
            </div>

            {/* The QR, on white. A code printed on a dark ground is a code that
                does not scan: readers look for dark modules on a light field,
                and inverting it defeats most of them. */}
            <div className="mt-auto flex items-end gap-[8mm]">
              <div className="shrink-0 rounded-[3mm] bg-white p-[4mm]">
                <Image
                  src="/images/qr-register.png"
                  alt={`QR code linking to ${registerUrl}`}
                  width={1960}
                  height={1960}
                  className="h-[42mm] w-[42mm]"
                />
              </div>
              <div className="pb-[2mm]">
                <p className="text-[4.4mm] font-bold uppercase tracking-[0.14em] text-lun">
                  Scan to register
                </p>
                <p className="mt-[2mm] text-[4mm] font-semibold text-white">{registerUrl}</p>
                <p className="mt-[3mm] text-[3.4mm] text-white/70">
                  Free to attend &middot; donations optional
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The foot: the gold rule, and the things a poster is asked for. */}
        <div className="shrink-0 bg-haku-deep px-[16mm] py-[5mm]">
          <div className="flex items-end justify-between gap-[6mm] text-[3mm] leading-snug text-white/60">
            <p>
              {ORG.contactEmail}
              <br />
              {ORG.phone}
            </p>
            {ORG.showTaxDeductibility && (
              <p className="text-right">
                A 501(c)(3) tax-exempt, non-profit
                <br />
                charitable organization ({ORG.ein})
              </p>
            )}
          </div>
        </div>
        <div className="h-[4mm] shrink-0 bg-gradient-to-r from-patasi to-lun" />
      </div>
    </main>
  );
}
