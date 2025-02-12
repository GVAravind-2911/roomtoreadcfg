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
        const bookId = body.bookId;

        console.log('Received bookId:', bookId);

        if (!bookId) {
            return NextResponse.json(
                { error: 'Invalid book ID' },
                { status: 400 }
            );
        }

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Check if book is available
            const [books] = await connection.execute<mysql.RowDataPacket[]>(
                'SELECT available_copies FROM books WHERE book_id = ?',
                [bookId]
            );

            const book = books[0];
            if (!book || book.available_copies < 1) {
                await connection.rollback();
                connection.release();
                return NextResponse.json(
                    { error: 'Book not available' },
                    { status: 400 }
                );
            }

            // Update available copies
            await connection.execute(
                'UPDATE books SET available_copies = available_copies - 1 WHERE book_id = ?',
                [bookId]
            );

            // Insert checkout record with explicit column list
            await connection.execute(
                `INSERT INTO checkouts 
                    (book_id, user_id, checkout_date) 
                VALUES 
                    (?, ?, CURRENT_TIMESTAMP)`,
                [bookId, "USER002"]
            );

            await connection.commit();
            connection.release();

            return NextResponse.json({ 
                message: 'Checkout successful',
                bookId: bookId
            });

        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Checkout Error:', error);
        return NextResponse.json(
            { error: 'Failed to checkout book' },
            { status: 500 }
        );
    }
}