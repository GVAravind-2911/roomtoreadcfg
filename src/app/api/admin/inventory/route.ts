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

// GET - Fetch paginated inventory
export async function GET(request: Request) {
    const connection = await pool.getConnection();
    
    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const pageSize = Math.max(1, Math.min(50, parseInt(searchParams.get('pageSize') || '25')));
        const search = searchParams.get('search') || '';
        const offset = (page - 1) * pageSize;

        // Get total count with search filter
        const [countResult] = await connection.execute<mysql.RowDataPacket[]>(
            `SELECT COUNT(*) as total 
             FROM books 
             WHERE name LIKE ? OR author LIKE ? OR genre LIKE ?`,
            Array(3).fill(`%${search}%`)
        );
        const total = parseInt(countResult[0].total.toString());

        // Get paginated results with search filter
        const [books] = await connection.execute<mysql.RowDataPacket[]>(
            `SELECT * 
             FROM books 
             WHERE name LIKE ? OR author LIKE ? OR genre LIKE ?
             ORDER BY book_id 
             LIMIT ? OFFSET ?`,
            [...Array(3).fill(`%${search}%`), pageSize.toString(), offset.toString()]
        );

        return NextResponse.json({
            results: books,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        });

    } catch (error) {
        console.error('Error fetching inventory:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inventory' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}

// POST - Add new book
export async function POST(request: Request) {
    const connection = await pool.getConnection();
    
    try {
        const book = await request.json();
        
        await connection.beginTransaction();

        await connection.execute(
            `INSERT INTO books (
                book_id, name, author, genre, 
                total_copies, available_copies
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                book.book_id,
                book.name,
                book.author,
                book.genre,
                book.total_copies,
                book.total_copies // Initially, all copies are available
            ]
        );

        await connection.commit();

        return NextResponse.json({
            message: 'Book added successfully',
            book: book
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error adding book:', error);
        return NextResponse.json(
            { error: 'Failed to add book' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}