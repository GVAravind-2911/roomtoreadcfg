'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserActivityTable  from '@/components/UserActivityTable';

interface User {
    user_id: string;
    name: string;
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>('');
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
                        <div className="bg-white rounded-lg shadow">
                            <UserActivityTable userId={selectedUserId} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminUsersPage;