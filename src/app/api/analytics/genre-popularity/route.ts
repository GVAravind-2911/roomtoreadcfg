import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const results = await db.execute(sql`
            SELECT 
                b.genre as book__genre,
                COUNT(*) as total_checkouts
            FROM checkins c
            JOIN books b ON c.book_id = b.book_id
            GROUP BY b.genre
            ORDER BY total_checkouts DESC
        `);

        return NextResponse.json({
            genre_popularity: results
        });
    } catch (error) {
        console.error('Error fetching genre popularity:', error);
        return NextResponse.json(
            { error: 'Failed to load genre popularity data' },
            { status: 500 }
        );
    }
}