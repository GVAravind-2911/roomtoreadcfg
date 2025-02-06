'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Book {
    bookId: string;
    name: string;
    author: string;
    genre: string;
    totalCopies: number;
    availableCopies: number;
}

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

const InventoryTable: React.FC = () => {
    const [data, setData] = useState<Book[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [editBook, setEditBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (page: number) => {
        try {
            const response = await api.get(`/books?page=${page + 1}&page_size=25`);
            setData(response.data.results);
            setPageCount(Math.ceil(response.data.count / 25));
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load books');
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handleIncrease = async (book: Book) => {
        try {
            await api.put(`/books/${book.bookId}`, {
                ...book,
                totalCopies: book.totalCopies + 1,
                availableCopies: book.availableCopies + 1
            });
            await fetchData(currentPage);
            setError(null);
        } catch (error) {
            console.error('Error increasing copies:', error);
            setError('Failed to increase copies');
        }
    };

    const handleDecrease = async (book: Book) => {
        if (book.totalCopies > 0) {
            try {
                await api.put(`/books/${book.bookId}`, {
                    ...book,
                    totalCopies: book.totalCopies - 1,
                    availableCopies: book.availableCopies - 1
                });
                await fetchData(currentPage);
                setError(null);
            } catch (error) {
                console.error('Error decreasing copies:', error);
                setError('Failed to decrease copies');
            }
        }
    };

    const handleDelete = async (book: Book) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await api.delete(`/books/${book.bookId}`);
                await fetchData(currentPage);
                setError(null);
            } catch (error) {
                console.error('Error deleting book:', error);
                setError('Failed to delete book');
            }
        }
    };

    const handleUpdate = (book: Book) => {
        setEditBook(book);
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    const handleSave = async () => {
        if (!editBook) return;
        try {
            await api.put(`/books/${editBook.bookId}`, editBook);
            setEditBook(null);
            await fetchData(currentPage);
            setError(null);
        } catch (error) {
            console.error('Error updating book:', error);
            setError('Failed to update book');
        }
    };

    return (
        <div className="container mx-auto p-4">
            {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Copies</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Copies</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((book) => (
                            <tr key={book.bookId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{book.bookId}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{book.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{book.genre}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{book.totalCopies}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{book.availableCopies}</td>
                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                    <button 
                                        onClick={() => handleUpdate(book)} 
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                                    >
                                        Update
                                    </button>
                                    <button 
                                        onClick={() => handleIncrease(book)} 
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                                    >
                                        +
                                    </button>
                                    <button 
                                        onClick={() => handleDecrease(book)} 
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm"
                                        disabled={book.totalCopies <= 0}
                                    >
                                        -
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(book)} 
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4 space-x-2">
                {[...Array(pageCount)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageClick(index)}
                        className={`px-3 py-2 rounded ${
                            index === currentPage
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

    {editBook && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Edit Book</h2>
            <div className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Name:</label>
                    <input
                        type="text"
                        value={editBook.name || ''}
                        onChange={(e) => setEditBook({ ...editBook, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Author:</label>
                    <input
                        type="text"
                        value={editBook.author || ''}
                        onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Genre:</label>
                    <input
                        type="text"
                        value={editBook.genre || ''}
                        onChange={(e) => setEditBook({ ...editBook, genre: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Total Copies:</label>
                    <input
                        type="number"
                        value={editBook.totalCopies || 0}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setEditBook({ 
                                ...editBook, 
                                totalCopies: isNaN(value) ? 0 : value,
                                availableCopies: Math.min(
                                    isNaN(value) ? 0 : value,
                                    editBook.availableCopies || 0
                                )
                            });
                        }}
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Available Copies:</label>
                    <input
                        type="number"
                        value={editBook.availableCopies || 0}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setEditBook({ 
                                ...editBook, 
                                availableCopies: isNaN(value) ? 0 : Math.min(value, editBook.totalCopies || 0)
                            });
                        }}
                        min="0"
                        max={editBook.totalCopies || 0}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setEditBook(null)}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default InventoryTable;