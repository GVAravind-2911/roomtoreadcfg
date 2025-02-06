'use client';

import React from 'react';
import UserSummaryCard from '@/components/user/UserSummaryCard';
import BookList from '@/components/user/BookList';

interface UserSummary {
    checkedOutBooks: number;
    checkedInBooks: number;
    lastLibraryCheckin: string;
    lastLibraryCheckout: string;
}

const UserDashboard: React.FC = () => {
    const [summary, setSummary] = React.useState<UserSummary>({
        checkedOutBooks: 0,
        checkedInBooks: 0,
        lastLibraryCheckin: '',
        lastLibraryCheckout: ''
    });

    React.useEffect(() => {
        fetch('/api/user/summary')
            .then(res => res.json())
            .then(data => setSummary(data));
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <UserSummaryCard 
                    title="Books Checked Out"
                    value={summary.checkedOutBooks}
                    icon="📚"
                />
                <UserSummaryCard 
                    title="Books Returned"
                    value={summary.checkedInBooks}
                    icon="📖"
                />
                <UserSummaryCard 
                    title="Last Library Visit"
                    value={summary.lastLibraryCheckin}
                    icon="🏛️"
                    isDate
                />
                <UserSummaryCard 
                    title="Last Checkout"
                    value={summary.lastLibraryCheckout}
                    icon="📅"
                    isDate
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Currently Borrowed Books</h2>
                    <BookList type="borrowed" />
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Recent Returns</h2>
                    <BookList type="returned" />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;