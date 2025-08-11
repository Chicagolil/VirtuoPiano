import { NextResponse } from 'next/server';
import argon2 from 'argon2';
import prisma from '@/lib/prisma';
import { registerSchema } from '@/lib/validations/auth-schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation des données avec Zod
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: `Erreur de validation: ${validationResult.error.errors[0].message}`,
        },
        { status: 400 }
      );
    }

    const { email, password, userName, privacyConsent } = validationResult.data;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe avec Argon2id
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64MB en KiB
      timeCost: 3, // Nombre d'itérations
      parallelism: 4, // Degré de parallélisme
    });

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userName,
        privacyConsent: true,
        privacyConsentAt: new Date(),
      },
    });

    // Ne pas renvoyer le mot de passe
    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'Utilisateur créé avec succès', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'inscription" },
      { status: 500 }
    );
  }
}
