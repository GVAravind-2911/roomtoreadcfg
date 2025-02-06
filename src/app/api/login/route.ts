import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { user_id, password } = await request.json();
        
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.userId, user_id));

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        return NextResponse.json({ 
            message: 'Login successful',
            user: { 
                user_id: user.userId, 
                name: user.name,
                user_type: user.userType 
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}