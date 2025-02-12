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
        
        // Fetch user statistics
        const [stats] = await connection.execute(`
            SELECT 
                COUNT(*) as total_checkouts,
                SUM(CASE WHEN return_date IS NULL THEN 1 ELSE 0 END) as current_checkouts,
                (
                    SELECT genre
                    FROM books b
                    JOIN checkouts c ON b.book_id = c.book_id
                    WHERE c.user_id = ?
                    GROUP BY genre
                    ORDER BY COUNT(*) DESC
                    LIMIT 1
                ) as favorite_genre,
                SUM(CASE WHEN DATEDIFF(return_date, checkout_date) <= 14 THEN 1 ELSE 0 END) as books_returned_ontime,
                DATEDIFF(NOW(), MIN(checkout_date)) as reading_streak
            FROM checkouts
            WHERE user_id = ?
        `, [userId, userId]);

        connection.release();
        return NextResponse.json(stats[0]);

    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user stats' },
            { status: 500 }
        );
    }
}