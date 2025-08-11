import { NextRequest, NextResponse } from 'next/server';
import {
  getInactiveUsersAction,
  sendInactiveAccountWarningsAction,
  deleteInactiveUsersAction,
} from '@/lib/actions/RGPD-actions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'report':
        const reportResult = await getInactiveUsersAction();
        return NextResponse.json(reportResult);

      case 'warn':
        const warnResult = await sendInactiveAccountWarningsAction();
        return NextResponse.json(warnResult);

      case 'delete':
        const deleteResult = await deleteInactiveUsersAction();
        return NextResponse.json(deleteResult);

      default:
        return NextResponse.json(
          {
            success: false,
            message:
              'Action non reconnue. Actions disponibles: report, warn, delete',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erreur dans l'API de maintenance:", error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur interne du serveur',
      },
      { status: 500 }
    );
  }
}
