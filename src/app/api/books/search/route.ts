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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || '';
        const type = searchParams.get('type') || 'title'; // title, genre, or id

        const connection = await pool.getConnection();
        let sql = '';
        let params = [];

        switch (type) {
            case 'id':
                sql = 'SELECT * FROM books WHERE id = ? AND available_copies > 0';
                params = [query];
                break;
            case 'genre':
                sql = 'SELECT * FROM books WHERE genre LIKE ? AND available_copies > 0';
                params = [`%${query}%`];
                break;
            default: // title
                sql = 'SELECT * FROM books WHERE name LIKE ? AND available_copies > 0';
                params = [`%${query}%`];
                break;
        }

        const [rows] = await connection.execute(sql, params);
        connection.release();

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Search Error:', error);
        return NextResponse.json(
            { error: 'Failed to search books' },
            { status: 500 }
        );
    }
}