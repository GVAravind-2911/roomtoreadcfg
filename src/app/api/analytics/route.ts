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
        // Genre popularity data
        const [genrePopularity] = await connection.execute(`
            SELECT 
                b.genre as book__genre,
                COUNT(c.checkout_id) as total_checkouts
            FROM books b
            LEFT JOIN checkouts c ON b.book_id = c.book_id
            GROUP BY b.genre
            ORDER BY total_checkouts DESC
        `);

        // Daily checkouts trend
        const [dailyCheckouts] = await connection.execute(`
            SELECT 
                DATE(checkout_date) as date,
                COUNT(*) as count
            FROM checkouts
            WHERE checkout_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DATE(checkout_date)
            ORDER BY date
        `);

        // Monthly trends by genre
        const [monthlyTrends] = await connection.execute(`
            SELECT 
                DATE_FORMAT(c.checkout_date, '%Y-%m') as month,
                b.genre as book__genre,
                COUNT(*) as count
            FROM checkouts c
            JOIN books b ON c.book_id = b.book_id
            WHERE c.checkout_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY month, b.genre
            ORDER BY month, b.genre
        `);

        // Genre checkouts data
        const [genreCheckouts] = await connection.execute(`
            SELECT 
                b.genre as book__genre,
                COUNT(*) as checkout_count
            FROM checkouts c
            JOIN books b ON c.book_id = b.book_id
            GROUP BY b.genre
        `);

        // Additional statistics
        const [stats] = await connection.execute(`
            SELECT
                (SELECT COUNT(*) FROM books) as total_books,
                (SELECT COUNT(DISTINCT user_id) FROM user_activities 
                 WHERE DATE(timestamp) = CURDATE()) as active_users,
                (SELECT COUNT(*) FROM checkouts 
                 WHERE DATE_FORMAT(checkout_date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')) 
                as monthly_checkouts
        `);

        return NextResponse.json({
            genre_popularity: genrePopularity,
            daily_checkouts: dailyCheckouts,
            monthly_trends: monthlyTrends,
            genre_checkouts: genreCheckouts,
            statistics: stats[0]
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics data' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}