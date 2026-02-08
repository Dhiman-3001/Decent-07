import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Faculty JSON path
const getFacultyPath = () => path.join(process.cwd(), 'src', 'data', 'faculty.json');

interface FacultyMember {
    id: string;
    name: string;
    role: string;
    quote: string;
    cloudinary_url: string;
}

// GET - Fetch all faculty members
export async function GET() {
    try {
        const facultyPath = getFacultyPath();
        const content = await fs.readFile(facultyPath, 'utf-8');
        const data: FacultyMember[] = JSON.parse(content);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error reading faculty:', error);
        return NextResponse.json([], { status: 200 });
    }
}
