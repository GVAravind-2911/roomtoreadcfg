'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface LibraryStats {
    daily: {
        checkouts: number;
        checkins: number;
        activeUsers: number;
        newSignups: number;
        totalLogins: number;
    };
    overall: {
        totalBooks: number;
        availableBooks: number;
        currentCheckouts: number;
        totalUsers: number;
        totalSignups: number;
    };
    popular: {
        genres: { genre: string; count: number }[];
        books: { name: string; checkouts: number }[];
    };
    activityTrend: {
        date: string;
        activity_type: 'login' | 'logout' | 'signup';
        count: number;
    }[];
}

const AdminDashboard: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<LibraryStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0 // Disable animations to prevent render loops
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Memoize chart data to prevent recreation on each render
    const genreChartData = React.useMemo(() => ({
        labels: stats?.popular.genres.map(g => g.genre) || [],
        datasets: [{
            label: 'Checkouts by Genre',
            data: stats?.popular.genres.map(g => g.count) || [],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
        }]
    }), [stats?.popular.genres]);

    const bookChartData = React.useMemo(() => ({
        labels: stats?.popular.books.map(b => b.name) || [],
        datasets: [{
            label: 'Total Checkouts',
            data: stats?.popular.books.map(b => b.checkouts) || [],
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
        }]
    }), [stats?.popular.books]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
            return;
        }

        if (status === 'authenticated' && session.user?.role === 'admin') {
            fetchStats();
        }
    }, [status, session]);


    const fetchStats = async () => {
        try {
            const { data } = await axios.get('/api/admin/stats');
            setStats(data);
        } catch (err) {
            setError(axios.isAxiosError(err) 
                ? err.response?.data?.error || err.message 
                : 'Failed to load statistics');
        } finally {
            setLoading(false);
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Library Dashboard</h1>

            {/* Daily Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm uppercase">Today&apos;s Checkouts</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats?.daily.checkouts}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm uppercase">Today&apos;s Check-ins</h3>
                    <p className="text-3xl font-bold text-green-600">{stats?.daily.checkins}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm uppercase">Active Users Today</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats?.daily.activeUsers}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm uppercase">New Signups Today</h3>
                    <p className="text-3xl font-bold text-yellow-600">{stats?.daily.newSignups}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm uppercase">Total Logins Today</h3>
                    <p className="text-3xl font-bold text-indigo-600">{stats?.daily.totalLogins}</p>
                </div>
            </div>


            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm uppercase">Total Books</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.overall.totalBooks}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm uppercase">Available Books</h3>
                    <p className="text-3xl font-bold text-green-600">{stats?.overall.availableBooks}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm uppercase">Current Checkouts</h3>
                    <p className="text-3xl font-bold text-orange-600">{stats?.overall.currentCheckouts}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm uppercase">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats?.overall.totalUsers}</p>
                </div>
            </div>

            {/* Additional Overall Stats */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Total Signups</h2>
                <p className="text-3xl font-bold text-green-600">{stats?.overall.totalSignups}</p>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Popular Genres</h2>
                    <div className="h-64">
                        {stats && <Bar data={genreChartData} options={chartOptions} />}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Most Popular Books</h2>
                    <div className="h-64">
                        {stats && <Bar data={bookChartData} options={chartOptions} />}
                    </div>
                </div>
            </div>

            {/* User Activity Trend */}
            <div className="bg-white rounded-lg shadow p-6 mt-8">
                <h2 className="text-xl font-semibold mb-4">User Activity (Last 7 Days)</h2>
                <div className="h-64">
                {stats && <Bar
                    data={{
                        labels: [...new Set(stats.activityTrend.map(a => a.date.split('T')[0]))].reverse(),
                        datasets: [
                            {
                                label: 'Logins',
                                data: [...new Set(stats.activityTrend.map(a => a.date))]
                                    .reverse()
                                    .map(date => 
                                        stats.activityTrend
                                            .find(a => a.date === date && a.activity_type === 'login')
                                            ?.count || 0
                                    ),
                                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                            },
                            {
                                label: 'Signups',
                                data: [...new Set(stats.activityTrend.map(a => a.date))]
                                    .reverse()
                                    .map(date => 
                                        stats.activityTrend
                                            .find(a => a.date === date && a.activity_type === 'signup')
                                            ?.count || 0
                                    ),
                                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                            }
                        ]
                    }}
                    options={chartOptions}
                />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;