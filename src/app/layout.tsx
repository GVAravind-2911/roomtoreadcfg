'use client'

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
        <div>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
        </SessionProvider>
      </body>
    </html>
  );
}