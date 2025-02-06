'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthFormData {
    user_id: string;
    password: string;
    name?: string;
    user_type: 'user' | 'admin';
    admin_code?: string;
}

const AuthPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [formData, setFormData] = useState<AuthFormData>({
        user_id: '',
        password: '',
        name: '',
        user_type: 'user',
        admin_code: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
    
        try {
            // Validate admin code for signup
            if (activeTab === 'signup' && formData.user_type === 'admin' && formData.admin_code !== 'ABC!@') {
                setError('Invalid admin code');
                setLoading(false);
                return;
            }
    
            const endpoint = activeTab === 'login' ? '/api/login' : '/api/signup';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }
    
            // Redirect based on user type
            if (data.user?.user_type === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Welcome to Room to Read
                </h2>
                
                <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="sm:flex sm:justify-center space-x-4 mb-6">
                        <button
                            onClick={() => setActiveTab('login')}
                            className={`${
                                activeTab === 'login'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setActiveTab('signup')}
                            className={`${
                                activeTab === 'signup'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
                                User ID
                            </label>
                            <div className="mt-1">
                                <input
                                    id="user_id"
                                    name="user_id"
                                    type="text"
                                    required
                                    value={formData.user_id}
                                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {activeTab === 'signup' && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required={activeTab === 'signup'}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Account Type
                            </label>
                            <div className="mt-1 space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        checked={formData.user_type === 'user'}
                                        onChange={() => setFormData({ ...formData, user_type: 'user', admin_code: '' })}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="ml-2">User</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        checked={formData.user_type === 'admin'}
                                        onChange={() => setFormData({ ...formData, user_type: 'admin' })}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="ml-2">Admin</span>
                                </label>
                            </div>
                        </div>

                        {formData.user_type === 'admin' && activeTab === 'signup' && (
                            <div>
                                <label htmlFor="admin_code" className="block text-sm font-medium text-gray-700">
                                    Admin Code
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="admin_code"
                                        name="admin_code"
                                        type="password"
                                        required
                                        value={formData.admin_code}
                                        onChange={(e) => setFormData({ ...formData, admin_code: e.target.value })}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : activeTab === 'login' ? (
                                    'Sign In'
                                ) : (
                                    'Sign Up'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;