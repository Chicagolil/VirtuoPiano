import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';

export default async function middleware(req: NextRequest) {
  // Exclure complètement la route de maintenance pour les cron jobs
  if (req.nextUrl.pathname.startsWith('/api/admin/maintenance')) {
    return NextResponse.next();
  }

  // Vérifier si la requête est pour une route API
  if (req.nextUrl.pathname.startsWith('/api/')) {
    // Exclure les routes d'authentification et de contact
    if (
      req.nextUrl.pathname.startsWith('/api/auth') ||
      req.nextUrl.pathname.startsWith('/api/contact')
    ) {
      return NextResponse.next();
    }

    // Vérifier le Referer pour les routes API
    const referer = req.headers.get('referer');
    if (
      !referer ||
      !referer.includes(process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000')
    ) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier l'authentification par API key pour Unity
    const apiKey = req.headers.get('x-api-key');
    if (apiKey) {
      if (apiKey === process.env.UNITY_API_KEY) {
        return NextResponse.next();
      }
    }

    // Vérifier l'authentification par token JWT pour Unity
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'votre-secret-jwt'
        );
        req.headers.set('x-user-id', (decoded as any).id);
        return NextResponse.next();
      } catch (error) {
        return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
      }
    }

    // Si pas d'API key ni de token JWT valide, vérifier le token JWT pour l'authentification web
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
  }

  // Pour les pages (pas les APIs), vérifier l'authentification
  if (!req.nextUrl.pathname.startsWith('/api/')) {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return NextResponse.next();
}

// Configuration unifiée pour protéger les routes
export const config = {
  matcher: [
    // Protéger les routes API spécifiques (pas toutes)
    '/api/auth/:path*',
    '/api/contact/:path*',
    '/api/users/:path*',
    // Protéger toutes les pages sauf celles spécifiées
    '/((?!_next/static|_next/image|favicon.ico|auth|privacy-policy).*)',
  ],
};
