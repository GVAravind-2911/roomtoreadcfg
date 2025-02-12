import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

export async function GET() {
    const connection = await pool.getConnection();
    
    try {
        const [books] = await connection.execute(`
            SELECT 
                b.book_id,
                b.name,
                b.author,
                b.genre,
                b.available_copies,
                b.total_copies,
                COUNT(c.book_id) as current_checkouts
            FROM books b
            LEFT JOIN checkouts c ON b.book_id = c.book_id 
                AND c.return_date IS NULL
            GROUP BY b.book_id
            ORDER BY b.name ASC
        `);

        return NextResponse.json({ books });
    } catch (error) {
        console.error('Error fetching books:', error);
        return NextResponse.json(
            { error: 'Failed to fetch books' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}