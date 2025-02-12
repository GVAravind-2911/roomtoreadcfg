'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Checkout {
    checkout_id: number;
    book_id: string;
    book_name: string;
    author: string;
    genre: string;
    user_id: string;
    checkout_date: string;
    return_date: string | null;
}

export default function AdminCheckoutsPage() {
    const [checkouts, setCheckouts] = useState<Checkout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'user' | 'book' | 'genre'>('user');
    const [filteredCheckouts, setFilteredCheckouts] = useState<Checkout[]>([]);

    useEffect(() => {
        fetchCheckouts();
    }, []);

    useEffect(() => {
        filterCheckouts();
    }, [searchQuery, searchType, checkouts]);

    const fetchCheckouts = async () => {
        try {
            const { data } = await axios.get('/api/admin/checkouts');
            setCheckouts(data);
            setFilteredCheckouts(data);
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.error || err.message
                : 'Failed to load checkouts');
        } finally {
            setLoading(false);
        }
    };

    const filterCheckouts = () => {
        if (!searchQuery) {
            setFilteredCheckouts(checkouts);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = checkouts.filter(checkout => {
            switch (searchType) {
                case 'user':
                    return checkout.user_id.toLowerCase().includes(query);
                case 'book':
                    return checkout.book_name.toLowerCase().includes(query);
                case 'genre':
                    return checkout.genre.toLowerCase().includes(query);
                default:
                    return true;
            }
        });
        setFilteredCheckouts(filtered);
    };

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
            <h1 className="text-3xl font-bold mb-8">Book Checkouts</h1>

            {/* Search Controls */}
            <div className="mb-6">
                <div className="flex gap-4 mb-4">
                    <select
                        className="p-2 border rounded"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as 'user' | 'book' | 'genre')}
                    >
                        <option value="user">Search by User</option>
                        <option value="book">Search by Book</option>
                        <option value="genre">Search by Genre</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="flex-1 p-2 border rounded"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Checkouts Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Genre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Checkout Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredCheckouts.map((checkout) => (
                            <tr key={checkout.checkout_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{checkout.user_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{checkout.book_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{checkout.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{checkout.genre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {new Date(checkout.checkout_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${checkout.return_date 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'}`}
                                    >
                                        {checkout.return_date ? 'Returned' : 'Checked Out'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}