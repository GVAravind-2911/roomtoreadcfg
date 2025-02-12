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
        // Get daily checkouts with formatted date
        const [dailyCheckouts] = await connection.execute(`
            SELECT 
                DATE(checkout_date) as date,
                COUNT(*) as count
            FROM checkouts
            WHERE checkout_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY date
            ORDER BY date ASC
        `);

        // Get monthly totals with formatted month
        const [monthlyTotals] = await connection.execute(`
            SELECT 
                CONCAT(
                    CASE MONTH(checkout_date)
                        WHEN 1 THEN 'Jan'
                        WHEN 2 THEN 'Feb'
                        WHEN 3 THEN 'Mar'
                        WHEN 4 THEN 'Apr'
                        WHEN 5 THEN 'May'
                        WHEN 6 THEN 'Jun'
                        WHEN 7 THEN 'Jul'
                        WHEN 8 THEN 'Aug'
                        WHEN 9 THEN 'Sep'
                        WHEN 10 THEN 'Oct'
                        WHEN 11 THEN 'Nov'
                        WHEN 12 THEN 'Dec'
                    END,
                    ' ',
                    YEAR(checkout_date)
                ) as month,
                COUNT(*) as total
            FROM checkouts
            WHERE checkout_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY YEAR(checkout_date), MONTH(checkout_date), month
            ORDER BY YEAR(checkout_date) ASC, MONTH(checkout_date) ASC
        `);

        return NextResponse.json({
            daily_checkouts: dailyCheckouts,
            monthly_totals: monthlyTotals
        });

    } catch (error) {
        console.error('Error fetching checkout trends:', error);
        return NextResponse.json(
            { error: 'Failed to fetch checkout trends' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}