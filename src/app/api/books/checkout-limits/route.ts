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

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const bookId = searchParams.get('bookId');

    if (!userId || !bookId) {
        return NextResponse.json(
            { error: 'User ID and Book ID are required' },
            { status: 400 }
        );
    }

    const connection = await pool.getConnection();

    try {
        // Check total active checkouts
        const [activeCheckouts] = await connection.execute(`
            SELECT COUNT(*) as count
            FROM checkouts
            WHERE user_id = ? AND return_date IS NULL
        `, [userId]);

        // Check if user already has this book
        const [existingCheckout] = await connection.execute(`
            SELECT COUNT(*) as count
            FROM checkouts
            WHERE user_id = ? 
            AND book_id = ? 
            AND return_date IS NULL
        `, [userId, bookId]);

        const currentCheckouts = (activeCheckouts as any)[0].count;
        const hasBook = (existingCheckout as any)[0].count > 0;

        return NextResponse.json({
            canCheckout: currentCheckouts < 5 && !hasBook,
            currentCheckouts,
            hasBook
        });

    } catch (error) {
        console.error('Error checking checkout limits:', error);
        return NextResponse.json(
            { error: 'Failed to check checkout limits' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}