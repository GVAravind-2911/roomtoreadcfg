'use client';

import React from 'react';
import DailySummaryCard from '@/components/admin/DailySummaryCard';
import ActivityCard from '@/components/admin/ActivityChart';

interface DailySummary {
    checkouts: number;
    checkins: number;
    libraryVisits: number;
    activeUsers: number;
}

const AdminDashboard: React.FC = () => {
    const [summary, setSummary] = React.useState<DailySummary>({
        checkouts: 0,
        checkins: 0,
        libraryVisits: 0,
        activeUsers: 0
    });

    React.useEffect(() => {
        fetch('/api/admin/daily-summary')
            .then(res => res.json())
            .then(data => setSummary(data));
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <DailySummaryCard 
                    title="Book Checkouts Today"
                    value={summary.checkouts}
                    icon="📚"
                />
                <DailySummaryCard 
                    title="Book Check-ins Today"
                    value={summary.checkins}
                    icon="📖"
                />
                <DailySummaryCard 
                    title="Library Visits"
                    value={summary.libraryVisits}
                    icon="🏛️"
                />
                <DailySummaryCard 
                    title="Active Users"
                    value={summary.activeUsers}
                    icon="👥"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Today&apos;s Activity</h2>
                    <ActivityCard
                        title="Reading Adventure"
                        description="An exciting reading journey"
                        imageUrl="/activities/reading.jpg"
                        difficulty="beginner"
                        duration={15}
                        completionStatus={false}
                        onClick={() => console.log('Activity clicked')}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;