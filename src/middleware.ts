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
            // Don't redirect, but still apply CSP (fall through)
        } else if (!isAuth) {
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

    // 3. Apply CSP with nonce
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

    const cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' https://apis.google.com https://www.gstatic.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' blob: data: https:;
        connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com;
        frame-src 'self' https://learntok-d87d6.firebaseapp.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set('Content-Security-Policy', cspHeader);

    return response;
}

// Run middleware on all pages
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api routes
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico, sitemap.xml, robots.txt
         */
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
};
