import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const ADMIN_CODE = 'ABC!@';

export async function POST(request: NextRequest) {
    try {
        const { user_id, name, password, user_type, admin_code } = await request.json();

        // Validate admin code if trying to create admin account
        if (user_type === 'admin' && admin_code !== ADMIN_CODE) {
            return NextResponse.json(
                { error: 'Invalid admin code' },
                { status: 400 }
            );
        }
        
        // Check if user_id already exists
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.userId, user_id));

        if (existingUser) {
            return NextResponse.json(
                { error: 'User ID already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        
        await db.insert(users).values({
            userId: user_id,
            name,
            password: hashedPassword,
            userType: user_type
        });

        return NextResponse.json({ 
            message: 'User created successfully',
            user_type 
        }, { 
            status: 201 
        });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}