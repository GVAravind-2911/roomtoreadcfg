import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Create connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    const [rows] = await connection.execute(`
      SELECT 
        b.genre,
        COUNT(c.id) as total_checkouts
      FROM 
        books b
        LEFT JOIN checkouts c ON b.id = c.book_id
      GROUP BY 
        b.genre
      ORDER BY 
        total_checkouts DESC
    `);

    connection.release();
    return NextResponse.json(rows);

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genre popularity data' },
      { status: 500 }
    );
  }
}