import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { books } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page_size') || '25');
    const offset = (page - 1) * pageSize;

    const results = await db
      .select()
      .from(books)
      .limit(pageSize)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql`COUNT(*)` })
      .from(books);

    return NextResponse.json({
      results,
      count,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}