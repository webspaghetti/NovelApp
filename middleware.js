import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = [
    '/login',
    '/register',
    '/background_img.png',
];

const publicApiRoutes = [
    '/api/auth',
    '/api/reset-password'
];

export async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Get the session token
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    const isLoggedIn = !!token;
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));
    const isApiRoute = pathname.startsWith('/api');


    // Allow public API routes (NextAuth)
    if (isPublicApiRoute) {
        return NextResponse.next();
    }

    // Protect other API routes
    if (isApiRoute && !isLoggedIn) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    // Check if user needs password reset
    if (isLoggedIn && token.needsPasswordReset && pathname !== '/reset-password') {
        return NextResponse.redirect(new URL('/reset-password', req.nextUrl.origin));
    }

    // Allow users who need password reset to access the reset-password page
    if (isLoggedIn && token.needsPasswordReset && pathname === '/reset-password') {
        return NextResponse.next();
    }

    // Protect reset-password page - only accessible if user needs password reset
    if (pathname === '/reset-password') {
        if (!isLoggedIn || !token.needsPasswordReset) {
            return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
        }
    }

    if (isLoggedIn && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
        return NextResponse.redirect(new URL('/', req.nextUrl.origin));
    }

    // If not logged-in user tries to access protected pages
    if (!isLoggedIn && !isPublicRoute && !isApiRoute) {
        const loginUrl = new URL('/login', req.nextUrl.origin);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};