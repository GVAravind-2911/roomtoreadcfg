import { NextResponse } from 'next/server';
import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

interface DailyStats extends RowDataPacket {
    checkouts: number;
    checkins: number;
    activeUsers: number;
    newSignups: number;
    totalLogins: number;
}

interface OverallStats extends RowDataPacket {
    totalBooks: number;
    availableBooks: number;
    currentCheckouts: number;
    totalUsers: number;
    totalSignups: number;
}

interface GenreStats extends RowDataPacket {
    genre: string;
    count: number;
}

interface BookStats extends RowDataPacket {
    name: string;
    checkouts: number;
}

interface ActivityTrend extends RowDataPacket {
    date: string;
    activity_type: string;
    count: number;
}

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
        // Get daily statistics
        const [dailyStats] = await connection.execute<DailyStats[]>(`
            SELECT 
                (SELECT COUNT(*) FROM checkouts WHERE DATE(checkout_date) = CURDATE()) as checkouts,
                (SELECT COUNT(*) FROM checkouts WHERE DATE(return_date) = CURDATE()) as checkins,
                (SELECT COUNT(DISTINCT user_id) FROM user_activities 
                 WHERE DATE(timestamp) = CURDATE() AND activity_type = 'login') as activeUsers,
                (SELECT COUNT(*) FROM user_activities 
                 WHERE DATE(timestamp) = CURDATE() AND activity_type = 'signup') as newSignups,
                (SELECT COUNT(*) FROM user_activities 
                 WHERE DATE(timestamp) = CURDATE() AND activity_type = 'login') as totalLogins
        `);

        // Get overall statistics
        const [overallStats] = await connection.execute<OverallStats[]>(`
            SELECT
                (SELECT SUM(total_copies) FROM books) as totalBooks,
                (SELECT SUM(available_copies) FROM books) as availableBooks,
                (SELECT COUNT(*) FROM checkouts WHERE return_date IS NULL) as currentCheckouts,
                (SELECT COUNT(*) FROM users) as totalUsers,
                (SELECT COUNT(*) FROM user_activities WHERE activity_type = 'signup') as totalSignups
        `);

        // Get popular genres
        const [genres] = await connection.execute<GenreStats[]>(`
            SELECT b.genre, COUNT(*) as count
            FROM checkouts c
            JOIN books b ON c.book_id = b.book_id
            GROUP BY b.genre
            ORDER BY count DESC
            LIMIT 5
        `);

        // Get popular books
        const [books] = await connection.execute<BookStats[]>(`
            SELECT b.name, COUNT(*) as checkouts
            FROM checkouts c
            JOIN books b ON c.book_id = b.book_id
            GROUP BY b.book_id, b.name
            ORDER BY checkouts DESC
            LIMIT 5
        `);

        // Get user activity trend
        const [activityTrend] = await connection.execute<ActivityTrend[]>(`
            SELECT 
                DATE(timestamp) as date,
                activity_type,
                COUNT(*) as count
            FROM user_activities
            WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(timestamp), activity_type
            ORDER BY date DESC, activity_type
        `);

        return NextResponse.json({
            daily: dailyStats[0],
            overall: overallStats[0],
            popular: {
                genres,
                books
            },
            activityTrend
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}