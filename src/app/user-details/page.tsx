'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import UserActivityTable from '@/components/admin/UserActivityTable';

const UserDetailsPage: React.FC = () => {
    const params = useParams();
    const userId = params.userId as string;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">User Activity History</h1>
            
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <UserActivityTable userId={userId} />
            </div>
        </div>
    );
};

export default UserDetailsPage;