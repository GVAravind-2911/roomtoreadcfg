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

// PUT - Update book copies
export async function PUT(
    request: Request,
    { params }: { params: { bookId: string } }
) {
    const connection = await pool.getConnection();
    
    try {
        const { increment } = await request.json();
        
        await connection.beginTransaction();

        // Update copies with validation
        const [result] = await connection.execute(
            `UPDATE books 
             SET total_copies = total_copies ${increment ? '+' : '-'} 1,
                 available_copies = available_copies ${increment ? '+' : '-'} 1
             WHERE book_id = ? 
             AND (${increment} = true OR available_copies > 0)`,
            [params.bookId]
        );

        if ((result as any).affectedRows === 0) {
            throw new Error('Cannot decrease copies: no available copies');
        }

        await connection.commit();

        return NextResponse.json({ 
            message: `Book copies ${increment ? 'increased' : 'decreased'} successfully` 
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error updating copies:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update copies' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}