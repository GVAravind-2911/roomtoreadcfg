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
        const [results] = await connection.execute(`
            SELECT 
                b.genre AS book__genre,
                COUNT(c.book_id) AS checkout_count,
                SUM(CASE WHEN c.return_date IS NULL THEN 1 ELSE 0 END) AS active_checkouts,
                COUNT(DISTINCT c.user_id) AS unique_readers
            FROM books b
            LEFT JOIN checkouts c ON b.book_id = c.book_id
            GROUP BY b.genre
            ORDER BY checkout_count DESC
        `);

        return NextResponse.json({
            genre_checkouts: results
        });

    } catch (error) {
        console.error('Error fetching genre checkouts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch genre checkouts' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}