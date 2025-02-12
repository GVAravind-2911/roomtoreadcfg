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

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    const userId = await (params).userId;
    const connection = await pool.getConnection();

    try {
        const [results] = await connection.execute(`
            SELECT 
                MAX(CASE WHEN activity_type = 'login' THEN 
                    DATE_FORMAT(timestamp, '%b %d, %Y %h:%i %p') 
                END) as last_login,
                MAX(CASE WHEN activity_type = 'logout' THEN 
                    DATE_FORMAT(timestamp, '%b %d, %Y %h:%i %p')
                END) as last_logout
            FROM user_activities
            WHERE user_id = ?
            GROUP BY user_id
        `, [userId]);

        const lastActivity = Array.isArray(results) && results.length > 0
            ? results[0]
            : { last_login: null, last_logout: null };

        return NextResponse.json(lastActivity);

    } catch (error) {
        console.error('Error fetching last activity:', error);
        return NextResponse.json(
            { error: 'Failed to fetch last activity' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}