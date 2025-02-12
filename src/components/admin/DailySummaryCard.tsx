import React from 'react';

interface DailySummaryCardProps {
    title: string;
    value: number;
    icon: string;
    isDate?: boolean;
}

const DailySummaryCard: React.FC<DailySummaryCardProps> = ({ title, value, icon, isDate }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-bold mt-1">
                        {isDate ? new Date(value).toLocaleDateString() : value}
                    </p>
                </div>
                <span className="text-3xl">{icon}</span>
            </div>
        </div>
    );
};

export default DailySummaryCard;