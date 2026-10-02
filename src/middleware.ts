import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isAuth = request.cookies.get('isAuth');
    
    // 1. Protected Routes (Must be logged in)
    const protectedRoutes = ['/profile', '/experience'];
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    
    if (isProtectedRoute) {
        // Exception: /experience/[id] is public, but /experience/[id]/edit is protected
        if (path.startsWith('/experience/') && !path.endsWith('/edit')) {
            return NextResponse.next();
        }

        if (!isAuth) {
            const url = new URL('/auth/login', request.url);
            // Optionally pass the original URL to redirect back after login
            url.searchParams.set('redirect', path);
            return NextResponse.redirect(url);
        }
    }
    
    // 2. Public-Only Routes (Must NOT be logged in, e.g. login/signup pages)
    const publicOnlyRoutes = ['/auth/login', '/auth/signup'];
    const isPublicOnlyRoute = publicOnlyRoutes.some(route => path.startsWith(route));
    
    if (isPublicOnlyRoute && isAuth) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Optimize middleware to only run on these specific paths
export const config = {
    matcher: [
        '/profile/:path*',
        '/experience/:path*/edit',
        '/auth/:path*'
    ],
};
