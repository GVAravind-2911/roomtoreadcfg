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
    const connection = await pool.getConnection();
    
    try {
        const { bookId, userId } = await request.json();

        if (!bookId || !userId) {
            return NextResponse.json(
                { error: 'Book ID and User ID are required' },
                { status: 400 }
            );
        }

        await connection.beginTransaction();

        // Update checkout record
        const [result] = await connection.execute(
            `UPDATE checkouts 
             SET return_date = CURRENT_TIMESTAMP 
             WHERE book_id = ? AND user_id = ? AND return_date IS NULL`,
            [bookId, userId]
        );

        // Verify if checkout record was found and updated
        if ((result as any).affectedRows === 0) {
            throw new Error('No active checkout found for this book and user');
        }

        // Update available copies
        await connection.execute(
            'UPDATE books SET available_copies = available_copies + 1 WHERE book_id = ?',
            [bookId]
        );

        await connection.commit();

        return NextResponse.json({ message: 'Book checked in successfully' });

    } catch (error) {
        await connection.rollback();
        console.error('Error checking in book:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to check in book' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}