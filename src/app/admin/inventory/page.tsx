'use client';

import React from 'react';
import InventoryTable from '@/components/InventoryTable';

const InventoryPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Library Inventory</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage and monitor your library&apos;s book collection
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow">
                    <InventoryTable />
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;