import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <main className="flex-grow">
                <section className="relative">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src="/lib.jpg"
                            alt="Library Background"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-blue-900/70"></div>
                    </div>

                    {/* Content */}
                    <div className="relative py-20">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col items-center text-center">
                                <div className="max-w-3xl">
                                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                                        Room to Read Library
                                    </h1>
                                    <p className="text-xl mb-8 text-white">
                                        Empowering communities through literacy and education.
                                        Discover our collection of books and resources.
                                    </p>
                                    <Link 
                                        href="/books" 
                                        className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
                                    >
                                        Browse Books
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Book Borrowing</h3>
                                <p className="text-gray-600">Access our extensive collection of books for all age groups.</p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Study Spaces</h3>
                                <p className="text-gray-600">Quiet and comfortable areas for reading and studying.</p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Digital Resources</h3>
                                <p className="text-gray-600">Access to online learning materials and digital books.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-blue-50">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Start Reading?</h2>
                        <p className="text-xl text-gray-600 mb-8">Join our library today and discover a world of knowledge.</p>
                        <div className="space-x-4">
                            <Link 
                                href="/auth" 
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Sign Up Now
                            </Link>
                            <Link 
                                href="/about" 
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            
        </div>
    );
};

export default HomePage;