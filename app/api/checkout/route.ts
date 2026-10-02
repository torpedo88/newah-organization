import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-15.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donor_name, donor_email, donor_phone, amount, donation_type, anonymous } = body;

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    // Save donation to database first
    const supabase = await createClient();
    const { data: donation, error: dbError } = await supabase
      .from("donations")
      .insert([
        {
          donor_name: anonymous ? "Anonymous" : donor_name,
          donor_email,
          donor_phone: donor_phone || null,
          amount,
          donation_type,
          payment_status: "pending",
          anonymous,
        },
      ])
      .select()
      .single();

    if (dbError || !donation) {
      return NextResponse.json(
        { error: "Failed to create donation record" },
        { status: 500 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Donation to Newah Organization - ${donation_type}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/donate?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/donate?canceled=true`,
      customer_email: donor_email,
      metadata: {
        donation_id: donation.id.toString(),
        donor_name,
        donation_type,
      },
    });

    // Store Stripe session ID in database
    await supabase
      .from("donations")
      .update({ stripe_payment_intent_id: session.id })
      .eq("id", donation.id);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
