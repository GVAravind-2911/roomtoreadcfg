'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Book {
    book_id: string;
    name: string;
    author: string;
    genre: string;
    available_copies: number;
    total_copies: number;
}

interface ApiResponse {
    results: Book[];
    error?: string;
}

export default function CheckoutPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'title' | 'genre' | 'id'>('title');

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get<ApiResponse>('/api/books/search', {
                params: {
                    query: searchQuery,
                    type: searchType
                }
            });
            if (data.results && Array.isArray(data.results)) {
                setBooks(data.results);
            } else {
                throw new Error('Invalid search results format');
            }
        } catch (err) {
            setError(axios.isAxiosError(err) 
                ? err.response?.data?.error || err.message 
                : 'Failed to search books'
            );
            setBooks([]); // Initialize with empty array on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const { data } = await axios.get<ApiResponse>('/api/books');
            if (data.results && Array.isArray(data.results)) {
                setBooks(data.results);
            } else {
                throw new Error('Invalid data format received');
            }
        } catch (err) {
            setError(axios.isAxiosError(err) 
                ? err.response?.data?.error || err.message 
                : 'Failed to load books'
            );
            setBooks([]); // Initialize with empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async (bookId: string) => {
        try {
            console.log('Checking out book:', bookId);

            await axios.post('/api/books/checkout', {
                bookId: bookId
            });

            // Update the local state to reflect the change
            setBooks(books.map(book => 
                book.book_id === bookId 
                    ? { ...book, available_copies: book.available_copies - 1 }
                    : book
            ));

            alert('Book checked out successfully!');
        } catch (err) {
            console.error('Checkout error:', err);
            alert(axios.isAxiosError(err) 
                ? err.response?.data?.error || err.message 
                : 'Failed to checkout book'
            );
        }
    };

    // ... rest of the component remains the same ...
    if (loading) {
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
            <div className="mb-6">
                <div className="flex gap-4 mb-4">
                    <select
                        className="p-2 border rounded"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as 'title' | 'genre' | 'id')}
                    >
                        <option value="title">Search by Title</option>
                        <option value="genre">Search by Genre</option>
                        <option value="id">Search by ID</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search books..."
                        className="flex-1 p-2 border rounded"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Search
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center p-4">
                    Error: {error}
                </div>
            ) : books.length === 0 ? (
                <div className="text-gray-500 text-center p-4">
                    No books found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div key={book.book_id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-2">{book.name}</h2>
                            <p className="text-gray-600 mb-2">Author: {book.author}</p>
                            <p className="text-gray-600 mb-2">Genre: {book.genre}</p>
                            <p className="text-gray-600 mb-2">Total Copies: {book.total_copies}</p>
                            <p className="text-gray-600 mb-4">
                                Available Copies: {book.available_copies}
                            </p>
                            <button
                                onClick={() => {console.log(book.book_id);handleCheckout(book.book_id)}}
                                disabled={book.available_copies === 0}
                                className={`w-full py-2 px-4 rounded-md ${
                                    book.available_copies > 0
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'bg-gray-300 cursor-not-allowed text-gray-500'
                                }`}
                            >
                                {book.available_copies > 0 ? 'Check Out' : 'Not Available'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}