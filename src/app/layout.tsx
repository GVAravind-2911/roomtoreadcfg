'use client'

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-full">
        <SessionProvider>
          <div className="flex flex-col min-h-full">
            <Navbar />
            <main className="flex-grow pb-16">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}