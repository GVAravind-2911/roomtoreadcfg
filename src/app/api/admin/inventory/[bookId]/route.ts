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

// PUT - Update book details
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ bookId: string }> }
) {
    const connection = await pool.getConnection();
    
    try {
        const book = await request.json();
        
        await connection.beginTransaction();

        await connection.execute(
            `UPDATE books 
             SET name = ?, 
                 author = ?, 
                 genre = ?, 
                 total_copies = ?
             WHERE book_id = ?`,
            [book.name, book.author, book.genre, book.total_copies, (await params).bookId]
        );

        await connection.commit();

        return NextResponse.json({ 
            message: 'Book updated successfully',
            book: book
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error updating book:', error);
        return NextResponse.json(
            { error: 'Failed to update book' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}

// DELETE - Remove a book
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ bookId: string }> }
) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // Check if book has any active checkouts
        const [checkouts] = await connection.execute<mysql.RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM checkouts WHERE book_id = ? AND return_date IS NULL',
            [(await params).bookId]
        );

        if ((checkouts[0] as { count: number }).count > 0) {
            throw new Error('Cannot delete book with active checkouts');
        }

        await connection.execute(
            'DELETE FROM books WHERE book_id = ?',
            [(await params).bookId]
        );

        await connection.commit();

        return NextResponse.json({ message: 'Book deleted successfully' });

    } catch (error) {
        await connection.rollback();
        console.error('Error deleting book:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to delete book' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}