import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/auth-schemas';
import { EmailService } from '@/lib/services/email-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation des données avec Zod
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Erreur de validation: ${validationResult.error.errors[0].message}`,
        },
        { status: 400 }
      );
    }

    const contactData = validationResult.data;

    // Envoyer les emails
    const result = await EmailService.sendContactEmail(contactData);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur dans l'API contact:", error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur interne du serveur',
      },
      { status: 500 }
    );
  }
}
