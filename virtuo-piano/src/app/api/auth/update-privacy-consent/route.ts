import { NextResponse } from 'next/server';
import argon2 from 'argon2';
import prisma from '@/lib/prisma';
import { updatePrivacyConsentSchema } from '@/lib/validations/auth-schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation des données avec Zod
    const validationResult = updatePrivacyConsentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: `Erreur de validation: ${validationResult.error.errors[0].message}`,
        },
        { status: 400 }
      );
    }

    const { email, password, privacyConsent } = validationResult.data;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Mettre à jour le consentement
    await prisma.user.update({
      where: { id: user.id },
      data: {
        privacyConsent: true,
        privacyConsentAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message:
          'Consentement à la politique de confidentialité mis à jour avec succès',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour du consentement:', error);
    return NextResponse.json(
      {
        message:
          'Une erreur est survenue lors de la mise à jour du consentement',
      },
      { status: 500 }
    );
  }
}
