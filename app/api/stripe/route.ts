// Import necessary modules and libraries
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

// Define the URL for user settings
const settingsUrl = absoluteUrl("/settings");

// Handle the GET request
export async function GET() {
  try {
    // Retrieve the current user's ID and user information
    const { userId } = auth();
    const user = await currentUser();

    // Check for unauthorized access
    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Query the database to find the user's subscription
    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId
      }
    });

    // If the user has a subscription with a Stripe customer ID
    if (userSubscription && userSubscription.stripeCustomerId) {
      // Create a billing portal session for the user
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      // Return the billing portal URL
      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    // If the user does not have an active subscription
    // Create a new Stripe checkout session for subscription purchase
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "CDN",
            product_data: {
              name: "Companion Pro",
              description: "Create Custom AI Companions"
            },
            unit_amount: 999, // Price in cents
            recurring: {
              interval: "month"
            }
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    // Return the URL of the new Stripe checkout session
    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    // Handle any potential errors and log them
    console.log("[STRIPE]", error);
    
    // Return an internal server error response
    return new NextResponse("Internal Error", { status: 500 });
  }
};
