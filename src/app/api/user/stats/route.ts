import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

// Define interfaces for query results
interface CheckoutCount extends RowDataPacket {
    total: number;
}

interface CurrentCheckouts extends RowDataPacket {
    current: number;
}

interface GenreCount extends RowDataPacket {
    genre: string;
    count: number;
}

interface StreakData extends RowDataPacket {
    streak: number;
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
        );
    }

    const connection = await pool.getConnection();
    
    try {
        // Get total checkouts with proper typing
        const [totalCheckouts] = await connection.execute<CheckoutCount[]>(`
            SELECT COUNT(*) as total
            FROM checkouts
            WHERE user_id = ?
        `, [userId]);

        // Get current checkouts with proper typing
        const [currentCheckouts] = await connection.execute<CurrentCheckouts[]>(`
            SELECT COUNT(*) as current
            FROM checkouts
            WHERE user_id = ? AND return_date IS NULL
        `, [userId]);

        // Get favorite genre with proper typing
        const [favoriteGenre] = await connection.execute<GenreCount[]>(`
            SELECT b.genre, COUNT(*) as count
            FROM checkouts c
            JOIN books b ON c.book_id = b.book_id
            WHERE c.user_id = ?
            GROUP BY b.genre
            ORDER BY count DESC
            LIMIT 1
        `, [userId]);

        // Get reading streak with proper typing
        const [streak] = await connection.execute<StreakData[]>(`
            SELECT 
                DATEDIFF(
                    COALESCE(MAX(checkout_date), CURDATE()),
                    COALESCE(MIN(checkout_date), CURDATE())
                ) + 1 as streak
            FROM checkouts
            WHERE user_id = ?
            AND checkout_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        `, [userId]);

        const stats = {
            total_checkouts: totalCheckouts[0]?.total || 0,
            current_checkouts: currentCheckouts[0]?.current || 0,
            favorite_genre: favoriteGenre[0]?.genre || 'N/A',
            reading_streak: streak[0]?.streak || 0,
            books_returned_ontime: 0 // Add logic for this if needed
        };

        return NextResponse.json(stats);

    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user stats' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}