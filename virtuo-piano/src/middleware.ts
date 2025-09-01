import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import * as jose from 'jose';

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

    // Vérifier le Referer pour les routes API (sauf pour Unity)
    const referer = req.headers.get('referer');
    const isUnityRequest =
      req.headers.get('x-api-key') || req.headers.get('authorization');

    if (
      !isUnityRequest &&
      (!referer ||
        !referer.includes(process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000'))
    ) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier l'authentification par API key pour Unity (uniquement pour contourner le referer)
    const apiKey = req.headers.get('x-api-key');
    const hasValidApiKey = apiKey && apiKey === process.env.UNITY_API_KEY;

    // Vérifier l'authentification par token JWT pour Unity
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      console.log(
        '🔍 Middleware - Token reçu:',
        token.substring(0, 50) + '...'
      );
      console.log(
        '🔍 Middleware - JWT_SECRET défini:',
        !!process.env.JWT_SECRET
      );

      try {
        const secret = new TextEncoder().encode(
          process.env.JWT_SECRET || 'votre-secret-jwt'
        );
        const { payload } = await jose.jwtVerify(token, secret);
        console.log('🔍 Middleware - Token décodé avec succès:', payload);
        req.headers.set('x-user-id', payload.id as string);
        return NextResponse.next();
      } catch (error) {
        console.error(
          '🔍 Middleware - Erreur de vérification du token:',
          error
        );
        return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
      }
    }

    // Si c'est une requête Unity avec API key valide mais sans token JWT, refuser l'accès
    if (hasValidApiKey) {
      return NextResponse.json(
        { error: "Token d'authentification requis" },
        { status: 401 }
      );
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
