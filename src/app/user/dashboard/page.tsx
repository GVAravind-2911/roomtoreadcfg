'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BookHistory {
    checkout_id: number;
    book_id: string;
    book_name: string;
    author: string;
    genre: string;
    checkout_date: string;
    return_date: string | null;
}

interface UserStats {
    total_checkouts: number;
    current_checkouts: number;
    favorite_genre: string;
    books_returned_ontime: number;
    reading_streak: number;
}

export default function DashboardPage() {
    const [history, setHistory] = useState<BookHistory[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([fetchHistory(), fetchUserStats()]);
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get('/api/books/history', {
                params: { userId: 'USER002' } // Replace with actual user ID
            });
            setHistory(data);
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.error || err.message
                : 'Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStats = async () => {
        try {
            const { data } = await axios.get('/api/user/stats', {
                params: { userId: 'USER002' }
            });
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch user stats:', err);
        }
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

    const currentCheckouts = history.filter(item => !item.return_date);
    const pastCheckouts = history.filter(item => item.return_date);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-500 text-sm uppercase">Total Checkouts</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.total_checkouts}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-500 text-sm uppercase">Current Checkouts</h3>
                        <p className="text-3xl font-bold text-green-600">{stats.current_checkouts}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-500 text-sm uppercase">Reading Streak</h3>
                        <p className="text-3xl font-bold text-orange-600">{stats.reading_streak} days</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-500 text-sm uppercase">Favorite Genre</h3>
                        <p className="text-3xl font-bold text-purple-600">{stats.favorite_genre}</p>
                    </div>
                </div>
            )}

            {/* Reading Progress */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Reading Progress</h2>
                <div className="h-64">
                    <Bar
                        data={{
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                            datasets: [{
                                label: 'Books Read',
                                data: [4, 3, 5, 2, 4, 6],
                                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                        }}
                    />
                </div>
            </div>

            {/* Current Checkouts */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Currently Reading</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentCheckouts.slice(0, 3).map((item) => (
                        <div key={item.checkout_id} className="bg-white rounded-lg shadow p-6">
                            <h3 className="font-semibold text-lg mb-2">{item.book_name}</h3>
                            <p className="text-gray-600 mb-2">{item.author}</p>
                            <p className="text-sm text-gray-500">
                                Checked out: {new Date(item.checkout_date).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {pastCheckouts.map((item) => (
                        <div key={item.checkout_id} className="flex items-center justify-between border-b pb-4">
                            <div>
                                <h3 className="font-medium">{item.book_name}</h3>
                                <p className="text-sm text-gray-500">{item.author}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                Returned: {new Date(item.return_date!).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
