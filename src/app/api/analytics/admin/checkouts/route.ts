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
    try {
        const connection = await pool.getConnection();
        
        const [rows] = await connection.execute(`
            SELECT 
                c.id as checkout_id,
                c.book_id,
                c.user_id,
                b.name as book_name,
                b.author,
                b.genre,
                c.checkout_date,
                c.return_date
            FROM checkouts c
            JOIN books b ON c.book_id = b.book_id
            ORDER BY c.checkout_date DESC
        `);

        connection.release();
        return NextResponse.json(rows);

    } catch (error) {
        console.error('Error fetching checkouts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch checkouts' },
            { status: 500 }
        );
    }
}