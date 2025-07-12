
import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
      const subscription = event.data.object as Stripe.Subscription

      await supabase
        .from("profiles")
        .update({
          subscription_status: subscription.status,
          subscription_id: subscription.id,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq("stripe_customer_id", subscription.customer as string)
      break

    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as Stripe.Subscription

      await supabase
        .from("profiles")
        .update({
          subscription_status: "canceled",
          subscription_id: null,
          current_period_end: null,
        })
        .eq("stripe_customer_id", deletedSubscription.customer as string)
      break

    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice

      if (invoice.subscription) {
        await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
          })
          .eq("stripe_customer_id", invoice.customer as string)
      }
      break

    case "invoice.payment_failed":
      const failedInvoice = event.data.object as Stripe.Invoice

      if (failedInvoice.subscription) {
        await supabase
          .from("profiles")
          .update({
            subscription_status: "past_due",
          })
          .eq("stripe_customer_id", failedInvoice.customer as string)
      }
      break
  }

  return NextResponse.json({ received: true })
}
