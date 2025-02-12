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

export async function GET() {
    const connection = await pool.getConnection();
    
    try {
        const [users] = await connection.execute<mysql.RowDataPacket[]>(
            `SELECT DISTINCT 
                u.user_id,
                u.name
             FROM users u
             ORDER BY u.name`
        );

        return NextResponse.json({ users: users || [] });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}