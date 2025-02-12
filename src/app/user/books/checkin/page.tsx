'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface CheckedOutBook {
    checkout_id: number;
    book_id: string;
    book_name: string;
    author: string;
    genre: string;
    checkout_date: string;
}

export default function CheckinPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [books, setBooks] = useState<CheckedOutBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Redirect if not authenticated
        if (status === 'unauthenticated') {
            router.push('/auth');
            return;
        }

        // Only fetch checkouts if authenticated
        if (status === 'authenticated' && session.user) {
            fetchUserCheckouts();
        }
    }, [status, session]);

    const fetchUserCheckouts = async () => {
        if (!session?.user?.id) return;

        try {
            const { data } = await axios.get('/api/books/user-checkouts', {
                params: { userId: session.user.id }
            });
            setBooks(data);
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.error || err.message
                : 'Failed to load checkouts');
        } finally {
            setLoading(false);
        }
    };


    const handleCheckin = async (bookId: string) => {
        if (!session?.user?.id) {
            alert('Please log in to check in books');
            return;
        }

        try {
            await axios.post('/api/books/checkin', {
                bookId,
                userId: session.user.id
            });

            // Remove the checked-in book from the list
            setBooks(books.filter(book => book.book_id !== bookId));
            alert('Book checked in successfully!');
        } catch (err) {
            alert(axios.isAxiosError(err)
                ? err.response?.data?.error || err.message
                : 'Failed to check in book');
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Checked Out Books</h1>
            
            {books.length === 0 ? (
                <div className="text-gray-500 text-center p-4">
                    No books currently checked out
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div key={book.checkout_id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-2">{book.book_name}</h2>
                            <p className="text-gray-600 mb-2">Author: {book.author}</p>
                            <p className="text-gray-600 mb-2">Genre: {book.genre}</p>
                            <p className="text-gray-600 mb-4">
                                Checked out: {new Date(book.checkout_date).toLocaleDateString()}
                            </p>
                            <button
                                onClick={() => handleCheckin(book.book_id)}
                                className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                                Check In
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}