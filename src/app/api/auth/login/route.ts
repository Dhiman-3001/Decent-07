import { NextResponse } from 'next/server'

// Login attempt tracker for brute force protection
const loginAttempts = new Map<string, { count: number; lockoutUntil: number }>()

const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000 // 5 minutes

// Cleanup expired entries periodically
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now()
        for (const [key, value] of loginAttempts.entries()) {
            if (now > value.lockoutUntil + ATTEMPT_WINDOW_MS) {
                loginAttempts.delete(key)
            }
        }
    }, 60000)
}

function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    return forwarded?.split(',')[0]?.trim() || realIp || 'unknown'
}

export async function POST(request: Request) {
    const ip = getClientIp(request)

    try {
        // Check if IP is currently locked out
        const attempts = loginAttempts.get(ip)
        if (attempts && Date.now() < attempts.lockoutUntil) {
            const remainingMs = attempts.lockoutUntil - Date.now()
            const remainingMin = Math.ceil(remainingMs / 60000)
            return NextResponse.json(
                { error: `Too many login attempts. Try again in ${remainingMin} minute(s).` },
                { status: 429 }
            )
        }

        const body = await request.json()
        const { username, password } = body

        // Validate input types
        if (typeof username !== 'string' || typeof password !== 'string') {
            return NextResponse.json(
                { error: 'Invalid credentials format' },
                { status: 400 }
            )
        }

        // Enforce max input lengths to prevent abuse
        if (username.length > 128 || password.length > 128) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 400 }
            )
        }

        // Require environment variables — no hardcoded fallbacks
        const validUsername = process.env.ADMIN_USERNAME
        const validPassword = process.env.ADMIN_PASSWORD

        if (!validUsername || !validPassword) {
            console.error('ADMIN_USERNAME or ADMIN_PASSWORD environment variables are not set!')
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            )
        }

        // Constant-time comparison to prevent timing attacks
        const usernameMatch = username.length === validUsername.length &&
            timingSafeEqual(username, validUsername)
        const passwordMatch = password.length === validPassword.length &&
            timingSafeEqual(password, validPassword)

        if (usernameMatch && passwordMatch) {
            // Reset failed attempts on successful login
            loginAttempts.delete(ip)

            const response = NextResponse.json({ success: true })

            // Set admin session cookie
            response.cookies.set('dps_admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/'
            })

            return response
        }

        // Track failed attempt
        const currentAttempts = loginAttempts.get(ip)
        const newCount = (currentAttempts?.count || 0) + 1

        if (newCount >= MAX_ATTEMPTS) {
            loginAttempts.set(ip, {
                count: newCount,
                lockoutUntil: Date.now() + LOCKOUT_DURATION_MS
            })
            console.warn(`Login lockout triggered for IP: ${ip}`)
            return NextResponse.json(
                { error: `Too many failed attempts. Account locked for 15 minutes.` },
                { status: 429 }
            )
        }

        loginAttempts.set(ip, {
            count: newCount,
            lockoutUntil: 0
        })

        // Generic error message (don't reveal which field is wrong)
        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        )
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// Simple constant-time string comparison
function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false
    let result = 0
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return result === 0
}
