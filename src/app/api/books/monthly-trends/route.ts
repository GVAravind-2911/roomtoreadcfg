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
            WITH MonthData AS (
                SELECT 
                    DATE_FORMAT(checkout_date, '%Y-%m') as yearmonth,
                    DATE_FORMAT(checkout_date, '%b %Y') as month_display,
                    b.genre as book__genre,
                    COUNT(*) as count
                FROM checkouts c
                JOIN books b ON c.book_id = b.book_id
                WHERE c.checkout_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                GROUP BY 
                    DATE_FORMAT(checkout_date, '%Y-%m'),
                    DATE_FORMAT(checkout_date, '%b %Y'),
                    b.genre
            )
            SELECT 
                month_display as month,
                book__genre,
                count
            FROM MonthData
            ORDER BY 
                yearmonth ASC,
                book__genre ASC
        `);

        return NextResponse.json({
            monthly_trends: results
        });

    } catch (error) {
        console.error('Error fetching monthly trends:', error);
        return NextResponse.json(
            { error: 'Failed to fetch monthly trends' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}