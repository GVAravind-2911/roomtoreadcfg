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
        // Get genre popularity with checkout counts
        const [genres] = await connection.execute(`
            SELECT 
                b.genre as book__genre,
                COUNT(c.book_id) as total_checkouts,
                COUNT(DISTINCT c.book_id) as unique_books,
                COUNT(DISTINCT c.user_id) as unique_readers
            FROM books b
            LEFT JOIN checkouts c ON b.book_id = c.book_id
            WHERE c.return_date IS NULL OR c.return_date > DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY b.genre
            ORDER BY total_checkouts DESC
        `);

        // Get total books per genre
        const [genreStats] = await connection.execute(`
            SELECT
                genre as book__genre,
                SUM(total_copies) as total_books,
                SUM(available_copies) as available_copies
            FROM books
            GROUP BY genre
        `);

        // Combine the statistics
        const combinedStats = genreStats.map(genre => {
            const checkoutStats = genres.find(g => g.book__genre === genre.book__genre) || {
                total_checkouts: 0,
                unique_books: 0,
                unique_readers: 0
            };
            
            return {
                ...genre,
                ...checkoutStats,
                checkout_rate: ((genre.total_books - genre.available_copies) / genre.total_books * 100).toFixed(1)
            };
        });

        return NextResponse.json({
            genres: combinedStats
        });

    } catch (error) {
        console.error('Error fetching genre statistics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch genre statistics' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}