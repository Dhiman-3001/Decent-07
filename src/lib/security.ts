import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import path from 'path'

// ==================== RATE LIMITING ====================

interface RateLimitEntry {
    count: number
    resetTime: number
}

// In-memory rate limit store (in production, use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime) {
            rateLimitStore.delete(key)
        }
    }
}, 60000) // Clean every minute

export interface RateLimitConfig {
    windowMs: number      // Time window in milliseconds
    maxRequests: number   // Max requests per window
    identifier?: string   // Custom identifier prefix
}

const defaultRateLimitConfig: RateLimitConfig = {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 30,       // 30 requests per minute
}

/**
 * Rate limit a request based on IP address
 */
export function rateLimit(
    request: NextRequest,
    config: Partial<RateLimitConfig> = {}
): { success: boolean; remaining: number; resetIn: number } {
    const { windowMs, maxRequests, identifier } = { ...defaultRateLimitConfig, ...config }

    // Get client IP (various headers for different proxies)
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown'

    const key = identifier ? `${identifier}:${ip}` : ip
    const now = Date.now()

    let entry = rateLimitStore.get(key)

    if (!entry || now > entry.resetTime) {
        // Create new entry
        entry = {
            count: 1,
            resetTime: now + windowMs
        }
        rateLimitStore.set(key, entry)
        return { success: true, remaining: maxRequests - 1, resetIn: windowMs }
    }

    if (entry.count >= maxRequests) {
        return { success: false, remaining: 0, resetIn: entry.resetTime - now }
    }

    entry.count++
    return { success: true, remaining: maxRequests - entry.count, resetIn: entry.resetTime - now }
}

/**
 * Create rate limit exceeded response
 */
export function rateLimitExceededResponse(resetIn: number): NextResponse {
    return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
            status: 429,
            headers: {
                'Retry-After': Math.ceil(resetIn / 1000).toString(),
                'X-RateLimit-Remaining': '0'
            }
        }
    )
}

// ==================== AUTHENTICATION ====================

/**
 * Check if the request is from an authenticated admin
 */
export function isAdminRequest(request: NextRequest): boolean {
    const session = request.cookies.get('dps_admin_session')?.value
    return session === 'authenticated'
}

/**
 * Check admin status using cookies() for server components
 */
export async function isAdminAsync(): Promise<boolean> {
    const cookieStore = await cookies()
    const session = cookieStore.get('dps_admin_session')?.value
    return session === 'authenticated'
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse(): NextResponse {
    return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
    )
}

// ==================== INPUT VALIDATION ====================

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: unknown): string {
    if (typeof input !== 'string') return ''

    return input
        .trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .replace(/`/g, '&#x60;')
        .slice(0, 10000) // Max length limit
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const sanitized: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value)
        } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item =>
                typeof item === 'object' && item !== null
                    ? sanitizeObject(item as Record<string, unknown>)
                    : typeof item === 'string' ? sanitizeString(item) : item
            )
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value as Record<string, unknown>)
        } else {
            sanitized[key] = value
        }
    }

    return sanitized as T
}

/**
 * Validate that required fields are present
 */
export function validateRequiredFields(
    data: Record<string, unknown>,
    requiredFields: string[]
): { valid: boolean; missing: string[] } {
    const missing = requiredFields.filter(field => {
        const value = data[field]
        return value === undefined || value === null || value === ''
    })

    return { valid: missing.length === 0, missing }
}

/**
 * Validate file upload
 */
export function validateFileUpload(
    file: File,
    options: {
        maxSizeBytes?: number
        allowedTypes?: string[]
    } = {}
): { valid: boolean; error?: string } {
    const {
        maxSizeBytes = 5 * 1024 * 1024, // 5MB default
        allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    } = options

    if (!file) {
        return { valid: false, error: 'No file provided' }
    }

    if (file.size > maxSizeBytes) {
        return { valid: false, error: `File too large. Max size: ${maxSizeBytes / 1024 / 1024}MB` }
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` }
    }

    // Check file extension matches content type
    const ext = file.name.split('.').pop()?.toLowerCase()
    const validExtensions: Record<string, string[]> = {
        'image/jpeg': ['jpg', 'jpeg'],
        'image/png': ['png'],
        'image/webp': ['webp'],
        'image/gif': ['gif'],
        'video/mp4': ['mp4'],
        'video/webm': ['webm']
    }

    if (ext && validExtensions[file.type] && !validExtensions[file.type].includes(ext)) {
        return { valid: false, error: 'File extension does not match content type' }
    }

    return { valid: true }
}

// ==================== SECURITY HEADERS ====================

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY')

    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff')

    // XSS Protection (legacy but still useful)
    response.headers.set('X-XSS-Protection', '1; mode=block')

    // Referrer policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Permissions policy
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    return response
}

