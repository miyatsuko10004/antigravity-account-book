import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: ['/:path*'],
};

export function middleware(req: NextRequest) {
    const basicAuth = req.headers.get('authorization');
    const url = req.nextUrl;

    // Bypass Basic Auth for public assets and API routes if needed
    if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/static') || url.pathname.startsWith('/favicon.ico')) {
        return NextResponse.next();
    }

    if (basicAuth) {
        try {
            const parts = basicAuth.split(' ');
            if (parts.length === 2 && parts[0] === 'Basic') {
                const authValue = parts[1];
                const decoded = atob(authValue);

                if (decoded.includes(':')) {
                    const [user, pwd] = decoded.split(':');
                    const validUser = process.env.BASIC_AUTH_USER;
                    const validPass = process.env.BASIC_AUTH_PASSWORD;

                    if (user && pwd && user === validUser && pwd === validPass) {
                        return NextResponse.next();
                    }
                }
            }
        } catch (e) {
            // Fall through to 401 on any parsing error
            console.error('Basic Auth error:', e);
        }
    }

    return new NextResponse('Auth Required.', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    });
}
