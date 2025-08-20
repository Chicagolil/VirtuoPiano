import prisma from '../prisma';
import { NextRequest } from 'next/server';

export interface LoginAttemptData {
  email: string;
  ipAddress: string;
  userAgent?: string;
  success: boolean;
}

export class LoginAttemptsService {
  /**
   * Enregistre une tentative de connexion
   */
  static async recordAttempt(data: LoginAttemptData): Promise<void> {
    try {
      // Trouver l'utilisateur si l'email existe
      const user = await prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true },
      });

      await prisma.loginAttempt.create({
        data: {
          email: data.email,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          success: data.success,
          userId: user?.id || null,
        },
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement de la tentative de connexion:",
        error
      );
    }
  }

  /**
   * Vérifie si une IP est bloquée pour un email spécifique
   */
  static async isIPBlockedForEmail(
    email: string,
    ipAddress: string
  ): Promise<{
    blocked: boolean;
    remainingTime?: number;
    attemptsCount: number;
  }> {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      // Compter les tentatives échouées pour cette IP et cet email dans les 15 dernières minutes
      const failedAttempts = await prisma.loginAttempt.count({
        where: {
          email: email,
          ipAddress: ipAddress,
          success: false,
          createdAt: {
            gte: fifteenMinutesAgo,
          },
        },
      });

      const isBlocked = failedAttempts >= 5;

      if (isBlocked) {
        // Calculer le temps restant avant déblocage
        const oldestAttempt = await prisma.loginAttempt.findFirst({
          where: {
            email: email,
            ipAddress: ipAddress,
            success: false,
            createdAt: {
              gte: fifteenMinutesAgo,
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        });

        if (oldestAttempt) {
          const blockEndTime = new Date(
            oldestAttempt.createdAt.getTime() + 30 * 60 * 1000
          );
          const remainingTime = Math.max(
            0,
            blockEndTime.getTime() - Date.now()
          );

          return {
            blocked: true,
            remainingTime,
            attemptsCount: failedAttempts,
          };
        }
      }

      return {
        blocked: false,
        attemptsCount: failedAttempts,
      };
    } catch (error) {
      console.error('Erreur lors de la vérification du blocage:', error);
      return {
        blocked: false,
        attemptsCount: 0,
      };
    }
  }

  /**
   * Nettoie les anciennes tentatives de connexion (plus de 24h)
   */
  static async cleanupOldAttempts(): Promise<void> {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      await prisma.loginAttempt.deleteMany({
        where: {
          createdAt: {
            lt: twentyFourHoursAgo,
          },
        },
      });
    } catch (error) {
      console.error(
        'Erreur lors du nettoyage des anciennes tentatives:',
        error
      );
    }
  }

  /**
   * Obtient les statistiques de tentatives de connexion pour un utilisateur
   */
  static async getUserLoginStats(userId: string): Promise<{
    totalAttempts: number;
    failedAttempts: number;
    successRate: number;
    lastAttempt?: Date;
  }> {
    try {
      const attempts = await prisma.loginAttempt.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const totalAttempts = attempts.length;
      const failedAttempts = attempts.filter((a) => !a.success).length;
      const successRate =
        totalAttempts > 0
          ? ((totalAttempts - failedAttempts) / totalAttempts) * 100
          : 0;

      return {
        totalAttempts,
        failedAttempts,
        successRate,
        lastAttempt: attempts[0]?.createdAt,
      };
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des statistiques de connexion:',
        error
      );
      return {
        totalAttempts: 0,
        failedAttempts: 0,
        successRate: 0,
      };
    }
  }

  /**
   * Obtient l'IP de la requête
   */
  static getClientIP(req: any): string {
    // Gestion des différents types d'objets de requête
    let headers: any;

    if (req?.headers?.get) {
      // NextRequest
      headers = req.headers;
    } else if (req?.headers) {
      // Objet avec headers simple
      headers = req.headers;
    } else {
      return 'unknown';
    }

    // Extraction des headers d'IP
    const getHeader = (name: string): string | null => {
      if (headers.get) {
        return headers.get(name);
      } else if (headers[name]) {
        return headers[name];
      } else if (headers[name.toLowerCase()]) {
        return headers[name.toLowerCase()];
      }
      return null;
    };

    const forwarded = getHeader('x-forwarded-for');
    const realIP = getHeader('x-real-ip');
    const cfConnectingIP = getHeader('cf-connecting-ip');

    // Priorité : Cloudflare > X-Real-IP > X-Forwarded-For > IP directe
    return (
      cfConnectingIP ||
      realIP ||
      (forwarded ? forwarded.split(',')[0] : 'unknown')
    );
  }
}
