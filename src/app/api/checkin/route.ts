import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { books, checkouts } from '@/db/schema';
import { eq, and, sql, isNull } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const { book_ids } = await request.json();
        
        // Start a transaction
        await db.transaction(async (trx) => {
            for (const book_id of book_ids) {
                // Update book availability
                await trx
                    .update(books)
                    .set({ availableCopies: sql`availableCopies + 1` })
                    .where(eq(books.bookId, book_id));

                // Update checkout status
                await trx
                    .update(checkouts)
                    .set({ returnDate: new Date() })
                    .where(
                        and(
                            eq(checkouts.bookId, book_id),
                            isNull(checkouts.returnDate)
                        )
                    );
            }
        });

        return NextResponse.json({ 
            message: 'Books checked in successfully' 
        });
    } catch (error) {
        console.error('Check-in error:', error);
        return NextResponse.json(
            { error: 'Failed to check in books' },
            { status: 500 }
        );
    }
}