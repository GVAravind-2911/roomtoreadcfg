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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const connection = await pool.getConnection();
        
        const [rows] = await connection.execute(
            `SELECT 
                c.id as checkout_id,
                b.book_id,
                b.name as book_name,
                b.author,
                b.genre,
                c.checkout_date,
                c.return_date
            FROM checkouts c
            JOIN books b ON c.book_id = b.book_id
            WHERE c.user_id = ? AND c.return_date IS NULL
            ORDER BY c.checkout_date DESC`,
            [userId]
        );

        connection.release();
        return NextResponse.json(rows);

    } catch (error) {
        console.error('Error fetching user checkouts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user checkouts' },
            { status: 500 }
        );
    }
}