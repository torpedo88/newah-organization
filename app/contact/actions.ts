"use server";

import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const supabase = await createClient();

  try {
    // Save to database
    const { error: dbError } = await supabase.from("contacts").insert([{
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      status: "new",
    }]);

    if (dbError) return { error: "Failed to save submission." };

    // Send email notification
    await resend.emails.send({
      from: "contact@newah-org.local",
      to: process.env.CONTACT_EMAIL || "contact@example.com",
      subject: `Contact Form: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to send message. Please try again." };
  }
}
