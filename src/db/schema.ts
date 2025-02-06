import { mysqlTable, varchar, int, timestamp, date, time } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  userId: varchar('user_id', { length: 40 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  userType: varchar('user_type', { length: 10 }).notNull(),
  password: varchar('password', { length: 100 }).notNull(),
});

export const books = mysqlTable('books', {
  bookId: varchar('book_id', { length: 40 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  author: varchar('author', { length: 100 }).notNull(),
  genre: varchar('genre', { length: 100 }).notNull(),
  totalCopies: int('total_copies').notNull(),
  availableCopies: int('available_copies').notNull(),
});

export const checkouts = mysqlTable('checkouts', {
  id: varchar('id', { length: 36 }).primaryKey(),
  checkoutDate: date('checkout_date'),
  checkoutTime: time('checkout_time'),
  userId: varchar('user_id', { length: 36 }).notNull(),
  bookId: varchar('book_id', { length: 36 }).notNull(),
  returnDate: date('return_date').default(sql`null`),
});

export const checkins = mysqlTable('checkins', {
  id: varchar('id', { length: 40 }).primaryKey(),
  bookId: varchar('book_id', { length: 40 }).references(() => books.bookId),
  userId: varchar('user_id', { length: 40 }).references(() => users.userId),
  quantity: int('quantity').notNull(),
  notes: varchar('notes', { length: 255 }),
  checkinDate: timestamp('checkin_date').notNull(),
  checkinTime: timestamp('checkin_time').notNull(),
});