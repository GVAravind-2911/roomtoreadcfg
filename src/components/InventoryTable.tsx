'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { MagnifyingGlassIcon, PlusIcon, MinusIcon, PencilIcon } from '@heroicons/react/24/outline';

interface Book {
    book_id: string;
    name: string;
    author: string;
    genre: string;
    total_copies: number;
    available_copies: number;
}

interface ApiResponse {
    results: Book[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}

interface BookFormData {
    book_id: string;
    name: string;
    author: string;
    genre: string;
    total_copies: number;
}
const InventoryTable: React.FC = () => {
    const [data, setData] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [formData, setFormData] = useState<BookFormData>({
        book_id: '',
        name: '',
        author: '',
        genre: '',
        total_copies: 1
    });

    const fetchData = useCallback(async (page: number) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get<ApiResponse>('/api/admin/inventory', {
                params: {
                    page: page + 1,
                    pageSize: 25,
                    search: searchQuery
                }
            });
            
            if (response.data?.results) {
                setData(response.data.results);
                setPageCount(response.data.pagination.totalPages);
            } else {
                throw new Error('Invalid data format received');
            }
        } catch (err) {
            setError(axios.isAxiosError(err) 
                ? err.response?.data?.error || err.message 
                : 'Failed to load inventory');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await axios.post('/api/admin/inventory', formData);
            setIsAddModalOpen(false);
            setFormData({ book_id: '', name: '', author: '', genre: '', total_copies: 1 });
            fetchData(currentPage);
        } catch (err) {
            setError(axios.isAxiosError(err) 
                ? err.response?.data?.error || err.message 
                : 'Failed to add book');
        }
    };

    const handleEditBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBook) return;
        
        setError(null);
        try {
            await axios.put(`/api/admin/inventory/${selectedBook.book_id}`, formData);
            setIsEditModalOpen(false);
            setSelectedBook(null);
            fetchData(currentPage);
        } catch (err) {
            setError(axios.isAxiosError(err) 
                ? err.response?.data?.error || err.message 
                : 'Failed to update book');
        }
    };

    const handleCopiesChange = async (bookId: string, increment: boolean) => {
        setError(null);
        try {
            await axios.put(`/api/admin/inventory/${bookId}/copies`, { increment });
            fetchData(currentPage);
        } catch (err) {
            setError(axios.isAxiosError(err) 
                ? err.response?.data?.error || err.message 
                : 'Failed to update copies');
        }
    };


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchData(currentPage);
        }, 500); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [currentPage, fetchData, searchQuery]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="flex flex-col">
            {/* Add Book Button */}
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search by title, author, or genre..."
                    />
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Book
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>        
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Copies</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                         Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((book) => (
                                    <tr key={book.book_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.book_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.genre}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.total_copies}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                book.available_copies > 0 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {book.available_copies}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleCopiesChange(book.book_id, true)}
                                                    className="text-green-600 hover:text-green-900 p-1"
                                                    title="Add copy"
                                                >
                                                    <PlusIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleCopiesChange(book.book_id, false)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    disabled={book.available_copies === 0}
                                                    title="Remove copy"
                                                >
                                                    <MinusIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedBook(book);
                                                        setFormData({
                                                            book_id: book.book_id,
                                                            name: book.name,
                                                            author: book.author,
                                                            genre: book.genre,
                                                            total_copies: book.total_copies
                                                        });
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="Edit book"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pageCount - 1}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing page <span className="font-medium">{currentPage + 1}</span> of{' '}
                                        <span className="font-medium">{pageCount}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {Array.from({ length: pageCount }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handlePageChange(i)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    currentPage === i
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isAddModalOpen && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                                <h2 className="text-xl font-bold mb-4">Add New Book</h2>
                                <form onSubmit={handleAddBook} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Book ID"
                                        value={formData.book_id}
                                        onChange={e => setFormData({...formData, book_id: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Book Name"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Author"
                                        value={formData.author}
                                        onChange={e => setFormData({...formData, author: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Genre"
                                        value={formData.genre}
                                        onChange={e => setFormData({...formData, genre: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Total Copies"
                                        value={formData.total_copies}
                                        onChange={e => setFormData({...formData, total_copies: parseInt(e.target.value)})}
                                        className="w-full p-2 border rounded"
                                        min="1"
                                        required
                                    />
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Add Book
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Edit Book Modal */}
                    {isEditModalOpen && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                                <h2 className="text-xl font-bold mb-4">Edit Book</h2>
                                <form onSubmit={handleEditBook} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Book Name"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Author"
                                        value={formData.author}
                                        onChange={e => setFormData({...formData, author: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Genre"
                                        value={formData.genre}
                                        onChange={e => setFormData({...formData, genre: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default InventoryTable;