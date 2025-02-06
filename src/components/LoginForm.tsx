'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginForm() {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post('/api/login', {
                user_id: userId,
                password: password
            });

            if (response.status === 200) {
                router.push('/');
            } else {
                setErrorMessage(response.data);
            }
        } catch (error) {
            console.error('Login error:', error);
            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.error || 
                    'Login failed. Please check your credentials and try again.'
                );
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="max-w-md w-full space-y-8">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="user_id" className="sr-only">
                            User ID
                        </label>
                        <input
                            id="user_id"
                            name="user_id"
                            type="text"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                                     border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md 
                                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                                     focus:z-10 sm:text-sm"
                            placeholder="User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                                     border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md 
                                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                                     focus:z-10 sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {errorMessage && (
                    <div className="text-red-500 text-sm text-center">{errorMessage}</div>
                )}

                <div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border 
                                 border-transparent text-sm font-medium rounded-md text-white 
                                 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 
                                 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </div>
            </form>
        </div>
    );
}