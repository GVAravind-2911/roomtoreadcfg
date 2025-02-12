'use client';

import React from 'react';
import GenreChart from '@/components/BookPopular';
import DataGraph from '@/components/Datagraph';
import LineChart from '@/components/LineChart';
import MonthlyTrends from '@/components/MonthlyTrends';

const AnalyticsPage: React.FC = () => {

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Library Analytics Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Genre Popularity Chart */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Genre Distribution</h2>
                    <GenreChart />
                </div>

                {/* Data Graph */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Book Status Overview</h2>
                    <DataGraph />
                </div>

                {/* Line Chart */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Checkout Trends</h2>
                    <LineChart />
                </div>

                {/* Monthly Trends */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Monthly Activity</h2>
                    <MonthlyTrends />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;


