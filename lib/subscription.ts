// Import necessary modules
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// Define a constant representing a day in milliseconds
const DAY_IN_MS = 86_400_000;

// Function to check the user's subscription
export const checkSubscription = async () => {
  // Retrieve the current user's ID using the 'auth' module
  const { userId } = auth();

  // If there is no user ID, return false
  if (!userId) {
    return false;
  }

  // Query the database to find the user's subscription information
  const userSubscription = await prismadb.userSubscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  // If there is no userSubscription, return false
  if (!userSubscription) {
    return false;
  }

  // Calculate whether the user's subscription is valid by checking the price ID and current period end date
  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  // Return true if the subscription is valid, otherwise return false
  return !!isValid;
};
