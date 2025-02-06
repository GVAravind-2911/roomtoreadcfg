'use client';

import React, { useState, useEffect } from 'react';

interface CheckInRecord {
    id: string;
    bookId: string;
    userId: string;
    quantity: number;
    notes?: string;
    checkinDate: Date;
    checkinTime: Date;
}

const CheckInPage = () => {
    const [records, setRecords] = useState<CheckInRecord[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const recordsPerPage = 25;

    const fetchCheckInRecords = async (page: number) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/checkin?page=${page}&page_size=${recordsPerPage}`);
            if (!response.ok) throw new Error('Failed to fetch records');
            
            const data = await response.json();
            setRecords(data.results);
            setTotalPages(Math.ceil(data.count / recordsPerPage));
        } catch (err) {
            setError('Failed to load check-in records');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
                fetchCheckInRecords(currentPage);
            }, [currentPage]);
        
            const handlePageChange = (newPage: number) => {
                setCurrentPage(newPage);
            };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Check-In Records</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {records.map((record) => (
                                    <tr key={record.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{record.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{record.bookId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{record.userId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{record.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(record.checkinDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{record.notes || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center mt-6 gap-2">
                       <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CheckInPage;