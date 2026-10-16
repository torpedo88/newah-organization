import { MHAPUJA_EVENT } from "@/lib/constants/mhapuja";
import { ORG } from "@/lib/legal/org";
import { siteUrl } from "@/lib/site";

/**
 * Mha Puja confirmation email.
 *
 * Styled plain for the same reason the Indra Jatra one is: Gmail's dark mode
 * rewrites light-on-dark colour choices in ways nothing can fully control.
 * One light background, explicit colours on every element, almost no chrome.
 *
 * One component renders two states by `paid`. The "pending" copy is sent on
 * initial registration (we have you, pay here). The "paid" copy is sent from
 * the webhook once Stripe confirms the money moved — that step is wired next.
 * Keeping both in one component means the two mails cannot drift in header,
 * footer or voice.
 */
const INK = "#1A1A1A";
const MUTED = "#5A5A5A";
const FAINT = "#8A8A8A";
const RULE = "#E4E4E4";
const PATASI = "#B00E27";

export function MhapujaConfirmationEmail({
  name,
  registrationCode,
  adultCount,
  childCount,
  chargedCents,
  paid,
}: {
  name: string;
  registrationCode: string;
  adultCount: number;
  childCount: number;
  chargedCents: number;
  paid: boolean;
}) {
  const total = (chargedCents / 100).toFixed(2);
  const ticketLine = ticketsLine(adultCount, childCount);

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
      <p style={{ margin: "0 0 24px", fontSize: "14px", color: FAINT, textAlign: "center" }}>
        {ORG.name} &mdash; {ORG.chapter}
      </p>

      <h1 style={{ margin: "0 0 12px", color: PATASI, fontSize: "24px" }}>
        {paid ? `You're in — ${MHAPUJA_EVENT.name}` : `Almost there — ${MHAPUJA_EVENT.name}`}
      </h1>

      <p style={{ margin: "0 0 20px" }}>Dear {name || "friend"},</p>

      <p style={{ margin: "0 0 20px" }}>
        {paid
          ? `Thank you — your Mha Puja tickets are confirmed. We look forward to welcoming you.`
          : `We have your registration. Your tickets are reserved pending payment at Stripe. ` +
            `If you closed the payment window before completing, open the registration link again ` +
            `with the code below to resume.`}
      </p>

      <div
        style={{
          margin: "24px 0",
          padding: "16px 20px",
          backgroundColor: "#FAFAFA",
          border: `1px solid ${RULE}`,
          borderRadius: "8px",
        }}
      >
        <p style={{ margin: "0 0 6px", fontSize: "13px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Registration code
        </p>
        <p style={{ margin: "0 0 16px", fontFamily: "monospace", fontSize: "20px", color: INK }}>
          {registrationCode}
        </p>

        <p style={{ margin: "0 0 6px", fontSize: "13px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Tickets
        </p>
        <p style={{ margin: "0 0 16px", color: INK }}>{ticketLine}</p>

        <p style={{ margin: "0 0 6px", fontSize: "13px", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {paid ? "Paid" : "Amount due"}
        </p>
        <p style={{ margin: 0, color: INK }}>${total}</p>
      </div>

      <p style={{ margin: "0 0 20px", color: MUTED, fontSize: "14px" }}>
        Questions, or need to make a change? Reply to this email or write to{" "}
        <a href={`mailto:${ORG.contactEmail}`} style={{ color: PATASI }}>
          {ORG.contactEmail}
        </a>
        .
      </p>

      <hr style={{ border: 0, borderTop: `1px solid ${RULE}`, margin: "24px 0" }} />

      <p style={{ margin: "0 0 4px", fontSize: "12px", color: FAINT }}>
        {ORG.name}, {ORG.chapter}
      </p>
      <p style={{ margin: 0, fontSize: "12px", color: FAINT }}>
        <a href={siteUrl()} style={{ color: FAINT }}>
          {siteUrl().replace(/^https?:\/\//, "")}
        </a>
      </p>
    </div>
  );
}

/** "2 adults and 1 child", "1 adult", "3 children" — whichever applies. */
function ticketsLine(adults: number, children: number): string {
  const parts: string[] = [];
  if (adults > 0) parts.push(`${adults} ${adults === 1 ? "adult" : "adults"}`);
  if (children > 0) parts.push(`${children} ${children === 1 ? "child" : "children"}`);
  return parts.join(" and ") || "0 tickets";
}
