'use client';

import React from 'react';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
            About Our Library
          </h1>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64 sm:h-72">
              <Image
                src="/lib.jpg"
                alt="Library Interior"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-6">
                We strive to promote literacy, foster learning, and build community by providing 
                free access to books and educational resources. Our library serves as a hub for 
                knowledge, creativity, and cultural exchange.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                What We Offer
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">Collections</h3>
                  <ul className="text-gray-600 list-disc list-inside">
                    <li>Fiction & Non-fiction Books</li>
                    <li>Reference Materials</li>
                    <li>Digital Resources</li>
                    <li>Educational Materials</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">Services</h3>
                  <ul className="text-gray-600 list-disc list-inside">
                    <li>Book Lending</li>
                    <li>Reading Programs</li>
                    <li>Study Spaces</li>
                    <li>Community Events</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;