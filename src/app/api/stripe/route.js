import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { verifyPassword } from "@/lib/utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const { coachId } = body;
    const password = request.headers.get("x-dashboard-password");

    if (!coachId || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();

    const coachResult = await db.execute({
      sql: "SELECT id, name, dashboard_password_hash, stripe_customer_id FROM coaches WHERE id = ?",
      args: [coachId],
    });

    if (coachResult.rows.length === 0) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    const coach = coachResult.rows[0];
    const valid = await verifyPassword(password, coach.dashboard_password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create or reuse Stripe customer
    let customerId = coach.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { coachId: coach.id, coachName: coach.name },
      });
      customerId = customer.id;

      await db.execute({
        sql: "UPDATE coaches SET stripe_customer_id = ? WHERE id = ?",
        args: [customerId, coachId],
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard/${coachId}?upgraded=true`,
      cancel_url: `${appUrl}/dashboard/${coachId}`,
      metadata: { coachId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
