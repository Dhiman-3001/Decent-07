import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
    const cookieStore = await cookies()
    const hasSession = cookieStore.has('dps_admin_session')
    return NextResponse.json({ isAdmin: hasSession })
}
