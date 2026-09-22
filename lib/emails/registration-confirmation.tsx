import { EVENT } from "@/lib/constants/event";
import { ORG } from "@/lib/legal/org";

/**
 * Confirmation email.
 *
 * Email clients cannot read CSS variables, so the haku patasi palette is
 * written out literally here and must be kept in step with the @theme block in
 * app/globals.css.
 */
const HAKU = "#0E0E11";
const HAKU_WARM = "#1A1015";
const PATASI = "#C0102B";
const LUN = "#C9A227";

export function RegistrationConfirmationEmail({
  name,
  registrationCode,
  broughtFood,
  foodDescription,
  donationCents,
}: {
  name: string;
  registrationCode: string;
  broughtFood: boolean;
  foodDescription: string;
  donationCents: number | null;
}) {
  const donated = typeof donationCents === "number" && donationCents > 0;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px" }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${HAKU} 0%, ${HAKU_WARM} 100%)`,
          padding: "40px",
          textAlign: "center",
          color: "white",
          borderRadius: "12px",
        }}
      >
        <h1 style={{ margin: "0 0 10px 0" }}>You&rsquo;re registered</h1>
        <p style={{ margin: 0, opacity: 0.85 }}>
          {EVENT.title} &middot; {ORG.name}
        </p>
      </div>

      <div style={{ padding: "40px", background: "white", borderRadius: "12px", marginTop: "20px" }}>
        <p>Hi {name},</p>
        <p>Thank you for registering. We look forward to seeing you.</p>

        <div
          style={{
            background: "#F5F5F5",
            padding: "20px",
            borderRadius: "8px",
            margin: "20px 0",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "12px", color: "#666", margin: "0 0 10px 0", textTransform: "uppercase" }}>
            Registration Code
          </p>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0, fontFamily: "monospace", color: PATASI }}>
            {registrationCode}
          </p>
        </div>

        {/* The one thing everyone has to do on arrival. */}
        <div
          style={{
            border: `2px solid ${PATASI}`,
            borderRadius: "8px",
            padding: "20px",
            margin: "24px 0",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: "bold", color: PATASI }}>
            When you arrive
          </p>
          <p style={{ margin: 0, color: "#333" }}>
            Please go to the <strong>registration desk</strong> to pick up your name tag.
            Show this code or simply give your name.
          </p>
        </div>

        {broughtFood && (
          <p style={{ color: "#333" }}>
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
          <div
            style={{
              background: "#FFF8E8",
              borderLeft: `4px solid ${LUN}`,
              padding: "16px 20px",
              margin: "24px 0",
            }}
          >
            <p style={{ margin: "0 0 6px 0", fontWeight: "bold", color: "#333" }}>
              Thank you for your donation of ${(donationCents / 100).toFixed(2)}.
            </p>
            <p style={{ margin: 0, color: "#555", fontSize: "14px" }}>
              100% of it goes to the {EVENT.fundName}. You covered the card processing fee
              separately, which is what makes that possible.
            </p>
          </div>
        )}

        <p style={{ marginTop: "30px", color: "#666" }}>
          Keep this email for your records.
        </p>

        <p
          style={{
            marginTop: "30px",
            borderTop: "1px solid #E0E0E0",
            paddingTop: "20px",
            color: "#999",
            fontSize: "12px",
          }}
        >
          Questions? Email {ORG.contactEmail}. If you did not register, please ignore this email.
        </p>
      </div>
    </div>
  );
}
