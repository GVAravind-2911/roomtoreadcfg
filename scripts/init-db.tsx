import { db } from '../src/db';
import { users, books } from '../src/db/schema';
import { hashSync } from 'bcrypt';

async function seed() {
  try {
    // Create a test user
    await db.insert(users).values({
      userId: 'ADMIN1',
      name: 'Admin User',
      userType: 'admin',
      password: hashSync('password123', 10),
    });

    // Create test books
    await db.insert(books).values([
      {
        bookId: 'BOOK1',
        name: 'Test Book 1',
        author: 'Test Author 1',
        genre: 'Fiction',
        totalCopies: 5,
        availableCopies: 5,
      },
    ]);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();