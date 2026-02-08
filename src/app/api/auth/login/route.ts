import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json()

        // Simple credential check (in production, use proper hashing and database)
        const validUsername = process.env.ADMIN_USERNAME || 'admin'
        const validPassword = process.env.ADMIN_PASSWORD || 'dps2024admin'

        if (username === validUsername && password === validPassword) {
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
