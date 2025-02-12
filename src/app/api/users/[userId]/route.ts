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

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    const connection = await pool.getConnection();
    
    try {
        const [users] = await connection.execute(
            'SELECT user_id, name, user_type FROM users WHERE user_id = ?',
            [params.userId]
        );

        const user = users[0];

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}