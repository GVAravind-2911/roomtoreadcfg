'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
    const { data: session, status } = useSession();
    const router = useRouter();
    const [history, setHistory] = useState<BookHistory[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Redirect if not authenticated
        if (status === 'unauthenticated') {
            router.push('/auth');
            return;
        }

        // Only fetch data if authenticated
        if (status === 'authenticated' && session?.user?.id) {
            const fetchData = async () => {
                try {
                    await Promise.all([
                        fetchHistory(),
                        fetchUserStats()
                    ]);
                } catch (err) {
                    console.error('Error fetching dashboard data:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [status, session?.user?.id]);

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get('/api/books/history', {
                params: { userId: session?.user?.id }
            });
            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.error || err.message
                : 'Failed to load history');
            throw err; // Propagate error for Promise.all
        }
    };

    const fetchUserStats = async () => {
        try {
            const { data } = await axios.get('/api/user/stats', {
                params: { userId: session?.user?.id }
            });
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch user stats:', err);
            throw err; // Propagate error for Promise.all
        }
    };

    const getMonthlyReadingData = () => {
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        
        // Create array of last 6 months
        const months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            return d.toLocaleString('default', { month: 'short' });
        }).reverse();

        // Count completed readings per month
        const monthlyCounts = history.reduce((acc: { [key: string]: number }, item) => {
            if (item.return_date) {
                const returnDate = new Date(item.return_date);
                if (returnDate >= sixMonthsAgo) {
                    const monthKey = returnDate.toLocaleString('default', { month: 'short' });
                    acc[monthKey] = (acc[monthKey] || 0) + 1;
                }
            }
            return acc;
        }, {});

        // Map counts to months array, filling in zeros for months with no readings
        const data = months.map(month => monthlyCounts[month] || 0);

        return { months, data };
    };

    // Add loading state for session
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
                            labels: getMonthlyReadingData().months,
                            datasets: [{
                                label: 'Books Read',
                                data: getMonthlyReadingData().data,
                                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                                borderColor: 'rgba(59, 130, 246, 1)',
                                borderWidth: 1,
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top' as const,
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => `Books: ${context.parsed.y}`
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1
                                    },
                                    title: {
                                        display: true,
                                        text: 'Number of Books'
                                    }
                                }
                            }
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
