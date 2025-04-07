import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default withAuth(
  function middleware(req) {
    // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Middleware pour les routes API
export async function middleware(request: NextRequest) {
  // Vérifier si la requête est pour une route API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Exclure les routes d'authentification
    if (request.nextUrl.pathname.startsWith('/api/auth')) {
      return NextResponse.next();
    }

    // Vérifier l'authentification par API key pour Unity
    const apiKey = request.headers.get('x-api-key');
    if (apiKey) {
      // Vérifier si l'API key est valide
      // Remplacez 'votre-api-key-secrete' par une vraie clé secrète stockée dans vos variables d'environnement
      if (apiKey === process.env.UNITY_API_KEY) {
        return NextResponse.next();
      }
    }

    // Si pas d'API key valide, vérifier le token JWT pour l'authentification web
    const token = await getToken({ req: request });

    // Si pas de token, retourner une erreur 401
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// Configuration unifiée pour protéger les routes
export const config = {
  matcher: [
    // Protéger toutes les routes API
    '/api/:path*',
    // Protéger toutes les pages sauf celles spécifiées
    '/((?!_next/static|_next/image|favicon.ico|auth).*)',
  ],
};
