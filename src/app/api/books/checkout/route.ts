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

        // Check if book is available
        const [books] = await connection.execute(
            'SELECT available_copies FROM books WHERE book_id = ? FOR UPDATE',
            [bookId]
        );

        const book = books[0] as { available_copies: number };
        if (!book || book.available_copies === 0) {
            throw new Error('Book is not available');
        }

        // Create checkout record
        await connection.execute(
            'INSERT INTO checkouts (user_id, book_id) VALUES (?, ?)',
            [userId, bookId]
        );

        // Update available copies
        await connection.execute(
            'UPDATE books SET available_copies = available_copies - 1 WHERE book_id = ?',
            [bookId]
        );

        await connection.commit();

        return NextResponse.json({ message: 'Book checked out successfully' });

    } catch (error) {
        await connection.rollback();
        console.error('Error checking out book:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to checkout book' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}