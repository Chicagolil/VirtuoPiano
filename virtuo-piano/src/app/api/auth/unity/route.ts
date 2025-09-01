import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import argon2 from 'argon2';
import * as jose from 'jose';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Créer le token JWT
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'votre-secret-jwt'
    );
    const token = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      userName: user.userName,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        level: user.level,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'authentification Unity:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'authentification" },
      { status: 500 }
    );
  }
}
