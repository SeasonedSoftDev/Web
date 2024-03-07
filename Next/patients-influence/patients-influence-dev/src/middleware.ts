import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  CUnprotectedRoutes,
  CProtectedRoutes,
  CMiscRoutes,
  CProtectedDynamicRoutes,
} from 'constants/routes';
import Project from 'constants/project';
import { RequestCookie } from 'next/dist/server/web/spec-extension/cookies';

const PUBLIC_FILE = /\.(.*)$/;

const checkLoggedIn = async (authCookie?: RequestCookie | undefined) => {
  try {
    if (!authCookie) throw new Error('No cookie');

    const res = await fetch(`${Project.apis.v1}/pingAuth`, {
      method: 'GET',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
        cookie: `${authCookie.name}=${authCookie.value}`,
      }),
    });

    if (!res.ok) {
      throw new Error('Bad ping');
    }

    return true;
  } catch {
    return false;
  }
};

export const middleware = async (request: NextRequest) => {
  const { pathname, locale, defaultLocale } = request.nextUrl;

  if (
    pathname.startsWith('/_next') || // exclude Next.js internals
    pathname.startsWith('/api') || //  exclude all API routes
    pathname.startsWith('/static') || // exclude static files
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get('auth');
  const loggedIn = await checkLoggedIn(authCookie);

  const withLocale = locale === defaultLocale ? '' : `/${locale}`;

  const isProtectedRoute = CProtectedRoutes.includes(pathname);
  const isProtectedDynamicRoute = CProtectedDynamicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isUnprotectedRoute = CUnprotectedRoutes.includes(pathname);
  const isMiscRoute = CMiscRoutes.includes(pathname);

  if (loggedIn) {
    if (!isProtectedRoute && !isProtectedDynamicRoute && !isMiscRoute) {
      return NextResponse.redirect(new URL(`${withLocale}/`, request.url));
    }
  } else if (!isUnprotectedRoute && !isMiscRoute) {
    return NextResponse.redirect(new URL(`${withLocale}/login`, request.url));
  }

  return NextResponse.next();
};
