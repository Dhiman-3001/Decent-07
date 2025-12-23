import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiter
// Note: In a serverless environment (like Vercel), this map is not shared across instances.
// For production, use Redis (e.g., Upstash) or a dedicated rate-limiting service.
const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const limit = 100; // Limit to 100 requests per minute
    const windowMs = 60 * 1000; // 1 minute

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, {
            count: 0,
            lastReset: Date.now(),
        });
    }

    const ipData = rateLimitMap.get(ip);

    if (Date.now() - ipData.lastReset > windowMs) {
        ipData.count = 0;
        ipData.lastReset = Date.now();
    }

    if (ipData.count >= limit) {
        return new NextResponse('Too Many Requests', { status: 429 });
    }

    ipData.count += 1;

    // Add custom header to track request count (for testing purposes)
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', (limit - ipData.count).toString());

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
