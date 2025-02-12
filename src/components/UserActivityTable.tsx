'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

interface UserActivity {
    checkout_id: number;
    book_id: string;
    book_name: string;
    checkout_date: string;
    return_date: string | null;
    is_overdue: boolean;
}

interface Props {
    userId: string;
}

const UserActivityTable: React.FC<Props> = ({ userId }) => {
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActivities = useCallback(async () => {
        if (!userId) return;
        
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/admin/users/${userId}/history`);
            setActivities(data.activities || []);
            setError(null);
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.error || err.message
                : 'Failed to load user activities');
            setActivities([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No activity found for this user.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Book
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Checkout Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Return Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {activities.map((activity) => (
                        <tr key={activity.checkout_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {activity.book_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    ID: {activity.book_id}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(activity.checkout_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activity.return_date 
                                    ? new Date(activity.return_date).toLocaleDateString()
                                    : '-'
                                }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${activity.return_date 
                                        ? 'bg-green-100 text-green-800'
                                        : activity.is_overdue
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {activity.return_date 
                                        ? 'Returned'
                                        : activity.is_overdue
                                            ? 'Overdue'
                                            : 'Checked Out'
                                    }
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserActivityTable;