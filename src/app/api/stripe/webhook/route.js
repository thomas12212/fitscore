import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = getDb();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const coachId = session.metadata?.coachId;
      if (coachId) {
        await db.execute({
          sql: "UPDATE coaches SET plan = 'pro' WHERE id = ?",
          args: [coachId],
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      const result = await db.execute({
        sql: "SELECT id FROM coaches WHERE stripe_customer_id = ?",
        args: [customerId],
      });

      if (result.rows.length > 0) {
        await db.execute({
          sql: "UPDATE coaches SET plan = 'free' WHERE stripe_customer_id = ?",
          args: [customerId],
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
