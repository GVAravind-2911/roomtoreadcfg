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


export async function GET() {
    const connection = await pool.getConnection();
    
    try {
        const [books] = await connection.execute<mysql.RowDataPacket[]>(
            'SELECT * FROM books WHERE available_copies > 0'
        );

        return NextResponse.json({ results: books || [] });

    } catch (error) {
        console.error('Error fetching books:', error);
        return NextResponse.json(
            { error: 'Failed to fetch books' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}