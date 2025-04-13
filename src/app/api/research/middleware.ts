import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";

// Simple in-memory rate limiting (would use Redis or similar in production)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function middleware(request: NextRequest) {
  // Get the client IP or API key for rate limiting
  const authHeader = request.headers.get("Authorization") || "";
  const apiKey = authHeader.replace("Bearer ", "");
  const clientId = apiKey || request.ip || "anonymous";
  
  // Check authentication
  if (!apiKey) {
    return NextResponse.json(
      { code: 401, message: "Authentication required" },
      { status: 401 }
    );
  }
  
  // In a real implementation, you would validate the API key against a database
  // For now, we'll just check if it's not empty
  if (apiKey.trim() === "") {
    return NextResponse.json(
      { code: 401, message: "Invalid API key" },
      { status: 401 }
    );
  }
  
  // Rate limiting
  const now = Date.now();
  const rateLimit = rateLimits.get(clientId) || { count: 0, resetAt: now + 60000 };
  
  // Reset counter if the time window has passed
  if (now > rateLimit.resetAt) {
    rateLimit.count = 0;
    rateLimit.resetAt = now + 60000;
  }
  
  // Increment counter
  rateLimit.count++;
  rateLimits.set(clientId, rateLimit);
  
  // Check if rate limit exceeded
  if (rateLimit.count > 10) {
    return NextResponse.json(
      { code: 429, message: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }
  
  // Add rate limit headers to the response
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", "10");
  response.headers.set("X-RateLimit-Remaining", `${10 - rateLimit.count}`);
  response.headers.set("X-RateLimit-Reset", `${Math.ceil((rateLimit.resetAt - now) / 1000)}`);
  
  return response;
}

export const config = {
  matcher: "/api/research/:path*",
};
