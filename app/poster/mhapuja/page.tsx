import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, Clock, MapPin, Phone } from "lucide-react";
import PrintButton from "@/components/ui/print-button";
import { ORG } from "@/lib/legal/org";
import { CO_ORGANISERS } from "@/lib/constants/event";
import {
  MHAPUJA_ADULT_PRICE_CENTS,
  MHAPUJA_CHILD_AGE_CEILING,
  MHAPUJA_CHILD_PRICE_CENTS,
  MHAPUJA_CONTACTS,
  MHAPUJA_EVENT,
  MHAPUJA_FEE_INCLUDES,
  MHAPUJA_PRINTED_REGISTRATION_URL,
} from "@/lib/constants/mhapuja";

export const metadata: Metadata = {
  title: `${MHAPUJA_EVENT.name} poster — ${ORG.chapter}`,
  description: `A printable A4 poster for ${MHAPUJA_EVENT.name}, with the registration QR code.`,
  // A utility page for the board, not something a search engine should index
  // and offer to the public in place of the real registration page.
  robots: { index: false, follow: false },
};

const ADULT_PRICE = (MHAPUJA_ADULT_PRICE_CENTS / 100).toFixed(0);
const CHILD_PRICE = (MHAPUJA_CHILD_PRICE_CENTS / 100).toFixed(0);

/**
 * The printable Mha Puja poster — Nhu Daya Bhintuna.
 *
 * Same sheet as /poster/indrajatra (A4, laid out in millimetres, print button
 * on screen, @media print drops everything but the sheet), dressed for the
 * Newah New Year: the gold Mha Puja mandala in place of the Lakhey photograph.
 *
 * The QR is docs/qr-register-mhapuja-print.png, copied to
 * public/images/qr-register-mhapuja.png: version 5 at error-correction level
 * H. It encodes https://www.noancc.org/register/mhapuja and that URL has to
 * keep resolving forever, because a printed code cannot be reissued. See
 * docs/PRINTED-QR.md before touching it.
 */
export default function MhaPujaPosterPage() {
  // Not siteUrl(): the address on the sheet has to be the address the QR
  // encodes, whatever host rendered the page.
  const registerUrl = MHAPUJA_PRINTED_REGISTRATION_URL;

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
        <div className="h-[6mm] shrink-0 bg-patasi" />

        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* Night sky with lamp-light, as on the site. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 40% at 78% 30%,rgba(227,196,99,0.16),transparent 70%)," +
                "radial-gradient(80% 35% at 50% 100%,rgba(192,16,43,0.24),transparent 75%)," +
                "radial-gradient(120% 80% at 50% 0%,#1d1014 0%,#0E0E11 55%,#08080A 100%)",
            }}
          />
          {/* The mandala, bleeding off the right edge. */}
          <div className="pointer-events-none absolute right-[-48mm] top-[18mm] h-[170mm] w-[170mm] opacity-[0.42]">
            <Image
              src="/images/mhapuja-mandala.webp"
              alt=""
              fill
              priority
              sizes="170mm"
              className="object-contain"
            />
          </div>
          {/* Keep the copy on the left legible where it crosses the petals. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg,rgba(14,14,17,0.92) 30%,rgba(14,14,17,0.55) 55%,transparent 75%)",
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
                {CO_ORGANISERS.length > 0 && (
                  <p className="mt-[2mm] text-[3.6mm] font-bold uppercase leading-tight tracking-[0.14em] text-lun">
                    {CO_ORGANISERS.join(" · ")}
                  </p>
                )}
              </div>
            </div>

            <p className="mt-[12mm] text-[4mm] font-semibold uppercase tracking-[0.22em] text-lun-bright">
              Nepal Sambat {MHAPUJA_EVENT.nepalSambatYear}
            </p>
            <h1 className="mt-[3mm] max-w-[120mm] text-[15mm] font-bold leading-[1.02] tracking-[-0.02em]">
              {MHAPUJA_EVENT.nepalBhasaTitle}
            </h1>
            <p className="mt-[2mm] max-w-[110mm] text-[7mm] font-light italic leading-tight text-lun">
              {MHAPUJA_EVENT.name} &middot; Newah New Year
            </p>

            <div className="mt-[8mm] max-w-[100mm] space-y-[2mm] text-[3.8mm] leading-relaxed text-white/85">
              <p className="flex items-center gap-[3mm] font-semibold">
                <CalendarDays className="size-[5mm] shrink-0 text-lun" aria-hidden />
                {MHAPUJA_EVENT.date}
              </p>
              <p className="flex items-center gap-[3mm] font-semibold">
                <Clock className="size-[5mm] shrink-0 text-lun" aria-hidden />
                {MHAPUJA_EVENT.schedule}
              </p>
              <p className="flex items-start gap-[3mm] font-semibold">
                <MapPin className="mt-[0.6mm] size-[5mm] shrink-0 text-lun" aria-hidden />
                <span>
                  {MHAPUJA_EVENT.venue}
                  <br />
                  <span className="font-normal text-white/75">{MHAPUJA_EVENT.city}</span>
                </span>
              </p>
              <p className="pt-[2mm] text-pretty">
                Adults ${ADULT_PRICE} &middot; children under {MHAPUJA_CHILD_AGE_CEILING} ${CHILD_PRICE}
                {" "}&middot; {MHAPUJA_FEE_INCLUDES}
              </p>
            </div>

            {/* The QR, on white: readers look for dark modules on a light
                field, and a code printed on a dark ground does not scan. */}
            <div className="mt-auto flex items-end justify-between gap-[8mm]">
              <div className="flex flex-col items-start">
                <div className="rounded-[4mm] bg-white p-[5mm]">
                  <Image
                    src="/images/qr-register-mhapuja.png"
                    alt={`QR code linking to ${registerUrl}`}
                    width={1960}
                    height={1960}
                    className="h-[62mm] w-[62mm]"
                  />
                </div>
                <p className="mt-[5mm] text-[9mm] font-bold uppercase leading-[1.02] tracking-[0.04em] text-lun-bright">
                  Register here
                </p>
                <p className="mt-[2mm] text-[4mm] font-semibold text-white">{registerUrl}</p>
              </div>

              <div className="space-y-[1.5mm] pb-[1mm] text-right text-[3.4mm] text-white/80">
                <p className="text-[3mm] font-semibold uppercase tracking-[0.18em] text-lun">
                  Questions
                </p>
                {MHAPUJA_CONTACTS.map((c) => (
                  <p key={c.phone} className="flex items-center justify-end gap-[2mm]">
                    <Phone className="size-[3.6mm] text-lun" aria-hidden />
                    {c.name} &middot; {c.phone}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

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
