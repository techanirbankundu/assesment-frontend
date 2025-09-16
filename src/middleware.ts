import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

function buildCookieHeader(req: NextRequest): string {
  const cookies: string[] = [];
  req.cookies.getAll().forEach((c) => cookies.push(`${c.name}=${c.value}`));
  return cookies.join('; ');
}

function normalizePath(path: string): string {
  if (path === '/dashboard' || path.startsWith('/dashboard/')) return path;
  if (path === '/profile' || path === '/settings') return path;
  if (path.startsWith('/')) return `/dashboard${path}`;
  return `/dashboard/${path}`;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard dashboard and profile/settings routes
  const needsAuth = pathname === '/dashboard' || pathname.startsWith('/dashboard/') || pathname === '/profile' || pathname === '/settings';
  if (!needsAuth) {
    return NextResponse.next();
  }

  // Try to fetch current user to validate session
  const cookieHeader = buildCookieHeader(req);

  // If no cookies at all, likely unauthenticated
  if (!cookieHeader) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Validate session
  const meResp = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: { Cookie: cookieHeader },
    // Avoid caching on the edge for auth
    cache: 'no-store',
  });

  if (!meResp.ok) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Authorization by allowed navigation links
  const navResp = await fetch(`${API_BASE_URL}/dashboard/navigation`, {
    method: 'GET',
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });

  if (!navResp.ok) {
    // If nav cannot be loaded, fall back to allowing only /dashboard
    if (pathname === '/dashboard') return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  const navJson = await navResp.json();
  const items: Array<{ path: string }> = navJson?.data?.navigation || [];

  // Build allowed set
  const allowed = new Set<string>();
  // Always allow base dashboard
  allowed.add('/dashboard');
  // Allow profile/settings if present in nav, else they might be hidden
  items.forEach((it) => {
    const norm = normalizePath(it.path || '');
    allowed.add(norm);
  });

  // Allow parent prefixes for section indexes (e.g., /dashboard/bookings/...)
  const isAllowed = Array.from(allowed).some((base) => {
    if (pathname === base) return true;
    if (base !== '/dashboard' && pathname.startsWith(base + '/')) return true;
    return false;
  });

  if (!isAllowed) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile', '/settings'],
};


