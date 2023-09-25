// Import necessary dependencies for rate limiting
import { Ratelimit } from "@upstash/ratelimit"; // Rate limiting library
import { Redis } from "@upstash/redis"; // Redis client for rate limiting

// Define an asynchronous function for rate limiting
export async function rateLimit(identifier: string) {
    // Create a new Ratelimit instance for rate limiting
    const rateLimit = new Ratelimit({
        redis: Redis.fromEnv(), // Initialize Redis client from environment variables
        limiter: Ratelimit.slidingWindow(10, "10 s"), // Define a sliding window rate limiter with a limit of 10 requests in 10 seconds
        analytics: true, // Enable analytics to track rate limiting statistics
        prefix: "@upstash/ratelimit" // Set a prefix for rate limit keys in Redis
    });

    // Limit the rate of requests for the provided identifier
    return await rateLimit.limit(identifier); // This will either allow the request to proceed or block it based on the rate limit.
};
