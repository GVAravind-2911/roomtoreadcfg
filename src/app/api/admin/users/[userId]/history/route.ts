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

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    const userId = (await params)?.userId;
    if (!userId) {
        return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
        );
    }

    const connection = await pool.getConnection();
    
    try {
        // First verify if user exists
        const [userExists] = await connection.execute<mysql.RowDataPacket[]>(
            'SELECT 1 FROM users WHERE user_id = ?',
            [userId]
        );

        if (!userExists.length) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const [activities] = await connection.execute<mysql.RowDataPacket[]>(
            `SELECT 
                c.id as checkout_id,
                c.book_id,
                b.name as book_name,
                c.checkout_date,
                c.return_date,
                CASE 
                    WHEN c.return_date IS NULL AND DATEDIFF(NOW(), c.checkout_date) > 14 
                    THEN 1 
                    ELSE 0 
                END as is_overdue
            FROM checkouts c
            JOIN books b ON c.book_id = b.book_id
            WHERE c.user_id = ?
            ORDER BY c.checkout_date DESC`,
            [userId]
        );

        return NextResponse.json({ 
            activities: activities || [],
            userId: userId
        });

    } catch (error) {
        console.error('Error fetching user history:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user history' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}