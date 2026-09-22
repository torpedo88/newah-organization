export function RegistrationConfirmationEmail({
  name,
  registrationCode,
  registrationType,
}: {
  name: string;
  registrationCode: string;
  registrationType: string;
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px" }}>
      <div style={{ background: "linear-gradient(135deg, #0A0E27 0%, #1A1E3F 100%)", padding: "40px", textAlign: "center", color: "white", borderRadius: "12px" }}>
        <h1 style={{ margin: "0 0 10px 0" }}>Registration Successful</h1>
        <p style={{ margin: "0", opacity: 0.8 }}>Newah Organization</p>
      </div>

      <div style={{ padding: "40px", background: "white", borderRadius: "12px", marginTop: "20px" }}>
        <p>Hi {name},</p>
        <p>Thank you for registering with Newah Organization!</p>

        <div style={{ background: "#F5F5F5", padding: "20px", borderRadius: "8px", margin: "20px 0", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "#666", margin: "0 0 10px 0", textTransform: "uppercase" }}>Registration Code</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0", fontFamily: "monospace", color: "#FF7A45" }}>{registrationCode}</p>
        </div>

        <p>
          <strong>Registration Type:</strong> {registrationType === "FOOD" ? "Food Registration" : "Donation"}
        </p>

        <p style={{ marginTop: "30px", color: "#666" }}>
          Keep this email for your records. Your registration code will be needed at the event.
        </p>

        <p style={{ marginTop: "30px", borderTop: "1px solid #E0E0E0", paddingTop: "20px", color: "#999", fontSize: "12px" }}>
          If you did not register, please ignore this email.
        </p>
      </div>
    </div>
  );
}
