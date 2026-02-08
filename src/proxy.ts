import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limit store for middleware (in-memory, per-instance)
const globalRateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Clean up expired entries every minute
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now()
        for (const [key, value] of globalRateLimitStore.entries()) {
            if (now > value.resetTime) {
                globalRateLimitStore.delete(key)
            }
        }
    }, 60000)
}

export function proxy(request: NextRequest) {
    const response = NextResponse.next()
    const url = request.nextUrl

    // ==================== SECURITY HEADERS ====================

    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY')

    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff')

    // XSS Protection
    response.headers.set('X-XSS-Protection', '1; mode=block')

    // Referrer policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Permissions policy
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    // Content Security Policy (adjusted for Next.js)
    const cspHeader = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for Next.js
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: blob: https:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "form-action 'self'",
        "base-uri 'self'",
        "upgrade-insecure-requests"
    ].join('; ')

    response.headers.set('Content-Security-Policy', cspHeader)

    // Strict Transport Security (for production)
    if (process.env.NODE_ENV === 'production') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }

    // ==================== ADMIN PAGE PROTECTION ====================

    // Protect admin routes - redirect to login if not authenticated
    if (url.pathname.startsWith('/admin')) {
        const session = request.cookies.get('dps_admin_session')?.value

        if (session !== 'authenticated') {
            // Redirect to login page
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // ==================== BLOCKED PATTERNS ====================

    // Block common attack patterns in URL
    const blockedPatterns = [
        /\.\.\//,           // Path traversal
        /\0/,               // Null byte
        /<script/i,         // Script injection in URL
        /javascript:/i,     // JavaScript protocol
        /vbscript:/i,       // VBScript protocol
        /data:/i,           // Data protocol in URL
        /onload=/i,         // Event handlers
        /onerror=/i,
        /onclick=/i,
        /onmouseover=/i,
        /%00/,              // URL-encoded null byte
        /%3Cscript/i,       // URL-encoded script
        /union.*select/i,   // SQL injection patterns
        /insert.*into/i,
        /delete.*from/i,
        /drop.*table/i,
        /update.*set/i,
        /exec\(/i,
        /execute/i
    ]

    const fullUrl = url.pathname + url.search
    for (const pattern of blockedPatterns) {
        if (pattern.test(fullUrl)) {
            console.warn(`Blocked suspicious request: ${fullUrl}`)
            return new NextResponse('Forbidden', { status: 403 })
        }
    }

    // ==================== ADDITIONAL API PROTECTIONS ====================

    // Block API access from suspicious referers
    if (url.pathname.startsWith('/api/admin/')) {
        const referer = request.headers.get('referer')
        const host = request.headers.get('host')

        // Allow requests without referer (direct API calls are handled by route-level auth)
        // But block requests from external referers
        if (referer) {
            try {
                const refererUrl = new URL(referer)
                const refererHost = refererUrl.host.replace(/:\d+$/, '')
                const expectedHost = host?.replace(/:\d+$/, '') || ''

                if (refererHost !== expectedHost &&
                    refererHost !== 'localhost' &&
                    refererHost !== '127.0.0.1') {
                    console.warn(`Blocked external API request from: ${referer}`)
                    return new NextResponse('Forbidden', { status: 403 })
                }
            } catch {
                // Invalid referer URL, block it
                return new NextResponse('Forbidden', { status: 403 })
            }
        }
    }

    // ==================== GLOBAL RATE LIMITING ====================

    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown'

    const now = Date.now()
    const windowMs = 60000 // 1 minute
    const maxRequests = 300 // 300 requests per minute globally

    let entry = globalRateLimitStore.get(ip)

    if (!entry || now > entry.resetTime) {
        globalRateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    } else if (entry.count >= maxRequests) {
        return new NextResponse(
            JSON.stringify({ error: 'Too many requests' }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': '60'
                }
            }
        )
    } else {
        entry.count++
    }

    return response
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (images, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
    ],
}
