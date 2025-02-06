'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Book {
    book_id: string;
    name: string;
    author: string;
    checkout_date: string;
    due_date: string;
}

const CheckInPage: React.FC = () => {
    const [checkedOutBooks, setCheckedOutBooks] = useState<Book[]>([]);
    const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchCheckedOutBooks();
    }, []);

    const fetchCheckedOutBooks = async () => {
        try {
            const response = await fetch('/api/user/books/checked-out');
            if (!response.ok) throw new Error('Failed to fetch books');
            const data = await response.json();
            setCheckedOutBooks(data.books);
        } catch (err) {
            setError('Failed to load checked out books');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        if (selectedBooks.length === 0) {
            setError('Please select at least one book to check in');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/user/books/checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ book_ids: selectedBooks }),
            });

            if (!response.ok) throw new Error('Failed to check in books');

            router.push('/user/dashboard?success=checkin');
        } catch (err) {
            setError('Failed to check in books');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleBookSelection = (bookId: string) => {
        setSelectedBooks(prev => 
            prev.includes(bookId)
                ? prev.filter(id => id !== bookId)
                : [...prev, bookId]
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Check In Books</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {checkedOutBooks.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">You don&apos;t have any books checked out.</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Select
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Book Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Author
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Checkout Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {checkedOutBooks.map((book) => (
                                    <tr key={book.book_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedBooks.includes(book.book_id)}
                                                onChange={() => toggleBookSelection(book.book_id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{book.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(book.checkout_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(book.due_date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleCheckIn}
                            disabled={selectedBooks.length === 0 || loading}
                            className={`bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold
                                ${(selectedBooks.length === 0 || loading)
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-blue-700'}`}
                        >
                            {loading ? 'Checking in...' : 'Check In Selected Books'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CheckInPage;