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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { bookId, userId } = body;

        if (!bookId || !userId) {
            return NextResponse.json(
                { error: 'Invalid book ID or user ID' },
                { status: 400 }
            );
        }

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Update checkout record with return date
            await connection.execute(
                `UPDATE checkouts 
                SET return_date = CURRENT_TIMESTAMP 
                WHERE book_id = ? AND user_id = ? AND return_date IS NULL`,
                [bookId, userId]
            );

            // Update book available copies
            await connection.execute(
                'UPDATE books SET available_copies = available_copies + 1 WHERE book_id = ?',
                [bookId]
            );

            await connection.commit();
            connection.release();

            return NextResponse.json({ 
                message: 'Check-in successful',
                bookId: bookId
            });

        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Check-in Error:', error);
        return NextResponse.json(
            { error: 'Failed to check in book' },
            { status: 500 }
        );
    }
}