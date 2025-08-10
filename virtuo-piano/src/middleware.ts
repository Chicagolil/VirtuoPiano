import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';

export default withAuth(
  async function middleware(req) {
    // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
    if (!req.nextauth?.token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
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
          return NextResponse.json(
            { error: 'Token invalide' },
            { status: 401 }
          );
        }
      }

      // Si pas d'API key ni de token JWT valide, vérifier le token JWT pour l'authentification web
      const token = await getToken({ req });

      if (!token) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Configuration unifiée pour protéger les routes
export const config = {
  matcher: [
    // Protéger toutes les routes API
    '/api/:path*',
    // Protéger toutes les pages sauf celles spécifiées
    '/((?!_next/static|_next/image|favicon.ico|auth|privacy-policy).*)',
  ],
};
