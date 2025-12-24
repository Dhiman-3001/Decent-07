import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const username = body.username?.trim()
        const password = body.password?.trim()

        const validUsername = process.env.ADMIN_USERNAME?.trim()
        const validPassword = process.env.ADMIN_PASSWORD?.trim()

        console.log("Login Attempt:", {
            receivedUser: username,
            expectedUser: validUsername,
            matchUser: username === validUsername,
            matchPass: password === validPassword
        })

        if (!validUsername || !validPassword) {
            console.error("Admin credentials not set in .env")
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            )
        }

        if (username === validUsername && password === validPassword) {
            const cookieStore = await cookies()

            // Setting cookie with less restriction for debugging
            cookieStore.set('dps_admin_session', 'authenticated', {
                httpOnly: true,
                secure: false, // Force false for localhost debugging
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            })

            console.log("Cookie set successfully")
            return NextResponse.json({ success: true })
        } else {
            console.log("Invalid credentials")
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }
    } catch (error) {
        console.error("Login Server Error:", error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
