import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prisma';
import argon2 from 'argon2';
import { LoginAttemptsService } from './services/login-attempts-service';

// Étendre le type Session pour inclure l'id
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
  },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Informations manquantes');
        }

        // Obtenir l'IP de la requête
        const ipAddress = LoginAttemptsService.getClientIP(req as any);
        const userAgent = (req as any)?.headers?.['user-agent'];

        // Vérifier si l'IP est bloquée pour cet email
        const blockStatus = await LoginAttemptsService.isIPBlockedForEmail(
          credentials.email,
          ipAddress
        );

        if (blockStatus.blocked) {
          const remainingMinutes = Math.ceil(
            (blockStatus.remainingTime || 0) / (1000 * 60)
          );
          throw new Error(
            `Trop de tentatives échouées. Réessayez dans ${remainingMinutes} minute${
              remainingMinutes > 1 ? 's' : ''
            }.`
          );
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          // Enregistrer la tentative échouée
          await LoginAttemptsService.recordAttempt({
            email: credentials.email,
            ipAddress,
            userAgent,
            success: false,
          });
          throw new Error('Identifiants invalides');
        }

        const isPasswordValid = await argon2.verify(
          user.password,
          credentials.password
        );

        if (!isPasswordValid) {
          // Enregistrer la tentative échouée
          await LoginAttemptsService.recordAttempt({
            email: credentials.email,
            ipAddress,
            userAgent,
            success: false,
          });
          throw new Error('Identifiants invalides');
        }

        if (!user.privacyConsent) {
          // Enregistrer la tentative échouée (bloquée par le consentement)
          await LoginAttemptsService.recordAttempt({
            email: credentials.email,
            ipAddress,
            userAgent,
            success: false,
          });
          throw new Error('PRIVACY_CONSENT_REQUIRED');
        }

        // Enregistrer la tentative réussie
        await LoginAttemptsService.recordAttempt({
          email: credentials.email,
          ipAddress,
          userAgent,
          success: true,
        });

        // Mettre à jour la dernière connexion
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.userName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
  },
};
