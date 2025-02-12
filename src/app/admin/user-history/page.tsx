'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserActivityTable from '@/components/UserActivityTable';

interface User {
    user_id: string;
    name: string;
}

interface LastActivity {
    last_login?: string;
    last_logout?: string;
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [lastActivity, setLastActivity] = useState<LastActivity>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('/api/admin/users');
                setUsers(data.users);
                if (data.users.length > 0) {
                    setSelectedUserId(data.users[0].user_id);
                }
            } catch (err) {
                setError(axios.isAxiosError(err)
                    ? err.response?.data?.error || err.message
                    : 'Failed to load users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchLastActivity = async () => {
            if (!selectedUserId) return;
            
            try {
                const { data } = await axios.get(`/api/admin/users/${selectedUserId}/last-activity`);
                setLastActivity(data);
            } catch (err) {
                console.error('Error fetching last activity:', err);
            }
        };

        fetchLastActivity();
    }, [selectedUserId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">User Activity Management</h1>
                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                        <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-2">
                            Select User
                        </label>
                        <select
                            id="userSelect"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            {users.map((user) => (
                                <option key={user.user_id} value={user.user_id}>
                                    {user.name} ({user.user_id})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedUserId && (
                        <>
                            <div className="bg-white rounded-lg shadow mb-6">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        Last Activity
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Activity Type
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Timestamp
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        Last Login
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {lastActivity.last_login || 'N/A'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        Last Logout
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {lastActivity.last_logout || 'N/A'}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow">
                                <UserActivityTable userId={selectedUserId} />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminUsersPage;