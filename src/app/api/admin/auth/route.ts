import { NextRequest, NextResponse } from 'next/server';

// POST - Verify admin credentials
export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ success: true, message: 'Authenticated' });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
