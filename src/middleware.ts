import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Admin routes protection
        if (path.startsWith('/admin') && token?.role !== 'admin') {
            return NextResponse.redirect(new URL('/auth', req.url));
        }

        // User routes protection
        if (path.startsWith('/user') && !token) {
            return NextResponse.redirect(new URL('/auth', req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
);

export const config = {
    matcher: ['/admin/:path*', '/user/:path*']
};