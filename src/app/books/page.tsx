'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Book {
    book_id: string;
    name: string;
    author: string;
    genre: string;  
    available_copies: number;
    total_copies: number;
    current_checkouts: number;
}

const BooksPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await axios.get('/api/booklist');
                setBooks(data.books);
            } catch (err) {
                setError(axios.isAxiosError(err)
                    ? err.response?.data?.error || err.message
                    : 'Failed to load books');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const genres = ['all', ...new Set(books.filter(book => book?.genre).map(book => book.genre))];

    const filteredBooks = books.filter(book => {
        if (!book) return false;
        
        const matchesSearch = searchTerm === '' || [
            book.name || '',
            book.author || ''
        ].some(field => 
            field.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Library Books</h1>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by title, author"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="md:w-48">
                    <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {genres.map(genre => (
                            <option key={genre} value={genre}>
                                {genre === 'all' ? 'All Genres' : genre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBooks.map((book) => (
                            <tr key={book.book_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.genre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {book.available_copies} / {book.total_copies}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BooksPage;