// ==================== ERROR HANDLING ====================

/**
 * Safe error response that doesn't leak sensitive information
 */
export function safeErrorResponse(
    error: unknown,
    fallbackMessage = 'An error occurred'
): NextResponse {
    // Log the actual error server-side
    console.error('API Error:', error)

    // Return generic message to client
    return NextResponse.json(
        { error: fallbackMessage },
        { status: 500 }
    )
}

/**
 * Validation error response
 */
export function validationErrorResponse(message: string): NextResponse {
    return NextResponse.json(
        { error: message },
        { status: 400 }
    )
}

// ==================== CSRF PROTECTION ====================

/**
 * Validate origin header for CSRF protection
 */
export function validateOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')

    // Allow requests without origin (same-origin requests)
    if (!origin) return true

    // Parse origins
    try {
        const originUrl = new URL(origin)
        const expectedHost = host?.replace(/:\d+$/, '') // Remove port
        const actualHost = originUrl.host.replace(/:\d+$/, '')

        return actualHost === expectedHost ||
            actualHost === 'localhost' ||
            actualHost === '127.0.0.1'
    } catch {
        return false
    }
}

// ==================== PATH TRAVERSAL PROTECTION ====================

/**
 * Sanitize file path to prevent path traversal attacks
 */
export function sanitizePath(inputPath: string): string {
    return inputPath
        .replace(/\.\./g, '')  // Remove ..
        .replace(/\/\//g, '/') // Remove double slashes
        .replace(/\\/g, '/')   // Normalize backslashes
        .replace(/^\//, '')    // Remove leading slash
}

/**
 * Validate that a path is within allowed directory
 */
export function isPathSafe(filePath: string, allowedDir: string): boolean {

    const resolvedPath = path.resolve(allowedDir, filePath)
    return resolvedPath.startsWith(path.resolve(allowedDir))
}

// ==================== ID VALIDATION ====================

/**
 * Validate ID format (alphanumeric with hyphens and underscores)
 */
export function isValidId(id: unknown): boolean {
    if (typeof id !== 'string') return false
    return /^[a-zA-Z0-9_-]{1,100}$/.test(id)
}

/**
 * Validate numeric ID
 */
export function isValidNumericId(id: unknown): boolean {
    if (typeof id === 'number') return Number.isInteger(id) && id > 0
    if (typeof id === 'string') return /^\d{1,20}$/.test(id)
    return false
}

// ==================== COMBINED SECURITY MIDDLEWARE ====================

export interface SecurityCheckResult {
    passed: boolean
    response?: NextResponse
}

/**
 * Run all security checks for admin endpoints
 */
export function adminSecurityCheck(
    request: NextRequest,
    rateLimitConfig?: Partial<RateLimitConfig>
): SecurityCheckResult {
    // 1. Rate limiting
    const rateCheck = rateLimit(request, rateLimitConfig)
    if (!rateCheck.success) {
        return { passed: false, response: rateLimitExceededResponse(rateCheck.resetIn) }
    }

    // 2. CSRF protection for mutating requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
        if (!validateOrigin(request)) {
            return {
                passed: false,
                response: NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
            }
        }
    }

    // 3. Admin authentication
    if (!isAdminRequest(request)) {
        return { passed: false, response: unauthorizedResponse() }
    }

    return { passed: true }
}

/**
 * Run security checks for public endpoints
 */
export function publicSecurityCheck(
    request: NextRequest,
    rateLimitConfig?: Partial<RateLimitConfig>
): SecurityCheckResult {
    // 1. Rate limiting (stricter for public endpoints to prevent abuse)
    const rateCheck = rateLimit(request, {
        maxRequests: 60,
        windowMs: 60000,
        ...rateLimitConfig
    })
    if (!rateCheck.success) {
        return { passed: false, response: rateLimitExceededResponse(rateCheck.resetIn) }
    }

    return { passed: true }
}

/**
 * Run security checks for auth endpoints (even stricter rate limiting)
 */
export function authSecurityCheck(
    request: NextRequest
): SecurityCheckResult {
    // Very strict rate limiting for auth endpoints to prevent brute force
    const rateCheck = rateLimit(request, {
        maxRequests: 5,  // Only 5 attempts
        windowMs: 60000, // Per minute
        identifier: 'auth'
    })
    if (!rateCheck.success) {
        return { passed: false, response: rateLimitExceededResponse(rateCheck.resetIn) }
    }

    // CSRF protection
    if (!validateOrigin(request)) {
        return {
            passed: false,
            response: NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
        }
    }

    return { passed: true }
}
