import { EVENT } from "@/lib/constants/event";
import { ORG } from "@/lib/legal/org";
import { siteUrl } from "@/lib/site";

/**
 * Confirmation email.
 *
 * Built plain on purpose. An earlier version used the site's dark haku patasi
 * palette with a gradient header and stacked cards. In Gmail's dark mode that
 * header sat on Gmail's own dark background and the heading was recoloured to
 * near-invisibility — mail clients rewrite colours and cannot be relied on to
 * leave a design intact.
 *
 * So: one light background, explicit colours on every element, and almost no
 * chrome. Light-on-dark conversion is the case clients handle worst; dark text
 * on white is the case they handle best.
 */
const INK = "#1A1A1A";
const MUTED = "#5A5A5A";
const FAINT = "#8A8A8A";
const RULE = "#E4E4E4";
const PATASI = "#B00E27";

export function RegistrationConfirmationEmail({
  name,
  registrationCode,
  broughtFood,
  foodDescription,
  donationCents,
  guestCount,
}: {
  name: string;
  registrationCode: string;
  broughtFood: boolean;
  foodDescription: string;
  donationCents: number | null;
  guestCount: number;
}) {
  const donated = typeof donationCents === "number" && donationCents > 0;

  return (
    <div
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        maxWidth: "560px",
        margin: "0 auto",
        padding: "32px 24px",
        backgroundColor: "#FFFFFF",
        color: INK,
        fontSize: "16px",
        lineHeight: "1.55",
      }}
    >
      {/* Small on purpose. The artwork is black linework on a white field, so
          a large version becomes a bright block in a dark-mode client, and a
          transparent version would disappear entirely — clients never invert
          images. Small keeps it from dominating either way.

          Centred with BOTH a text-align parent and margin auto: Outlook
          ignores margin auto on images, and some clients strip text-align
          inheritance, so neither alone is reliable across the field. */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element --
            next/image emits a srcset and an optimizer URL, neither of which a
            mail client can use. A plain img with an absolute src is the only
            thing that works in email. */}
        <img
          src={`${siteUrl()}/images/email-logo.png`}
          alt={`${ORG.name}, ${ORG.chapter}`}
          width="96"
          height="96"
          style={{
            display: "inline-block",
            width: "96px",
            height: "auto",
            border: 0,
            margin: "0 auto",
          }}
        />
      </div>

      <h1 style={{ margin: "0 0 4px 0", fontSize: "22px", fontWeight: "bold", color: INK }}>
        You&rsquo;re registered
      </h1>
      <p style={{ margin: "0 0 24px 0", color: MUTED, fontSize: "15px" }}>
        {EVENT.title} &middot; {ORG.name}
      </p>

      <p style={{ margin: "0 0 16px 0", color: INK }}>Hi {name},</p>
      <p style={{ margin: "0 0 24px 0", color: INK }}>
        Thank you for registering. We look forward to seeing you.
      </p>

      <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: FAINT }}>Registration code</p>
      <p
        style={{
          margin: "0 0 28px 0",
          fontSize: "24px",
          fontWeight: "bold",
          fontFamily: "'Courier New', Courier, monospace",
          color: PATASI,
          letterSpacing: "0.5px",
        }}
      >
        {registrationCode}
      </p>

      {/* A left rule rather than a bordered card: it still reads as set apart,
          and there is no panel background for a client to recolour. */}
      <div style={{ borderLeft: `3px solid ${PATASI}`, paddingLeft: "16px", margin: "0 0 24px 0" }}>
        <p style={{ margin: "0 0 6px 0", fontWeight: "bold", color: INK }}>When you arrive</p>
        <p style={{ margin: 0, color: INK }}>
          Please go to the <strong>registration desk</strong> to pick up
          {guestCount > 0 ? " your name tags" : " your name tag"}. Show this code or simply give
          your name.
        </p>
        {guestCount > 0 && (
          <p style={{ margin: "6px 0 0 0", color: MUTED, fontSize: "15px" }}>
            We have {guestCount + 1} name tags ready for your party.
          </p>
        )}
      </div>

      {broughtFood && (
        <p style={{ margin: "0 0 24px 0", color: INK }}>
          Thank you for bringing food
          {foodDescription ? (
            <>
              {" "}&mdash; <strong>{foodDescription}</strong>
            </>
          ) : null}
          . Please let the registration desk know when you arrive so we can set it out.
        </p>
      )}

      {donated && (
        <div style={{ margin: "0 0 24px 0" }}>
          {/* Sent when the registration is saved, which is before the card has
              been charged — only the Stripe webhook establishes payment.
              Thanking someone for money that has not moved is a claim we
              cannot support, and one a donor may read as a receipt. */}
          <p style={{ margin: "0 0 4px 0", fontWeight: "bold", color: INK }}>
            Your donation of ${(donationCents / 100).toFixed(2)} is recorded.
          </p>
          <p style={{ margin: 0, color: MUTED, fontSize: "15px" }}>
            Stripe sends a separate receipt once the payment completes; this email is not one.
            After the event&rsquo;s expenses are covered, all remaining proceeds are donated to the{" "}
            {EVENT.fundName}.
          </p>
        </div>
      )}

      <p style={{ margin: "0 0 24px 0", color: MUTED, fontSize: "15px" }}>
        Keep this email for your records.
      </p>

      <p
        style={{
          margin: 0,
          borderTop: `1px solid ${RULE}`,
          paddingTop: "16px",
          color: FAINT,
          fontSize: "13px",
        }}
      >
        Questions? Email {ORG.contactEmail}. If you did not register, please ignore this email.
      </p>
    </div>
  );
}
