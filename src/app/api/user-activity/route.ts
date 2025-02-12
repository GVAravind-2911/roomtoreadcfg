import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function POST(request: Request) {
    const connection = await pool.getConnection();
    
    try {
        const { user_id, activity_type } = await request.json();

        if (!user_id || !activity_type) {
            return NextResponse.json(
                { error: 'User ID and activity type are required' },
                { status: 400 }
            );
        }

        await connection.execute(
            'INSERT INTO user_activities (user_id, activity_type) VALUES (?, ?)',
            [user_id, activity_type]
        );

        return NextResponse.json({ message: 'Activity logged successfully' });

    } catch (error) {
        console.error('Error logging activity:', error);
        return NextResponse.json(
            { error: 'Failed to log activity' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}