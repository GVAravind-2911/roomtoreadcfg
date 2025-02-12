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
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const type = searchParams.get('type');

    if (!query || !type) {
        return NextResponse.json({ 
            results: [], 
            error: 'Search query and type are required' 
        });
    }

    const connection = await pool.getConnection();
    
    try {
        let sql = `
            SELECT 
                book_id,
                name,
                author,
                genre,
                available_copies,
                total_copies
            FROM books
            WHERE `;

        switch (type) {
            case 'title':
                sql += 'name LIKE ?';
                break;
            case 'genre':
                sql += 'genre LIKE ?';
                break;
            case 'id':
                sql += 'book_id = ?';
                break;
            default:
                throw new Error('Invalid search type');
        }

        const searchValue = type === 'id' ? query : `%${query}%`;
        const [results] = await connection.execute(sql, [searchValue]);

        return NextResponse.json({ results });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Failed to search books', results: [] },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}