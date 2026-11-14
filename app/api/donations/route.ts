import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      donor_name,
      donor_email,
      donor_phone,
      amount,
      payment_method,
      donation_type,
      anonymous,
    } = body;

    if (!donor_name || !donor_email || !amount || !payment_method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const amount_cents = Math.round(amount * 100);

    const { data, error } = await supabase.from("donations").insert({
      donor_name,
      donor_email,
      donor_phone: donor_phone || null,
      amount_cents,
      payment_method,
      donation_type: donation_type || "general",
      anonymous: anonymous || false,
      status: payment_method === "card" ? "approved" : "pending",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Error saving donation:", err);
    return NextResponse.json(
      { error: "Failed to save donation" },
      { status: 500 },
    );
  }
}
