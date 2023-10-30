import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"
import { stripe } from "@/lib/stripe"

// Define an asynchronous function 'POST' that handles incoming webhook requests
export async function POST(req: Request) {
  // Parse the request body as text
  const body = await req.text()
  // Get the Stripe signature from request headers
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    // Verify and construct the Stripe event from the received data and signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    // If there's an error during event construction, return an error response
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // Extract the Stripe Checkout Session from the event data
  const session = event.data.object as Stripe.Checkout.Session

  // Check if the event type is "checkout.session.completed"
  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Ensure that the user id is provided in the session metadata
    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    // Create a user subscription record in the database
    await prismadb.userSubscription.create({
      data: {
        userId: session?.metadata?.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  // Check if the event type is "invoice.payment_succeeded"
  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Update the user subscription record in the database
    await prismadb.userSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  // Return a success response with a status code of 200
  return new NextResponse(null, { status: 200 })
};
